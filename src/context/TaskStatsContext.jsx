// src/context/TaskStatsContext.jsx
import React, { createContext, useContext, useMemo } from 'react';

const TaskStatsContext = createContext();

export const TaskStatsProvider = ({ children, tasks }) => {
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const completionRate = total ? (completed / total) * 100 : 0;
    const productivityScore = Math.round((completed / total) * 100) || 0;

    return {
      total,
      completed,
      pending,
      completionRate,
      productivityScore
    };
  }, [tasks]);

  return (
    <TaskStatsContext.Provider value={stats}>
      {children}
    </TaskStatsContext.Provider>
  );
};

export const useTaskStats = () => useContext(TaskStatsContext);