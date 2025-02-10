// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CourseSelectionPage from './pages/CourseSelectionPage';
import PlayerSetupPage from './pages/PlayerSetupPage';
import ScoreHolePage from './pages/ScoreHolePage';
import ScorecardView from './pages/ScorecardView';
import { RoundProvider } from './context/RoundContext';

const App: React.FC = () => {
  return (
    <RoundProvider>
      <Router>
        <Routes>
          <Route path="/" element={<CourseSelectionPage />} />
          <Route path="/select-course" element={<CourseSelectionPage />} />
          <Route path="/add-players" element={<PlayerSetupPage />} />
          <Route path="/score/:holeNumber" element={<ScoreHolePage />} />
          <Route path="/scorecard/:scorecardId" element={<ScorecardView />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </Router>
    </RoundProvider>
  );
};

export default App;
