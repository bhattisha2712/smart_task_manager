// src/components/TaskStats.jsx
import React from 'react';
import { useTaskStats } from '../context/TaskStatsContext';
import { useTheme } from '../context/ThemeContext';
import './TaskStats.css';

const TaskStats = () => {
  const stats = useTaskStats();
  const { isDarkMode } = useTheme();

  return (
    <div className={`task-stats ${isDarkMode ? 'dark' : 'light'}`}>
      <h2>Task Statistics</h2>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-icon">📊</div>
          <h3>Total Tasks</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-item">
          <div className="stat-icon">✅</div>
          <h3>Completed</h3>
          <p>{stats.completed}</p>
        </div>
        <div className="stat-item">
          <div className="stat-icon">⏳</div>
          <h3>Pending</h3>
          <p>{stats.pending}</p>
        </div>
        <div className="stat-item">
          <div className="stat-icon">📈</div>
          <h3>Productivity</h3>
          <p>{stats.productivityScore}%</p>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;