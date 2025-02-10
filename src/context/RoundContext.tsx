// src/context/RoundContext.tsx
import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { Course, Player, Score } from '../models/types';

interface RoundContextType {
  selectedCourse: Course | null;
  setSelectedCourse: Dispatch<SetStateAction<Course | null>>;
  players: Player[];
  setPlayers: Dispatch<SetStateAction<Player[]>>;
  scores: Score[];
  setScores: Dispatch<SetStateAction<Score[]>>;
  resetRound: () => void;
}

export const RoundContext = createContext<RoundContextType | undefined>(undefined);

export const RoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [scores, setScores] = useState<Score[]>([]);

  const resetRound = () => {
    setSelectedCourse(null);
    setPlayers([]);
    setScores([]);
  };

  return (
    <RoundContext.Provider
      value={{ selectedCourse, setSelectedCourse, players, setPlayers, scores, setScores, resetRound }}
    >
      {children}
    </RoundContext.Provider>
  );
};
