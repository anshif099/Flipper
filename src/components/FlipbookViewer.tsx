import { useRef, useState, useEffect, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Download,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { saveSubmission } from '@/lib/firebase';
import { toast } from 'sonner';

interface FlipbookViewerProps {
  // IMPORTANT: `pages` should contain ONLY inner pages.
  // Cover (Logo.png) and last Thank You page are added automatically.
  pages: string[];
  // Optional: disable submit button (used on Blog page)
  allowSubmit?: boolean;
}

interface PageProps {
  children?: React.ReactNode;
  pageNumber?: number;
  imageSrc?: string;
}

// ✅ Page: renders either image, children, or placeholder
const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ imageSrc, pageNumber, children }, ref) => {
    return (
      <div ref={ref} className="page-paper w-full h-full overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`Page ${pageNumber}`}
            className="w-full h-full object-contain"
          />
        ) : children ? (
          <div className="w-full h-full flex items-center justify-center">
            {children}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-page-cream">
            <p className="text-muted-foreground">Page {pageNumber}</p>
          </div>
        )}
      </div>
    );
  }
);

Page.displayName = 'Page';

const FlipbookViewer = ({ pages, allowSubmit = true }: FlipbookViewerProps) => {
  const flipBookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevPageRef = useRef<number>(0);

  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 400, height: 550 });
  const [flippingTime, setFlippingTime] = useState(600);
  const [enableRolling, setEnableRolling] = useState(false);
  const [enableSound, setEnableSound] = useState(true);
  const [userMeta, setUserMeta] = useState<{
    name?: string;
    email?: string;
    location?: string;
    company?: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // TOTAL pages = cover + inner pages + thank you
  const totalPages = pages.length + 2;

  // Load user meta & handle responsive dimensions
  useEffect(() => {
    try {
      const raw = localStorage.getItem('flipper_user');
      if (raw) setUserMeta(JSON.parse(raw));
    } catch {}

    const updateDimensions = () => {
      const container = containerRef.current;
      if (container) {
        const containerWidth = container.clientWidth;
        const containerHeight = window.innerHeight * 0.7;

        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);

        const aspectRatio = mobile ? 0.7 : 0.75;

        // width is per page; book may be 2*width on desktop
        let width = mobile
          ? Math.min(containerWidth * 0.9, 480) // almost full width on mobile
          : Math.min(containerWidth * 0.45, 500);

        let height = width / aspectRatio;

        if (height > containerHeight) {
          height = containerHeight;
          width = height * aspectRatio;
        }

        setDimensions({ width: Math.floor(width), height: Math.floor(height) });

        // reset zoom on mobile
        if (mobile) setZoom(1);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isFullscreen]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('flipper_user');
      if (raw) setUserMeta(JSON.parse(raw));
    } catch {}
  }, []);

  const handlePageFlip = (e: any) => {
    const newPage = e.data; // 0-based index including covers
    prevPageRef.current = newPage;
    setCurrentPage(newPage);
    if (enableSound) playPaperSound();
    if (enableRolling) triggerRollingAnimation(newPage > prevPageRef.current ? 'right' : 'left');
  };

  const goToPrevPage = () => {
    if (enableRolling) triggerRollingAnimation('left');
    if (enableSound) playPaperSound();
    flipBookRef.current?.pageFlip()?.flipPrev();
  };

  const goToNextPage = () => {
    if (enableRolling) triggerRollingAnimation('right');
    if (enableSound) playPaperSound();
    flipBookRef.current?.pageFlip()?.flipNext();
  };

  const handleZoomIn = () => {
    if (isMobile) return; // disable zoom scaling on mobile to avoid cut-off
    setZoom((prev) => Math.min(prev + 0.25, 2));
  };

  const handleZoomOut = () => {
    if (isMobile) return;
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const triggerRollingAnimation = (_direction: 'left' | 'right') => {
    // rolling animation disabled
    return;
  };

  const ensureAudioContext = () => {
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      } catch (err) {
        console.error('Unable to create AudioContext', err);
      }
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const unlock = () => {
      ensureAudioContext();
      const ctx = audioCtxRef.current;
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      el.removeEventListener('pointerdown', unlock);
    };

    el.addEventListener('pointerdown', unlock, { once: true });
    return () => el.removeEventListener('pointerdown', unlock);
  }, []);

  const playPaperSound = async () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('/paper-flip.mp3');
        audioRef.current.preload = 'auto';
      }
      const audio = audioRef.current;
      if (audio) {
        ensureAudioContext();
        try {
          try {
            audio.currentTime = 0;
          } catch {}
          await audio.play();
          return;
        } catch {}
      }
    } catch {}

    try {
      ensureAudioContext();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') await ctx.resume();

      const o = ctx.createOscillator();
      const g = ctx.createGain();
      const b = ctx.createBiquadFilter();

      o.type = 'triangle';
      o.frequency.value = 400;
      b.type = 'highpass';
      b.frequency.value = 400;

      o.connect(b);
      b.connect(g);
      g.connect(ctx.destination);

      const now = ctx.currentTime;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.9, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      o.start(now);
      o.stop(now + 0.65);
    } catch (err) {
      console.error('Audio error', err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleExport = () => {
    exportFlipbook(false).catch((err) => console.error('Export failed', err));
  };

  const exportFlipbook = async (returnBlob = false) => {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });

    const drawImageOnPdf = async (imgSrc: string) => {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => resolve(image);
        image.onerror = (e) => reject(e);
        image.src = imgSrc;
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
      const imgWidth = img.width * ratio;
      const imgHeight = img.height * ratio;
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;
      pdf.addImage(img, 'JPEG', x, y, imgWidth, imgHeight);
    };

    // COVER page (Logo + title)
    try {
      const logoSrc = '/Logo.png';
      const pageWidth = pdf.internal.pageSize.getWidth();
      pdf.setFontSize(28);
      pdf.text('Flipper', pageWidth / 2, 120, { align: 'center' });
      try {
        await drawImageOnPdf(logoSrc);
      } catch {}
      if (userMeta?.name) {
        pdf.setFontSize(14);
        pdf.text(`Owner: ${userMeta.name}`, pageWidth / 2, pageWidth - 80, {
          align: 'center',
        });
      }
    } catch {}

    // INNER PAGES from `pages[]`
    for (let i = 0; i < pages.length; i++) {
      pdf.addPage();
      try {
        await drawImageOnPdf(pages[i]);
      } catch (e) {
        console.warn('Image draw failed', e);
      }
    }

    // LAST "Thank you" PAGE
    pdf.addPage();
    try {
      const logoSrc = '/Logo.png';
      await drawImageOnPdf(logoSrc);
    } catch {}
    pdf.setFontSize(20);
    pdf.text(
      'Thank you for using Flipper',
      pdf.internal.pageSize.getWidth() / 2,
      160,
      { align: 'center' }
    );
    pdf.setFontSize(12);
    pdf.text(
      'Share your flipbook with others!',
      pdf.internal.pageSize.getWidth() / 2,
      190,
      { align: 'center' }
    );

    if (returnBlob) {
      const blob = pdf.output('blob');
      return blob;
    }

    pdf.save('flipbook.pdf');
    return null;
  };

  const handleShare = async () => {
    try {
      const blob = await exportFlipbook(true);
      if (!blob) return;
      const file = new File([blob], 'flipbook.pdf', { type: 'application/pdf' });
      if ((navigator as any).canShare && (navigator as any).canShare({ files: [file] })) {
        try {
          await (navigator as any).share({
            files: [file],
            title: 'My Flipbook',
            text: 'Check out my flipbook',
          });
          return;
        } catch (err) {
          console.warn('Share failed', err);
        }
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'flipbook.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Share failed', err);
    }
  };

  // Submit flipbook to Firebase
  const handleSubmitFlipbook = async () => {
    if (!pages || pages.length === 0) {
      toast.error('No pages to submit');
      return;
    }

    setIsSubmitting(true);
    try {
      const submission = {
        pages,
        user: userMeta || {},
        createdAt: Date.now(),
        stats: {
          likes: 0,
          views: 0,
          shares: 0,
        },
      };

      const id = await saveSubmission(submission);
      toast.success('Flipbook submitted to Blog successfully!');
      console.log('Saved submission with id:', id);
    } catch (err) {
      console.error('Submit failed', err);
      toast.error('Failed to submit flipbook. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex flex-col items-center justify-center py-4 sm:py-8 px-2 sm:px-4 animate-fade-up w-full overflow-x-hidden',
        isFullscreen && 'fixed inset-0 z-50 bg-background p-4 sm:p-8'
      )}
    >
      {/* Controls - Top */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full max-w-4xl mb-4 sm:mb-6 gap-3 px-1 sm:px-4">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground font-medium">
            Page {currentPage + 1} of {totalPages}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 text-xs sm:text-sm">
          <Button
            variant="icon"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5 || isMobile}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2 ml-0 sm:ml-2 w-full sm:w-auto">
            <label className="text-[11px] text-muted-foreground whitespace-nowrap">
              Flip speed
            </label>
            <input
              type="range"
              min={200}
              max={1500}
              step={50}
              value={flippingTime}
              onChange={(e) => setFlippingTime(Number(e.target.value))}
              className="w-full sm:w-40"
            />
            <span className="text-[11px] text-muted-foreground min-w-[3rem] text-right">
              {flippingTime}ms
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEnableRolling((prev) => !prev)}
            aria-pressed={enableRolling}
            className="px-2"
          >
            {enableRolling ? 'Rolling: On' : 'Rolling: Off'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEnableSound((prev) => !prev)}
            aria-pressed={enableSound}
            className="px-2"
          >
            {enableSound ? 'Sound: On' : 'Sound: Off'}
          </Button>

          <span className="text-xs sm:text-sm text-muted-foreground min-w-[3rem] text-center hidden sm:inline">
            {Math.round(zoom * 100)}%
          </span>

          <Button
            variant="icon"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoom >= 2 || isMobile}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1 sm:mx-2" />

          <Button variant="icon" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>

          <Button variant="icon" size="icon" onClick={handleExport}>
            <Download className="w-4 h-4" />
          </Button>

          {allowSubmit && (
            <Button
              variant="default"
              size="sm"
              className="ml-1"
              onClick={handleSubmitFlipbook}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-1" />
                  Submit
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Flipbook */}
      <div
        className="flipbook-container flex items-center justify-center w-full overflow-x-hidden"
        style={{
          transform: `scale(${isMobile ? 1 : zoom})`,
          transformOrigin: 'center center',
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevPage}
          disabled={currentPage === 0}
          className="mr-2 sm:mr-4 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-secondary/80 hover:bg-secondary disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>

        <div className="book-shadow rounded-lg overflow-hidden max-w-full">
          <HTMLFlipBook
            ref={flipBookRef}
            width={dimensions.width}
            height={dimensions.height}
            size="stretch"
            minWidth={220}
            maxWidth={600}
            minHeight={320}
            maxHeight={800}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={handlePageFlip}
            className="flipbook"
            style={{}}
            startPage={0}
            drawShadow={true}
            flippingTime={flippingTime}
            usePortrait={isMobile}
            startZIndex={0}
            autoSize={true}
            maxShadowOpacity={0.5}
            showPageCorners={true}
            disableFlipByClick={false}
            swipeDistance={30}
            clickEventForward={true}
            useMouseEvents={true}
          >
            {/* FIRST COVER: always Logo.png */}
            <Page pageNumber={1}>
              <div className="w-full h-full flex flex-col items-center justify-center">
                <img
                  src="/Logo.png"
                  alt="Logo"
                  className="w-24 h-24 sm:w-32 sm:h-32 object-contain mb-4"
                />
                <h2 className="text-xl sm:text-2xl font-serif">Flipper</h2>
                {userMeta?.name && (
                  <p className="mt-4 text-xs sm:text-sm">Created by {userMeta.name}</p>
                )}
              </div>
            </Page>

            {/* INNER PAGES */}
            {pages.map((page, index) => (
              <Page key={index} pageNumber={index + 2} imageSrc={page} />
            ))}

            {/* LAST COVER: Thank You + Logo */}
            <Page pageNumber={totalPages}>
              <div className="w-full h-full flex flex-col items-center justify-center">
                <h3 className="text-lg sm:text-xl font-semibold">Thank you</h3>
                <p className="text-xs sm:text-sm mt-2">
                  We hope you enjoyed your flipbook.
                </p>
                <img
                  src="/Logo.png"
                  alt="Logo"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain mt-6"
                />
              </div>
            </Page>
          </HTMLFlipBook>
        </div>

        {totalPages > 10 && (
          <span className="text-[10px] sm:text-xs text-muted-foreground ml-1 sm:ml-2">
            +{totalPages - 10} more
          </span>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextPage}
          disabled={currentPage === totalPages - 1}
          className="ml-2 sm:ml-4 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-secondary/80 hover:bg-secondary disabled:opacity-30"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
      </div>
    </div>
  );
};

export default FlipbookViewer;
