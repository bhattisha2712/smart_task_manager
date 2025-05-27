// src/App.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import TaskStats from './components/TaskStats';
import Timer from './components/Timer';
import './App.css';

// Custom hook for localStorage
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }, [key, value]);

  return [value, setValue];
};

// Custom hook for Pomodoro Timer
const usePomodoroTimer = () => {
  const [state, setState] = useState({
    time: 25 * 60,
    isRunning: false,
    mode: 'work',
    cycles: 0
  });

  const intervalRef = React.useRef(null);

  const startTimer = useCallback(() => {
    if (!state.isRunning) {
      intervalRef.current = setInterval(() => {
        setState(prev => {
          if (prev.time <= 0) {
            clearInterval(intervalRef.current);
            return {
              ...prev,
              isRunning: false,
              mode: prev.mode === 'work' ? 'break' : 'work',
              time: prev.mode === 'work' ? 5 * 60 : 25 * 60,
              cycles: prev.mode === 'work' ? prev.cycles + 1 : prev.cycles
            };
          }
          return {
            ...prev,
            time: prev.time - 1
          };
        });
      }, 1000);
      setState(prev => ({ ...prev, isRunning: true }));
    }
  }, [state.isRunning]);

  const stopTimer = useCallback(() => {
    if (state.isRunning) {
      clearInterval(intervalRef.current);
      setState(prev => ({ ...prev, isRunning: false }));
    }
  }, [state.isRunning]);

  const resetTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    setState({
      time: 25 * 60,
      isRunning: false,
      mode: 'work',
      cycles: 0
    });
  }, []);

  return {
    ...state,
    startTimer,
    stopTimer,
    resetTimer
  };
};

function App() {
  // State management
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Pomodoro timer
  const timer = usePomodoroTimer();

  // Theme effect
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  // Filtered and sorted tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;
    
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

  // Task statistics
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

  // Task handlers
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
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="app-header">
        <h1>Smart Task Manager</h1>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)} 
          className="theme-toggle"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
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
          <TaskStats stats={stats} />
          <Timer timer={timer} />
        </div>
      </main>
    </div>
  );
}

export default App;