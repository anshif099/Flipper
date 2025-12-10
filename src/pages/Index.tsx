import { useState, useCallback } from 'react';
import { Book, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/FileUpload';
import FlipbookViewer from '@/components/FlipbookViewer';
import MetadataForm from '@/components/MetadataForm';
import { processFiles, ProcessingProgress } from '@/lib/pdfProcessor';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';   // ✅ IMPORT

const Index = () => {
  const navigate = useNavigate(); // ✅ INIT NAVIGATION

  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);
  const [showFlipbook, setShowFlipbook] = useState(false);
  const [showMetadataDialog, setShowMetadataDialog] = useState(false);

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    setShowFlipbook(false);
    toast.success(`${newFiles.length} file${newFiles.length > 1 ? 's' : ''} added`);
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setShowFlipbook(false);
  }, []);

  const handleGenerateFlipbook = async () => {
    if (files.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }

    setIsProcessing(true);
    setProgress({ current: 0, total: 100, status: 'Starting...' });

    try {
      const generatedPages = await processFiles(files, setProgress);

      if (generatedPages.length === 0) {
        throw new Error('No pages were generated');
      }

      setPages(generatedPages);
      setShowMetadataDialog(true);
      toast.success(`Flipbook created with ${generatedPages.length} pages! Please provide a few details.`);
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Failed to process files. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setPages([]);
    setShowFlipbook(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[hsl(32,75%,50%)] flex items-center justify-center shadow-glow">
              <Book className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-serif font-semibold text-foreground">Flipper</h1>
          </div>

          {/* HEADER BUTTONS */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/bloges')}
            >
              Bloges
            </Button>

            {showFlipbook && (
              <Button variant="outline" onClick={handleReset}>
                Create New
              </Button>
            )}
          </div>

        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {pages.length === 0 ? (
          <div className="max-w-3xl mx-auto">
            
            {/* Hero */}
            <div className="text-center mb-12 animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border/50 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Transform documents into interactive flipbooks</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 leading-tight">
                Create Beautiful
                <span className="block text-primary">Digital Flipbooks</span>
              </h2>

              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Upload your PDFs and images to create stunning, interactive flipbooks with realistic page-turning effects.
              </p>
            </div>

            {/* Upload */}
            <FileUpload 
              onFilesSelected={handleFilesSelected}
              files={files}
              onRemoveFile={handleRemoveFile}
            />

            {/* Generate */}
            {files.length > 0 && (
              <div className="mt-8 text-center animate-scale-in">
                <Button
                  onClick={handleGenerateFlipbook}
                  disabled={isProcessing}
                  variant="gold"
                  size="lg"
                  className="min-w-[200px]"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Flipbook</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>

                {progress && (
                  <div className="mt-4 space-y-2">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden max-w-md mx-auto">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-[hsl(32,75%,50%)] transition-all duration-300"
                        style={{ width: `${(progress.current / progress.total) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">{progress.status}</p>
                  </div>
                )}
              </div>
            )}

            {/* Features */}
            <div className="mt-16 grid md:grid-cols-3 gap-6">
              {[
                { title: 'PDF Support', description: 'Convert multi-page PDFs into flipbooks' },
                { title: 'Image Support', description: 'Add JPG and PNG images as pages' },
                { title: 'Realistic Effects', description: 'Smooth page-turning animations' },
              ].map((feature, index) => (
                <div 
                  key={feature.title}
                  className="p-6 rounded-2xl bg-secondary/30 border border-border/50 text-center animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <h3 className="font-serif font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

          </div>
        ) : (
          <>
            <FlipbookViewer pages={pages} />
            <MetadataForm
              open={showMetadataDialog}
              pagesCount={pages.length}
              onClose={() => setShowMetadataDialog(false)}
              onSaved={() => setShowFlipbook(true)}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built with PDF.js and React PageFlip</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
