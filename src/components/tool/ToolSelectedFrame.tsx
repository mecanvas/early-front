import React, { useCallback, useEffect, useRef } from 'react';
import { SelectedFrameWrapper } from './ToolStyle';

interface Props {
  width?: string;
  height?: string;
  onClick: () => void;
}

const ToolSelectedFrame = ({ width, height, onClick }: Props) => {
  const selectFrameWrapper = useRef<HTMLDivElement>(null);
  const selectFrameRef = useRef<HTMLCanvasElement>(null);

  const getPosition = useCallback((event: MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;
    return [x, y];
  }, []);

  const handleDrawingFrame = useCallback(
    (e: MouseEvent) => {
      const canvas = selectFrameRef.current;
      const canvasWrapper = selectFrameWrapper.current;
      if (canvas && canvasWrapper) {
        if (!width || !height) return;
        const frameWidth = +width.replace('px', '');
        const frameHeight = +height.replace('px', '');
        const { width: canvasWidth, height: canvasHeight } = canvasWrapper.getBoundingClientRect();
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');
        const [x, y] = getPosition(e);

        const left = x - frameWidth / 2;
        const top = y - frameHeight / 2;

        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = 'green';
          ctx.strokeRect(x - frameWidth / 2, y - frameHeight / 2, frameWidth, frameHeight);
          ctx.stroke();
        }
      }
    },
    [getPosition, height, width],
  );

  useEffect(() => {
    const canvasWrapper = selectFrameWrapper.current;
    if (!canvasWrapper) return;

    canvasWrapper.addEventListener('mousemove', handleDrawingFrame);
    return () => {
      canvasWrapper.removeEventListener('mousemove', handleDrawingFrame);
    };
  }, [handleDrawingFrame, height, width]);

  return (
    <SelectedFrameWrapper ref={selectFrameWrapper}>
      <canvas ref={selectFrameRef} onClick={onClick}></canvas>
    </SelectedFrameWrapper>
  );
};

export default ToolSelectedFrame;
