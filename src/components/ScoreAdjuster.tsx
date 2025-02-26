// src/components/ScoreAdjuster.tsx
import React, { useState, useRef, useEffect } from 'react';

interface ScoreAdjusterProps {
  initialScore: number; // The par for the current hole.
  existingScore?: number | null; // Optional saved score.
  onScoreChange: (newScore: number) => void;
}

interface BubblePosition {
  x: number;
  y: number;
  visible: boolean;
}

const ScoreAdjuster: React.FC<ScoreAdjusterProps> = ({ initialScore, existingScore, onScoreChange }) => {
  // Initialize score state from existingScore if provided; otherwise, null.
  const [score, setScore] = useState<number | null>(existingScore !== undefined ? existingScore : null);
  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);
  const touchCurrentY = useRef<number | null>(null);
  const baselineRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for the floating bubble
  const [bubblePosition, setBubblePosition] = useState<BubblePosition>({
    x: 0,
    y: 0,
    visible: false
  });
  
  // If the existingScore prop changes (for example, when navigating back),
  // update the state.
  useEffect(() => {
    setScore(existingScore !== undefined ? existingScore : null);
  }, [existingScore]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
    touchCurrentY.current = e.touches[0].clientY;
    
    // If no score is set yet, initialize to the hole's par.
    if (score === null) {
      setScore(initialScore);
      baselineRef.current = initialScore;
      onScoreChange(initialScore);
    } else {
      baselineRef.current = score;
    }
    
    // Position the bubble based on touch point
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const offsetX = e.touches[0].clientX - containerRect.left;
      const offsetY = e.touches[0].clientY - containerRect.top;
      
      setBubblePosition({
        x: offsetX,
        y: offsetY - 100, // Position bubble 60px above the touch point
        visible: true
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current !== null) {
      touchCurrentX.current = e.touches[0].clientX;
      touchCurrentY.current = e.touches[0].clientY;
      
      const deltaX = e.touches[0].clientX - touchStartX.current;
      const threshold = 20; // 20 pixels per score unit
      const change = Math.floor(deltaX / threshold);
      let newScore = baselineRef.current + change;
      // Do not allow a score below 1.
      if (newScore < 1) newScore = 1;
      if (newScore !== score) {
        setScore(newScore);
        onScoreChange(newScore);
        // Trigger haptic feedback if available.
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
      
      // Update bubble position if container reference exists
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const offsetX = e.touches[0].clientX - containerRect.left;
        const offsetY = e.touches[0].clientY - containerRect.top;
        
        setBubblePosition(prev => ({
          ...prev,
          x: offsetX,
          y: offsetY - 100 // Position bubble 60px above the touch point
        }));
      }
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
    touchCurrentX.current = null;
    touchCurrentY.current = null;
    
    // Hide the bubble
    setBubblePosition(prev => ({
      ...prev,
      visible: false
    }));
  };

  return (
    <div 
      ref={containerRef}
      style={{
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        textAlign: 'center',
        margin: '1rem auto',
        width: '120px',
        backgroundColor: '#f9f9f9',
        position: 'relative' // Required for absolute positioning of the bubble
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Floating Score Bubble */}
      {bubblePosition.visible && (
        <div
          style={{
            position: 'absolute',
            left: `${bubblePosition.x}px`,
            top: `${bubblePosition.y}px`,
            transform: 'translateX(-50%)',
            backgroundColor: '#0070f3',
            color: 'white',
            padding: '0.5rem 0.75rem',
            borderRadius: '1rem',
            fontWeight: 'bold',
            pointerEvents: 'none',
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            fontSize: '1.25rem'
          }}
        >
          {score}
          {/* Chat bubble tail using a separate element */}
          <div style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            marginLeft: '-8px',
            width: '0',
            height: '0',
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid #0070f3'
          }}></div>
        </div>
      )}
      
      <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
        {score === null ? '_' : score}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#666' }}>Score</div>
    </div>
  );
};

export default ScoreAdjuster;