// src/hooks/usePomodoroTimer.js
import { useReducer, useRef, useCallback } from 'react';

const initialState = {
  time: 25 * 60,
  isRunning: false,
  mode: 'work',
  cycles: 0
};

function timerReducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...state, isRunning: true };
    case 'STOP':
      return { ...state, isRunning: false };
    case 'RESET':
      return { ...initialState };
    case 'TICK':
      return {
        ...state,
        time: state.time - 1,
      };
    case 'SWITCH_MODE':
      return {
        ...state,
        mode: state.mode === 'work' ? 'break' : 'work',
        time: state.mode === 'work' ? 5 * 60 : 25 * 60,
        cycles: state.mode === 'work' ? state.cycles + 1 : state.cycles
      };
    default:
      return state;
  }
}

const usePomodoroTimer = () => {
  const [state, dispatch] = useReducer(timerReducer, initialState);
  const intervalRef = useRef(null);

  const startTimer = useCallback(() => {
    if (!state.isRunning) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
      dispatch({ type: 'START' });
    }
  }, [state.isRunning]);

  const stopTimer = useCallback(() => {
    if (state.isRunning) {
      clearInterval(intervalRef.current);
      dispatch({ type: 'STOP' });
    }
  }, [state.isRunning]);

  const resetTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    dispatch({ type: 'RESET' });
  }, []);

  return {
    ...state,
    startTimer,
    stopTimer,
    resetTimer,
  };
};

export default usePomodoroTimer;