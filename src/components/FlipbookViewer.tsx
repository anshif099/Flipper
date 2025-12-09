import { useRef, useState, useEffect, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, Minimize, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FlipbookViewerProps {
  pages: string[];
}

interface PageProps {
  children?: React.ReactNode;
  pageNumber?: number;
  imageSrc?: string;
}

const Page = forwardRef<HTMLDivElement, PageProps>((props, ref) => {
  return (
    <div ref={ref} className="page-paper w-full h-full overflow-hidden">
      {props.imageSrc ? (
        <img 
          src={props.imageSrc} 
          alt={`Page ${props.pageNumber}`}
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-page-cream">
          <p className="text-muted-foreground">Page {props.pageNumber}</p>
        </div>
      )}
    </div>
  );
});

Page.displayName = 'Page';

const FlipbookViewer = ({ pages }: FlipbookViewerProps) => {
  const flipBookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rollingTimeoutRef = useRef<number | null>(null);
  const prevPageRef = useRef<number>(0);
  const animatingRef = useRef(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(pages.length);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 400, height: 550 });
  const [flippingTime, setFlippingTime] = useState(600);
  const [enableRolling, setEnableRolling] = useState(true);
  const [enableSound, setEnableSound] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      const container = containerRef.current;
      if (container) {
        const containerWidth = container.clientWidth;
        const containerHeight = window.innerHeight * 0.7;
        
        // Maintain aspect ratio (roughly 3:4 for book pages)
        const aspectRatio = 0.75;
        let width = Math.min(containerWidth * 0.45, 500);
        let height = width / aspectRatio;
        
        if (height > containerHeight) {
          height = containerHeight;
          width = height * aspectRatio;
        }
        
        setDimensions({ width: Math.floor(width), height: Math.floor(height) });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isFullscreen]);

  const handlePageFlip = (e: any) => {
    const newPage = e.data;
    const prev = prevPageRef.current;
    const direction = newPage > prev ? 'right' : 'left';
    prevPageRef.current = newPage;
    setCurrentPage(newPage);
    // play sound and animate rolling when a flip completes
    if (enableSound) playPaperSound();
    if (enableRolling) {
      triggerRollingAnimation(direction);
    }
  };

  const goToPrevPage = () => {
    // trigger human flip animation for left direction, then flip
    if (enableRolling) triggerRollingAnimation('left');
    if (enableSound) playPaperSound();
    flipBookRef.current?.pageFlip()?.flipPrev();
  };

  const goToNextPage = () => {
    // trigger human flip animation for right direction, then flip
    if (enableRolling) triggerRollingAnimation('right');
    if (enableSound) playPaperSound();
    flipBookRef.current?.pageFlip()?.flipNext();
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
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

  const triggerRollingAnimation = (direction: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) return;
    // prevent spamming animation
    if (animatingRef.current) return;
    animatingRef.current = true;

    // set animation duration to match flippingTime
    try {
      el.style.setProperty('--roll-duration', `${flippingTime}ms`);
    } catch {}

    const cls = direction === 'right' ? 'page-rolling-right' : 'page-rolling-left';
    el.classList.add(cls);
    if (rollingTimeoutRef.current) window.clearTimeout(rollingTimeoutRef.current as any);
    rollingTimeoutRef.current = window.setTimeout(() => {
      el.classList.remove(cls);
      rollingTimeoutRef.current = null;
      animatingRef.current = false;
    }, flippingTime + 120);
  };

  // Ensure AudioContext exists (created lazily). Many browsers require user gesture to resume.
  const ensureAudioContext = () => {
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
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
      // remove this listener after first interaction
      el.removeEventListener('pointerdown', unlock);
    };

    // Attach pointerdown to unlock audio on first user gesture
    el.addEventListener('pointerdown', unlock, { once: true });
    return () => el.removeEventListener('pointerdown', unlock);
  }, []);

  const playPaperSound = async () => {
    try {
      ensureAudioContext();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

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
    // Generate a multi-page PDF from all page images using jspdf
    (async () => {
      try {
        const { jsPDF } = await import('jspdf');
        const pdf = new jsPDF({ unit: 'pt', format: 'a4' });

        for (let i = 0; i < pages.length; i++) {
          const imgSrc = pages[i];
          // load image
          const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();
            // attempt to handle cross-origin images
            image.crossOrigin = 'anonymous';
            image.onload = () => resolve(image);
            image.onerror = (e) => reject(e);
            image.src = imgSrc;
          });

          // Fit image to page while preserving aspect ratio
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
          const imgWidth = img.width * ratio;
          const imgHeight = img.height * ratio;
          const x = (pageWidth - imgWidth) / 2;
          const y = (pageHeight - imgHeight) / 2;

          // draw image
          pdf.addImage(img, 'JPEG', x, y, imgWidth, imgHeight);

          if (i < pages.length - 1) pdf.addPage();
        }

        pdf.save('flipbook.pdf');
      } catch (err) {
        console.error('Export failed', err);
        // Fallback: download first image if PDF generation fails
        const link = document.createElement('a');
        link.href = pages[0];
        link.download = 'flipbook-page.png';
        link.click();
      }
    })();
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "flex flex-col items-center justify-center py-8 animate-fade-up",
        isFullscreen && "fixed inset-0 z-50 bg-background p-8"
      )}
    >
      {/* Controls - Top */}
      <div className="flex items-center justify-between w-full max-w-4xl mb-6 px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium">
            Page {currentPage + 1} of {totalPages}
          </span>
        </div>
        
          <div className="flex items-center gap-2">
          <Button 
            variant="icon" 
            size="icon"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
            <div className="flex items-center gap-2 ml-2">
              <label className="text-xs text-muted-foreground">Flip speed</label>
              <input
                type="range"
                min={200}
                max={1500}
                step={50}
                value={flippingTime}
                onChange={(e) => setFlippingTime(Number(e.target.value))}
                className="w-40"
              />
              <span className="text-xs text-muted-foreground min-w-[3rem] text-center">{flippingTime}ms</span>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <label className="text-sm text-muted-foreground">Rolling</label>
              <input type="checkbox" checked={enableRolling} onChange={(e) => setEnableRolling(e.target.checked)} />
            </div>
            <div className="flex items-center gap-2 ml-2">
              <label className="text-sm text-muted-foreground">Sound</label>
              <input type="checkbox" checked={enableSound} onChange={(e) => setEnableSound(e.target.checked)} />
            </div>
          <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button 
            variant="icon" 
            size="icon"
            onClick={handleZoomIn}
            disabled={zoom >= 2}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-2" />
          <Button 
            variant="icon" 
            size="icon"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
          <Button 
            variant="icon" 
            size="icon"
            onClick={handleExport}
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Flipbook */}
      <div 
        className="flipbook-container flex items-center justify-center"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevPage}
          disabled={currentPage === 0}
          className="mr-4 h-12 w-12 rounded-full bg-secondary/80 hover:bg-secondary disabled:opacity-30"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <div className="book-shadow rounded-lg overflow-hidden">
          <HTMLFlipBook
            ref={flipBookRef}
            width={dimensions.width}
            height={dimensions.height}
            size="stretch"
            minWidth={300}
            maxWidth={600}
            minHeight={400}
            maxHeight={800}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={handlePageFlip}
            className="flipbook"
            style={{}}
            startPage={0}
            drawShadow={true}
            flippingTime={flippingTime}
            usePortrait={false}
            startZIndex={0}
            autoSize={true}
            maxShadowOpacity={0.5}
            showPageCorners={true}
            disableFlipByClick={false}
            swipeDistance={30}
            clickEventForward={true}
            useMouseEvents={true}
          >
            {pages.map((page, index) => (
              <Page key={index} pageNumber={index + 1} imageSrc={page} />
            ))}
          </HTMLFlipBook>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextPage}
          disabled={currentPage >= totalPages - 1}
          className="ml-4 h-12 w-12 rounded-full bg-secondary/80 hover:bg-secondary disabled:opacity-30"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Page Indicator */}
      <div className="flex items-center gap-1 mt-6">
        {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              i === currentPage 
                ? "bg-primary w-6" 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
          />
        ))}
        {totalPages > 10 && (
          <span className="text-xs text-muted-foreground ml-2">+{totalPages - 10} more</span>
        )}
      </div>
    </div>
  );
};

export default FlipbookViewer;
