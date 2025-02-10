// src/pages/ScorecardView.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Scorecard } from '../models/types';
import { courses } from '../data/courses';

const ScorecardView: React.FC = () => {
  const { scorecardId } = useParams<{ scorecardId: string }>();
  const navigate = useNavigate();

  // Retrieve saved scorecards from localStorage
  const storedScorecards: Scorecard[] = JSON.parse(localStorage.getItem('scorecards') || '[]');
  const scorecard = storedScorecards.find(sc => sc.id === scorecardId);

  if (!scorecard) {
    return <div>Scorecard not found.</div>;
  }

  // Find course information from preloaded courses
  const course = courses.find(c => c.id === scorecard.courseId);
  if (!course) {
    return <div>Course not found for this scorecard.</div>;
  }

  // Calculate the course total par
  const courseTotalPar = course.par.reduce((a, b) => a + b, 0);

  // Create an array for hole numbers
  const holes = Array.from({ length: course.holes }, (_, i) => i + 1);

  // Build a mapping for each player's scores and total score.
  const playerScores: { [playerId: string]: { scores: { [hole: number]: number }, total: number } } = {};
  scorecard.players.forEach(player => {
    playerScores[player.id] = { scores: {}, total: 0 };
  });

  scorecard.scores.forEach(s => {
    if (playerScores[s.playerId]) {
      playerScores[s.playerId].scores[s.holeNumber] = s.score;
      playerScores[s.playerId].total += s.score;
    }
  });

  return (
    <div>
      <h2>{course.name} Scorecard</h2>
      <p>Date: {new Date(scorecard.date).toLocaleDateString()}</p>
      <p>Course Total Par: {courseTotalPar}</p>
      <table border={1} cellPadding={5} cellSpacing={0}>
        <thead>
          <tr>
            <th>Player</th>
            {holes.map(hole => (
              <th key={hole}>
                Hole {hole} <br /> (Par: {course.par[hole - 1]})
              </th>
            ))}
            <th>Total Score</th>
          </tr>
        </thead>
        <tbody>
          {scorecard.players.map(player => (
            <tr key={player.id}>
              <td>{player.name}</td>
              {holes.map(hole => (
                <td key={hole}>
                  {playerScores[player.id].scores[hole] !== undefined
                    ? playerScores[player.id].scores[hole]
                    : '-'}
                </td>
              ))}
              <td>{playerScores[player.id].total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate('/')}>Home</button>
    </div>
  );
};

export default ScorecardView;
