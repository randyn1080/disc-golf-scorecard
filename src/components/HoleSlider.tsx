// src/components/HoleSlider.tsx
import React from 'react';

interface HoleSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

const HoleSlider: React.FC<HoleSliderProps> = ({ min, max, value, onChange }) => {
  // Generate an array of holes from min to max.
  const holes = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  return (
    // This outer div is the dedicated scrollable container.
    <div
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
        {holes.map(hole => (
          <div
            key={hole}
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
