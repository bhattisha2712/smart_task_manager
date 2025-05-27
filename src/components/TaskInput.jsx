// src/components/TaskInput.jsx
import React, { useState, useRef, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import './TaskInput.css';

const TaskInput = ({ addTask }) => {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const { isDarkMode } = useTheme();

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (text.trim()) {
      addTask(text.trim());
      setText("");
      inputRef.current?.focus();
    }
  }, [text, addTask]);

  return (
    <div className={`task-input-container ${isDarkMode ? 'dark' : 'light'}`}>
      <form 
        onSubmit={handleSubmit}
        className={`task-input-form ${isFocused ? 'focused' : ''}`}
      >
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="What needs to be done?"
            className="task-input"
            autoFocus
          />
          <span className="input-highlight"></span>
        </div>
        <button 
          type="submit" 
          className={`add-button ${text.trim() ? 'active' : ''}`}
          disabled={!text.trim()}
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TaskInput;