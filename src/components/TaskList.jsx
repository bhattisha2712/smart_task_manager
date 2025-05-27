// src/components/TaskList.jsx
import React, { useLayoutEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import './TaskList.css';

const TaskList = ({ tasks, onToggleTask, onDeleteTask }) => {
  const listRef = useRef(null);
  const { isDarkMode } = useTheme();

  useLayoutEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [tasks]);

  return (
    <div 
      ref={listRef}
      className={`task-list ${isDarkMode ? 'dark' : 'light'}`}
    >
      <div className="task-list-container">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-item ${task.completed ? 'completed' : ''}`}
          >
            <div className="task-content">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleTask(task.id)}
                className="task-checkbox"
              />
              <span className="task-text">{task.text}</span>
            </div>
            <div className="task-actions">
              <button
                onClick={() => onToggleTask(task.id)}
                className="toggle-button"
              >
                {task.completed ? 'Undo' : 'Complete'}
              </button>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;