// src/pages/ScoreHolePage.tsx
import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RoundContext } from '../context/RoundContext';
import { v4 as uuidv4 } from 'uuid';
import HoleSlider from '../components/HoleSlider';
import ScoreAdjuster from '../components/ScoreAdjuster';

const ScoreHolePage: React.FC = () => {
  const { holeNumber } = useParams<{ holeNumber: string }>();
  const navigate = useNavigate();
  const currentHole = parseInt(holeNumber || '1', 10);
  const { players, scores, setScores, selectedCourse } = useContext(RoundContext)!;

  if (!selectedCourse) {
    return <div>No course selected. Please go back and select a course.</div>;
  }

  // Get the par for the current hole.
  const currentPar = selectedCourse.par[currentHole - 1];

  // Update the score for a given player on the current hole.
  const updateScore = (playerId: string, newScore: number) => {
    setScores(prevScores => {
      const existing = prevScores.find(s => s.playerId === playerId && s.holeNumber === currentHole);
      if (existing) {
        return prevScores.map(s =>
          s.playerId === playerId && s.holeNumber === currentHole ? { ...s, score: newScore } : s
        );
      } else {
        return [...prevScores, { playerId, holeNumber: currentHole, score: newScore }];
      }
    });
  };

  const goToHole = (newHole: number) => {
    if (newHole >= 1 && newHole <= selectedCourse.holes) {
      navigate(`/score/${newHole}`);
    }
  };

  const finishRound = () => {
    let finalScores = [...scores];
    for (let hole = 1; hole <= selectedCourse.holes; hole++) {
      players.forEach(player => {
        const exists = finalScores.some(s => s.playerId === player.id && s.holeNumber === hole);
        if (!exists) {
          // If the user never set a score, default to par.
          const parForHole = selectedCourse.par[hole - 1];
          finalScores.push({ playerId: player.id, holeNumber: hole, score: parForHole });
        }
      });
    }
    setScores(finalScores);
    const finalScorecard = {
      id: uuidv4(),
      courseId: selectedCourse.id,
      players,
      scores: finalScores,
      date: new Date().toISOString(),
    };
    const existingScorecards = JSON.parse(localStorage.getItem("scorecards") || "[]");
    existingScorecards.push(finalScorecard);
    localStorage.setItem("scorecards", JSON.stringify(existingScorecards));
    alert("Round finished and saved locally!");
    navigate(`/scorecard/${finalScorecard.id}`);
  };

  return (
    <div style={{
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '1rem',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <h2 style={{ textAlign: 'center' }}>{selectedCourse.name} - Hole {currentHole}</h2>
      <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>Par: {currentPar}</p>

      {/* Render ScoreAdjuster for each player */}
      {players.map(player => {
  // Look up the existing score for this player on the current hole
  const savedScore = scores.find(s => s.playerId === player.id && s.holeNumber === currentHole)?.score ?? null;
  return (
    <div key={player.id} style={{ marginBottom: '1rem', width: '100%', textAlign: 'center' }}>
      <p style={{ margin: '0.5rem 0' }}>{player.name}</p>
      <ScoreAdjuster 
        key={`${player.id}-${currentHole}`} // This forces remount when currentHole changes.
        initialScore={currentPar} 
        existingScore={savedScore}
        onScoreChange={(newScore) => updateScore(player.id, newScore)}
      />
    </div>
  );
})}

      {/* Navigation Buttons */}
     {/* Finish Round Button: Only display on the final hole */}
{currentHole === selectedCourse.holes && (
  <div style={{ marginTop: '1rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
    <button onClick={finishRound}>Finish Round</button>
  </div>
)}

      {/* Prominent Hole Slider showing a range of holes */}
      <HoleSlider 
        min={1} 
        max={selectedCourse.holes} 
        value={currentHole} 
        onChange={goToHole} 
      />
    </div>
  );
};

export default ScoreHolePage;
