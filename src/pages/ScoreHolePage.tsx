// src/pages/ScoreHolePage.tsx
import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RoundContext } from '../context/RoundContext';
import { v4 as uuidv4 } from 'uuid';

const ScoreHolePage: React.FC = () => {
  const { holeNumber } = useParams<{ holeNumber: string }>();
  const navigate = useNavigate();
  const currentHole = parseInt(holeNumber || '1', 10);
  const { players, scores, setScores, selectedCourse } = useContext(RoundContext)!;

  if (!selectedCourse) {
    return <div>No course selected. Please go back and select a course.</div>;
  }

  const currentPar = selectedCourse.par[currentHole - 1];

  const handleScoreChange = (playerId: string, score: number) => {
    setScores(prevScores => {
      const existing = prevScores.find(s => s.playerId === playerId && s.holeNumber === currentHole);
      if (existing) {
        return prevScores.map(s =>
          s.playerId === playerId && s.holeNumber === currentHole ? { ...s, score } : s
        );
      } else {
        return [...prevScores, { playerId, holeNumber: currentHole, score }];
      }
    });
  };

  const goToHole = (newHole: number) => {
    if (newHole >= 1 && newHole <= selectedCourse.holes) {
      navigate(`/score/${newHole}`);
    }
  };

  // Finish round by filling missing scores with the hole's par, saving the scorecard,
  // and navigating to the detailed scorecard view.
  const finishRound = () => {
    let finalScores = [...scores];
    for (let hole = 1; hole <= selectedCourse.holes; hole++) {
      players.forEach(player => {
        const exists = finalScores.some(s => s.playerId === player.id && s.holeNumber === hole);
        if (!exists) {
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
    // Navigate to the detailed scorecard view instead of the course selection.
    navigate(`/scorecard/${finalScorecard.id}`);
  };

  return (
    <div>
      <h2>{selectedCourse.name} - Hole {currentHole}</h2>
      <p>Par: {currentPar}</p>
      {players.map(player => {
        const playerScore = scores.find(s => s.playerId === player.id && s.holeNumber === currentHole)?.score || '';
        return (
          <div key={player.id}>
            <span>{player.name}: </span>
            <input
              type="number"
              value={playerScore}
              onChange={(e) => handleScoreChange(player.id, Number(e.target.value))}
            />
          </div>
        );
      })}
      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => goToHole(currentHole - 1)} disabled={currentHole === 1}>
          Previous Hole
        </button>
        {currentHole < selectedCourse.holes ? (
          <button onClick={() => goToHole(currentHole + 1)}>Next Hole</button>
        ) : (
          <button onClick={finishRound}>Finish Round</button>
        )}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <label htmlFor="holeSlider">Jump to Hole: </label>
        <input
          id="holeSlider"
          type="range"
          min="1"
          max={selectedCourse.holes}
          value={currentHole}
          onChange={(e) => goToHole(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default ScoreHolePage;

