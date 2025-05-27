// src/components/Timer.jsx
import React from 'react';
import usePomodoroTimer from '../hooks/usePomodoroTimer';
import { useTheme } from '../context/ThemeContext';
import './Timer.css';

const Timer = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const {
    time,
    isRunning,
    mode,
    cycles,
    startTimer,
    stopTimer,
    resetTimer,
  } = usePomodoroTimer();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`timer ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="timer-header">
        <h2>Pomodoro Timer</h2>
        <button onClick={toggleTheme} className="theme-toggle">
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
      <div className="timer-display">
        <span className="time">{formatTime(time)}</span>
        <span className="mode">{mode === 'work' ? 'Work Time' : 'Break Time'}</span>
      </div>
      <div className="timer-controls">
        <button 
          onClick={startTimer} 
          disabled={isRunning}
          className="control-button"
        >
          Start
        </button>
        <button 
          onClick={stopTimer} 
          disabled={!isRunning}
          className="control-button"
        >
          Stop
        </button>
        <button 
          onClick={resetTimer}
          className="control-button"
        >
          Reset
        </button>
      </div>
      <div className="timer-info">
        <span>Completed Cycles: {cycles}</span>
      </div>
    </div>
  );
};

export default Timer;