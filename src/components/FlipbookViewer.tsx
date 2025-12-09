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
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(pages.length);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 400, height: 550 });

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
    setCurrentPage(e.data);
  };

  const goToPrevPage = () => {
    flipBookRef.current?.pageFlip()?.flipPrev();
  };

  const goToNextPage = () => {
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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleExport = () => {
    // Create a simple export simulation
    const link = document.createElement('a');
    link.href = pages[0];
    link.download = 'flipbook-page.png';
    link.click();
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
            flippingTime={600}
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
