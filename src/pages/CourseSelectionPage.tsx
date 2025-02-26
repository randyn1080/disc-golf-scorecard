// src/pages/CourseSelectionPage.tsx
import React, { useContext, useState, useEffect } from 'react';
import { courses } from '../data/courses';
import { RoundContext } from '../context/RoundContext';
import { useNavigate, Link } from 'react-router-dom';
import { Scorecard } from '../models/types';

const CourseSelectionPage: React.FC = () => {
  const { setSelectedCourse, resetRound } = useContext(RoundContext)!;
  const [savedScorecards, setSavedScorecards] = useState<Scorecard[]>([]);
  const navigate = useNavigate();

  // Load saved scorecards from localStorage when the component mounts
  useEffect(() => {
    const stored = localStorage.getItem('scorecards');
    if (stored) {
      setSavedScorecards(JSON.parse(stored));
    }
  }, []);

  const handleCourseSelect = (courseId: string) => {
    // Reset the round state before starting a new round.
    resetRound();
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      navigate('/add-players');
    }
  };

  // Calculate total par for each course
  const getCourseTotalPar = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.par.reduce((sum, par) => sum + par, 0) : 0;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '1rem'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Select a Course</h2>
      
      {/* Slideable Course List */}
      <div style={{
        width: '100%',
        overflowX: 'auto',
        padding: '1rem 0',
        WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
      }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          paddingBottom: '0.5rem',
        }}>
          {courses.map(course => (
            <div 
              key={course.id} 
              onClick={() => handleCourseSelect(course.id)}
              style={{
                minWidth: '240px',
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                backgroundColor: '#fff',
                cursor: 'pointer'
              }}
            >
              <div style={{
                height: '120px',
                backgroundColor: '#f0f0f0',
                borderRadius: '8px',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999'
              }}>
                Course Image
              </div>
              
              <h3 style={{ margin: '0.5rem 0' }}>{course.name}</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{course.holes} Holes</span>
                <span>Par: {getCourseTotalPar(course.id)}</span>
              </div>
              
              <div style={{
                marginTop: '0.75rem',
                fontSize: '0.8rem',
                color: '#666'
              }}>
                Tap to select
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Horizontal divider */}
      <hr style={{ width: '100%', margin: '2rem 0' }} />
      
      {/* Saved Scorecards Section (moved to bottom) */}
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Saved Scorecards</h2>
      
      {savedScorecards.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No saved scorecards yet.</p>
      ) : (
        <div style={{ width: '100%' }}>
          {savedScorecards.map(scorecard => {
            const course = courses.find(c => c.id === scorecard.courseId);
            return (
              <Link 
                to={`/scorecard/${scorecard.id}`}
                style={{
                  display: 'block',
                  margin: '0.75rem 0',
                  padding: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'inherit',
                  backgroundColor: '#fff'
                }}
                key={scorecard.id}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{course ? course.name : 'Unknown Course'}</strong>
                  <span>{new Date(scorecard.date).toLocaleDateString()}</span>
                </div>
                <div style={{ marginTop: '0.5rem', color: '#666' }}>
                  Players: {scorecard.players.map(p => p.name).join(', ')}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseSelectionPage;