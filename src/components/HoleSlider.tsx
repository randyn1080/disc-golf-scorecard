// src/components/HoleSlider.tsx
import React, { useRef, useEffect } from 'react';

interface HoleSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

const HoleSlider: React.FC<HoleSliderProps> = ({ min, max, value, onChange }) => {
  // Generate an array of holes from min to max.
  const holes = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  
  // Reference to the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // References for each hole element
  const holeElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  // Resize holeElementsRef array when the number of holes changes
  useEffect(() => {
    holeElementsRef.current = holeElementsRef.current.slice(0, holes.length);
    while (holeElementsRef.current.length < holes.length) {
      holeElementsRef.current.push(null);
    }
  }, [holes.length]);
  
  // Effect to scroll to the selected hole when value changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      // Find the index of the current value in our holes array
      const currentIndex = value - min;
      
      // Get the selected hole element using our refs
      const selectedElement = holeElementsRef.current[currentIndex];
      
      if (selectedElement) {
        // Get container width
        const containerWidth = scrollContainerRef.current.clientWidth;
        
        // Get element position relative to the container
        const elementOffsetLeft = selectedElement.offsetLeft;
        const elementWidth = selectedElement.offsetWidth;
        
        // Calculate the desired scroll position so the element is slightly right of center
        // Position it 40% from the left (instead of 50% which would be center)
        const leftPosition = elementOffsetLeft - (containerWidth * 0.4) + (elementWidth / 2);
        
        // Smoothly scroll to the calculated position
        scrollContainerRef.current.scrollTo({
          left: leftPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [value, min]);
  
  return (
    // This outer div is the dedicated scrollable container.
    <div
      ref={scrollContainerRef}
      style={{
        overflowX: 'auto',
        maxWidth: '100%',
        padding: '1rem',
        boxSizing: 'border-box',
        // Optional: Hide scrollbar in some browsers (if desired)
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
      }}
    >
      {/* Inner flex container holding all the hole elements */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {holes.map((hole, index) => (
          <div
            key={hole}
            ref={el => holeElementsRef.current[index] = el}
            onClick={() => onChange(hole)}
            style={{
              padding: '0.2rem 1rem',
              backgroundColor: hole === value ? '#0070f3' : '#ddd',
              color: hole === value ? '#fff' : '#333',
              borderRadius: '8px',
              cursor: 'pointer',
              minWidth: '50px',
              textAlign: 'center',
              flexShrink: 0
            }}
          >
            {hole}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HoleSlider;