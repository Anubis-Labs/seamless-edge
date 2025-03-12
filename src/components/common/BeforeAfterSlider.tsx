import React, { useState, useRef, useEffect } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
  initialPosition?: number; // 0-100, default 50
  className?: string;
  showLabels?: boolean;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
  initialPosition = 50,
  className = '',
  showLabels = true,
}) => {
  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse events
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const mouseX = e.clientX - containerRect.left;
    let newPosition = (mouseX / containerWidth) * 100;

    // Constrain to 0-100
    newPosition = Math.max(0, Math.min(100, newPosition));
    setSliderPosition(newPosition);
  };

  // Handle touch events for mobile
  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const touchX = e.touches[0].clientX - containerRect.left;
    let newPosition = (touchX / containerWidth) * 100;

    // Constrain to 0-100
    newPosition = Math.max(0, Math.min(100, newPosition));
    setSliderPosition(newPosition);
  };

  // Add event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Mouse events
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    
    // Touch events
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchmove', handleTouchMove as any);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchmove', handleTouchMove as any);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full select-none overflow-hidden aspect-video ${className}`}
    >
      {/* After image (full width) */}
      <div className="absolute top-0 left-0 w-full h-full">
        <img 
          src={afterImage} 
          alt={afterAlt} 
          className="object-cover w-full h-full"
        />
        {showLabels && (
          <div className="absolute top-4 right-4 bg-accent-navy/80 text-white font-semibold text-sm px-3 py-1.5 rounded-full">
            After
          </div>
        )}
      </div>
      
      {/* Before image (partial width controlled by slider) */}
      <div 
        className="absolute top-0 left-0 h-full overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={beforeImage} 
          alt={beforeAlt} 
          className="object-cover h-full"
          style={{ width: `${100 / (sliderPosition / 100)}%`, maxWidth: 'none', minWidth: '100%' }}
        />
        {showLabels && (
          <div className="absolute top-4 left-4 bg-accent-navy/80 text-white font-semibold text-sm px-3 py-1.5 rounded-full">
            Before
          </div>
        )}
      </div>
      
      {/* Slider control */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-md"
        style={{ left: `calc(${sliderPosition}% - 0.5px)` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Slider grip */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white shadow-md border-2 border-accent-navy flex items-center justify-center">
          <div className="flex items-center justify-center">
            <svg className="h-5 w-5 text-accent-navy" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5L3 10L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 5L21 10L16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider; 