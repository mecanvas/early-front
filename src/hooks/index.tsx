import { useState, useEffect, useCallback } from 'react';

export const useGetCursorPosition = (isSelected: boolean) => {
  const [windowX, setWindowX] = useState(0);
  const [windowY, setWindowY] = useState(0);

  const handleGetCursorPosition = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    setWindowX(clientX);
    setWindowY(clientY);
  }, []);

  useEffect(() => {
    if (!isSelected) return;
    if (window) {
      document.addEventListener('mousemove', handleGetCursorPosition);
    }
    return () => document.removeEventListener('mousemove', handleGetCursorPosition);
  }, [isSelected, handleGetCursorPosition]);

  return [windowX, windowY];
};

export const useGetScollPosition = () => {
  const [scrollX, setScrollX] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const handleGetScrollPosition = useCallback(() => {
    setScrollX(window.scrollX);
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    if (window) {
      document.addEventListener('scroll', handleGetScrollPosition);
    }
    return () => {
      document.addEventListener('scroll', handleGetScrollPosition);
    };
  }, [handleGetScrollPosition]);

  return [scrollX, scrollY];
};
