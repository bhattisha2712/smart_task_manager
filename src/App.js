// src/App.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { TaskStatsProvider } from './context/TaskStatsContext';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import TaskStats from './components/TaskStats';
import Timer from './components/Timer';
import useLocalStorage from './hooks/useLocalStorage';
import './App.css';

function App() {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created');

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;
    
    // Filter
    switch (filter) {
      case 'completed':
        filtered = tasks.filter(task => task.completed);
        break;
      case 'pending':
        filtered = tasks.filter(task => !task.completed);
        break;
      default:
        filtered = tasks;
    }
    
    // Sort
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'created':
          return b.id - a.id;
        case 'completed':
          return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
        case 'alphabetical':
          return a.text.localeCompare(b.text);
        default:
          return 0;
      }
    });
  }, [tasks, filter, sortBy]);

  const addTask = useCallback((text) => {
    setTasks(prev => [...prev, {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString()
    }]);
  }, [setTasks]);

  const toggleTask = useCallback((id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, [setTasks]);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, [setTasks]);

  return (
    <ThemeProvider>
      <TaskStatsProvider tasks={tasks}>
        <div className="app">
          <header className="app-header">
            <h1>Smart Task Manager</h1>
          </header>
          
          <main className="app-main">
            <div className="controls">
              <div className="filters">
                <button 
                  onClick={() => setFilter('all')}
                  className={filter === 'all' ? 'active' : ''}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilter('completed')}
                  className={filter === 'completed' ? 'active' : ''}
                >
                  Completed
                </button>
                <button 
                  onClick={() => setFilter('pending')}
                  className={filter === 'pending' ? 'active' : ''}
                >
                  Pending
                </button>
              </div>
              
              <div className="sort">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="created">Created Date</option>
                  <option value="completed">Completion Status</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>
            </div>

            <TaskInput addTask={addTask} />
            <TaskList
              tasks={filteredAndSortedTasks}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
            />
            <div className="dashboard-grid">
              <TaskStats />
              <Timer />
            </div>
          </main>
        </div>
      </TaskStatsProvider>
    </ThemeProvider>
  );
}

export default App;