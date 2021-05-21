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
