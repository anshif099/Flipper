import { useState, useCallback } from 'react';
import { Book, Sparkles, ArrowRight, Loader2, Upload, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/FileUpload';
import FlipbookViewer from '@/components/FlipbookViewer';
import MetadataForm from '@/components/MetadataForm';
import { processFiles, ProcessingProgress } from '@/lib/pdfProcessor';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);
  const [showFlipbook, setShowFlipbook] = useState(false);
  const [showMetadataDialog, setShowMetadataDialog] = useState(false);

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setShowFlipbook(false);
    setPages([]);
    toast.success(`${newFiles.length} file${newFiles.length > 1 ? 's' : ''} added`);
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setShowFlipbook(false);
    setPages([]);
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
      setShowFlipbook(false);
      toast.success(
        `Flipbook created with ${generatedPages.length} pages! Please provide a few details.`
      );
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
    setShowMetadataDialog(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-50">
      {/* Header */}
      <header className="border-b border-amber-500/20 bg-black/40 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.7)]">
              <Book className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-xl font-semibold tracking-wide text-amber-300">
              FLIPBOOK CONVERTER
            </h1>
          </div>

          {/* Header buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/bloges')}
              className="border-amber-400/60 text-amber-300 hover:bg-amber-500 hover:text-black hover:border-amber-500 rounded-full px-4"
            >
              Blog
            </Button>

            {files.length > 0 || pages.length > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-slate-300 hover:text-amber-300"
              >
                Create New
              </Button>
            ) : null}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="rounded-3xl border border-amber-500/15 bg-black/40 shadow-[0_24px_80px_rgba(0,0,0,0.9)] p-6 md:p-8">
          {/* Title + subtitle */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 mb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-amber-100/80">
                  Upload PDFs or images to create an interactive flipbook
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold text-amber-300 tracking-wide">
                Flipbook Converter
              </h2>
              <p className="mt-2 text-sm md:text-base text-slate-300/80">
                Upload PDF or image files, generate a flipbook, preview it, and export or share
                your creation.
              </p>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            {/* LEFT: Upload panel */}
            <div className="rounded-3xl border border-amber-500/15 bg-slate-950/60 p-5 md:p-6 flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Upload className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-amber-200">
                    Upload Files
                  </h3>
                  <p className="text-xs text-slate-400">
                    Supported: PDF, JPG, PNG (Max: 10MB per file)
                  </p>
                </div>
              </div>

              {/* Upload area */}
              <div className="flex-1 rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-500/5 via-slate-950 to-slate-950/80 p-3 md:p-4">
                <FileUpload
                  onFilesSelected={handleFilesSelected}
                  files={files}
                  onRemoveFile={handleRemoveFile}
                />
              </div>

              {/* Actions row */}
              <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
                <Button
                  onClick={handleGenerateFlipbook}
                  disabled={isProcessing || files.length === 0}
                  className="w-full sm:w-auto bg-amber-500 text-black hover:bg-amber-400 font-semibold rounded-xl px-6"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Generate Flipbook
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={files.length === 0 && pages.length === 0}
                  className="w-full sm:w-auto rounded-xl border-slate-600/70 text-slate-200 hover:border-amber-400 hover:text-amber-200 hover:bg-amber-500/5"
                >
                  Clear All
                </Button>
              </div>

              {/* Progress */}
              {progress && (
                <div className="mt-4 space-y-2">
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300"
                      style={{ width: `${(progress.current / progress.total) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400">{progress.status}</p>
                </div>
              )}
            </div>

            {/* RIGHT: Preview panel */}
            <div className="rounded-3xl border border-amber-500/15 bg-slate-950/60 p-5 md:p-6 flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-amber-200">
                    Flipbook Preview
                  </h3>
                  <p className="text-xs text-slate-400">
                    Your generated flipbook appears here once ready.
                  </p>
                </div>
              </div>

              {/* Preview area */}
              <div className="flex-1 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/8 via-slate-950 to-slate-950/90 p-4 flex items-center justify-center">
                {showFlipbook && pages.length > 0 ? (
                  <FlipbookViewer pages={pages} compact />
                ) : (
                  <div className="text-center max-w-sm mx-auto py-10">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.8)] mx-auto mb-4 flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-black" />
                    </div>
                    <p className="text-sm md:text-base text-amber-50 font-medium mb-2">
                      Welcome to Flipbook Converter
                    </p>
                    <p className="text-xs md:text-sm text-slate-300">
                      Upload PDF or image files using the panel on the left, click{' '}
                      <span className="text-amber-300 font-semibold">Generate Flipbook</span>, fill in
                      your details, and your flipbook will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* How-to section */}
          <div className="mt-8 rounded-3xl border border-amber-500/15 bg-slate-950/70 p-5 md:p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-black text-sm font-semibold">
                ?
              </div>
              <h3 className="text-base md:text-lg font-semibold text-amber-200">
                How to use this flipbook converter
              </h3>
            </div>
            <ol className="mt-3 space-y-2 text-xs md:text-sm text-slate-300 list-decimal list-inside">
              <li>Click &quot;Browse Files&quot; or drag &amp; drop PDF or image files into the upload area.</li>
              <li>Click &quot;Generate Flipbook&quot; to convert your files into a flipbook.</li>
              <li>Fill in your details when prompted so the flipbook can be saved and shared.</li>
              <li>Use the flipbook controls to flip pages, zoom, or view fullscreen.</li>
              <li>Export your flipbook as a PDF or submit it to the blog if you’d like.</li>
            </ol>
          </div>
        </div>

        {/* Metadata dialog */}
        <MetadataForm
          open={showMetadataDialog}
          pagesCount={pages.length}
          onClose={() => setShowMetadataDialog(false)}
          onSaved={() => setShowFlipbook(true)}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-500/20 py-4 mt-auto bg-black/60">
        <div className="container mx-auto px-4 text-center text-xs md:text-sm text-slate-400">
          <p>Flipbook Converter © 2025 • Built with PDF.js and React PageFlip</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
