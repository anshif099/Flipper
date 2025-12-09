import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source using CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ProcessingProgress {
  current: number;
  total: number;
  status: string;
}

export async function processPDF(
  file: File,
  onProgress?: (progress: ProcessingProgress) => void
): Promise<string[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];
  
  const numPages = pdf.numPages;
  
  for (let i = 1; i <= numPages; i++) {
    onProgress?.({
      current: i,
      total: numPages,
      status: `Processing page ${i} of ${numPages}...`
    });
    
    const page = await pdf.getPage(i);
    const scale = 2; // Higher scale for better quality
    const viewport = page.getViewport({ scale });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Failed to get canvas context');
    }
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;
    
    const imageData = canvas.toDataURL('image/png');
    pages.push(imageData);
  }
  
  return pages;
}

export async function processImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read image file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

export async function processFiles(
  files: File[],
  onProgress?: (progress: ProcessingProgress) => void
): Promise<string[]> {
  const allPages: string[] = [];
  let processedFiles = 0;
  
  for (const file of files) {
    if (file.type === 'application/pdf') {
      const pages = await processPDF(file, (progress) => {
        onProgress?.({
          current: processedFiles * 10 + progress.current,
          total: files.length * 10,
          status: `Processing ${file.name}: ${progress.status}`
        });
      });
      allPages.push(...pages);
    } else if (file.type.startsWith('image/')) {
      onProgress?.({
        current: processedFiles + 1,
        total: files.length,
        status: `Processing ${file.name}...`
      });
      const imageData = await processImage(file);
      allPages.push(imageData);
    }
    processedFiles++;
  }
  
  return allPages;
}
