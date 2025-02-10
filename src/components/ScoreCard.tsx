// src/components/Scorecard.tsx

import React from "react";
import { Course, Player, Score } from "../models/types";

interface ScorecardProps {
  course: Course;
  players: Player[];
  scores: Score[];
  onScoreChange: (playerId: string, holeNumber: number, score: number) => void;
}

const Scorecard: React.FC<ScorecardProps> = ({
  course,
  players,
  scores,
  onScoreChange,
}) => {
  // Create an array for holes [1...course.holes]
  const holes = Array.from({ length: course.holes }, (_, i) => i + 1);

  // Helper function to get the score for a specific player and hole
  const getScore = (playerId: string, hole: number) => {
    const scoreObj = scores.find(
      (s) => s.playerId === playerId && s.holeNumber === hole
    );
    return scoreObj ? scoreObj.score : "";
  };

  return (
    <div>
      <h3>{course.name} Scorecard</h3>
      <table>
        <thead>
          <tr>
            <th>Hole</th>
            {players.map((player) => (
              <th key={player.id}>{player.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {holes.map((hole) => (
            <tr key={hole}>
              <td>{hole}</td>
              {players.map((player) => (
                <td key={player.id}>
                  <input
                    type="number"
                    value={getScore(player.id, hole)}
                    onChange={(e) =>
                      onScoreChange(
                        player.id,
                        hole,
                        Number(e.target.value)
                      )
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Scorecard;