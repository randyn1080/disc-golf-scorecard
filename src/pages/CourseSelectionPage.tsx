// src/pages/CourseSelectionPage.tsx
import React, { useContext, useState, useEffect } from 'react';
import { courses } from '../data/courses';
import { RoundContext } from '../context/RoundContext';
import { useNavigate, Link } from 'react-router-dom';
import { Scorecard } from '../models/types';

const CourseSelectionPage: React.FC = () => {
  const { setSelectedCourse, resetRound } = useContext(RoundContext)!;
  const [selectedId, setSelectedId] = useState('');
  const [savedScorecards, setSavedScorecards] = useState<Scorecard[]>([]);
  const navigate = useNavigate();

  // Load saved scorecards from localStorage when the component mounts
  useEffect(() => {
    const stored = localStorage.getItem('scorecards');
    if (stored) {
      setSavedScorecards(JSON.parse(stored));
    }
  }, []);

  const handleNext = () => {
    // Reset the round state before starting a new round.
    resetRound();
    const course = courses.find(c => c.id === selectedId);
    if (course) {
      setSelectedCourse(course);
      navigate('/add-players');
    } else {
      alert('Please select a course.');
    }
  };

  return (
    <div>
      <h2>Saved Scorecards</h2>
      {savedScorecards.length === 0 ? (
        <p>No saved scorecards yet.</p>
      ) : (
        <ul>
          {savedScorecards.map(scorecard => {
            const course = courses.find(c => c.id === scorecard.courseId);
            return (
              <li key={scorecard.id} style={{ marginBottom: '1rem' }}>
                <Link to={`/scorecard/${scorecard.id}`}>
                  <strong>{course ? course.name : 'Unknown Course'}</strong> - {new Date(scorecard.date).toLocaleDateString()}<br />
                  Players: {scorecard.players.map(p => p.name).join(', ')}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <hr />

      <h2>Start a New Round</h2>
      <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
        <option value="">--Choose a Course--</option>
        {courses.map(course => (
          <option key={course.id} value={course.id}>
            {course.name}
          </option>
        ))}
      </select>
      <br />
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default CourseSelectionPage;
