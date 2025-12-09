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
  // disable rolling animation by default
  const [enableRolling, setEnableRolling] = useState(false);
  const [enableSound, setEnableSound] = useState(true);
  const [userMeta, setUserMeta] = useState<{name?:string,email?:string,location?:string,company?:string} | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // load prefills / metadata from localStorage to show inside cover
    try {
      const raw = localStorage.getItem('flipper_user');
      if (raw) setUserMeta(JSON.parse(raw));
    } catch {}

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

  useEffect(() => {
    // reload metadata when component mounts (in case user edited earlier)
    try {
      const raw = localStorage.getItem('flipper_user');
      if (raw) setUserMeta(JSON.parse(raw));
    } catch {}
  }, []);

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

  const triggerRollingAnimation = (_direction: 'left' | 'right') => {
    // Rolling animation disabled — no-op to avoid adding classes/CSS animations.
    return;
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
    // Try recorded audio first (public/paper-flip.mp3). If missing or playback fails, fallback to synth.
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('/paper-flip.mp3');
        audioRef.current.preload = 'auto';
      }
      const audio = audioRef.current;
      if (audio) {
        // ensure AudioContext unlocked
        ensureAudioContext();
        try {
          try { audio.currentTime = 0; } catch {}
          await audio.play();
          return;
        } catch (err) {
          // recorded playback failed, fallback to synth
        }
      }
    } catch (err) {
      // ignore and fallback
    }

    // Synth fallback
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
    exportFlipbook(false).catch((err)=> console.error('Export failed', err));
  };

  // Export flipbook; if returnBlob === true, return a Blob instead of prompting download
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

    // first cover (logo/title)
    try {
      const logoSrc = '/Logo.png';
      // draw a simple cover page with logo and user metadata
      const pageWidth = pdf.internal.pageSize.getWidth();
      pdf.setFontSize(28);
      pdf.text('Flipper', pageWidth / 2, 120, { align: 'center' });
      try { await drawImageOnPdf(logoSrc); } catch {}
      if (userMeta?.name) {
        pdf.setFontSize(14);
        pdf.text(`Owner: ${userMeta.name}`, pageWidth / 2, pageWidth - 80, { align: 'center' });
      }
    } catch {}

    for (let i = 0; i < pages.length; i++) {
      if (i > 0) pdf.addPage();
      try { await drawImageOnPdf(pages[i]); } catch (e) { console.warn('Image draw failed', e); }
    }

    // last page thank you
    pdf.addPage();
    try {
      const logoSrc = '/Logo.png';
      await drawImageOnPdf(logoSrc);
    } catch {}
    pdf.setFontSize(20);
    pdf.text('Thank you for using Flipper', pdf.internal.pageSize.getWidth() / 2, 160, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text('Share your flipbook with others!', pdf.internal.pageSize.getWidth() / 2, 190, { align: 'center' });

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
      // Web Share API with files
      if ((navigator as any).canShare && (navigator as any).canShare({ files: [file] })) {
        try {
          await (navigator as any).share({ files: [file], title: 'My Flipbook', text: 'Check out my flipbook' });
          return;
        } catch (err) {
          console.warn('Share failed', err);
        }
      }

      // fallback: prompt download
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEnableRolling(prev => !prev)}
                aria-pressed={enableRolling}
                className="px-2"
              >
                {enableRolling ? 'Rolling: On' : 'Rolling: Off'}
              </Button>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEnableSound(prev => !prev)}
                aria-pressed={enableSound}
                className="px-2"
              >
                {enableSound ? 'Sound: On' : 'Sound: Off'}
              </Button>
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
            {/* First cover */}
            <Page pageNumber={0}>
              <div className="w-full h-full flex flex-col items-center justify-center">
                <img src="/Logo.png" alt="Logo" className="w-32 h-32 object-contain mb-4" />
                <h2 className="text-2xl font-serif">Flipper</h2>
                {userMeta?.name && <p className="mt-4 text-sm">Created by {userMeta.name}</p>}
              </div>
            </Page>

            {pages.map((page, index) => (
              <Page key={index} pageNumber={index + 1} imageSrc={page} />
            ))}

            {/* Last cover / thank you */}
            <Page pageNumber={pages.length + 1}>
              <div className="w-full h-full flex flex-col items-center justify-center">
                <h3 className="text-xl font-semibold">Thank you</h3>
                <p className="text-sm mt-2">We hope you enjoyed your flipbook.</p>
                <img src="/Logo.png" alt="Logo" className="w-20 h-20 object-contain mt-6" />
              </div>
            </Page>
          </HTMLFlipBook>
        </div>
        {totalPages > 10 && (
          <span className="text-xs text-muted-foreground ml-2">+{totalPages - 10} more</span>
        )}
      </div>
    </div>
  );
};

export default FlipbookViewer;
