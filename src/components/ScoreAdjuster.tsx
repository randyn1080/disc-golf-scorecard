// src/components/ScoreAdjuster.tsx
import React, { useState, useRef, useEffect } from 'react';

interface ScoreAdjusterProps {
  initialScore: number; // The par for the current hole.
  existingScore?: number | null; // Optional saved score.
  onScoreChange: (newScore: number) => void;
}

const ScoreAdjuster: React.FC<ScoreAdjusterProps> = ({ initialScore, existingScore, onScoreChange }) => {
  // Initialize score state from existingScore if provided; otherwise, null.
  const [score, setScore] = useState<number | null>(existingScore !== undefined ? existingScore : null);
  const touchStartX = useRef<number | null>(null);
  const baselineRef = useRef<number>(0);

  // If the existingScore prop changes (for example, when navigating back),
  // update the state.
  useEffect(() => {
    setScore(existingScore !== undefined ? existingScore : null);
  }, [existingScore]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    // If no score is set yet, initialize to the hole's par.
    if (score === null) {
      setScore(initialScore);
      baselineRef.current = initialScore;
      onScoreChange(initialScore);
    } else {
      baselineRef.current = score;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current !== null) {
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
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
  };

  return (
    <div 
      style={{
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        textAlign: 'center',
        margin: '1rem auto',
        width: '120px',
        backgroundColor: '#f9f9f9'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
        {score === null ? '_' : score}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#666' }}>Score</div>
    </div>
  );
};

export default ScoreAdjuster;
