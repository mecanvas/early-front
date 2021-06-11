import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useGlobalState } from 'src/hooks';
import { CanvasFrameSizeInfo, CanvasPosition } from 'src/interfaces/ToolInterface';
import { SelectedFrameWrapper } from './ToolStyle';

interface Props {
  width?: number;
  height?: number;
  onClick: () => void;
}

const ToolSelectedFrame = memo(({ width, height, onClick }: Props) => {
  const selectFrameWrapper = useRef<HTMLDivElement>(null);
  const selectFrameRef = useRef<HTMLCanvasElement>(null);
  const frameWidth = useMemo(() => width || 0, [width]);
  const frameHeight = useMemo(() => height || 0, [height]);

  const [canvasPosition, setCanvasPosition] = useGlobalState<CanvasPosition>('canvasPosition', {
    left: 0,
    top: 0,
  });
  const [canvasFrameSizeInfo, setCanvasFrameSizeInfo] = useGlobalState<CanvasFrameSizeInfo>('canvasFrameSizeInfo', {
    width: 0,
    height: 0,
  });

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
        if (!frameWidth || !frameHeight) return;
        const { width: canvasWidth, height: canvasHeight } = canvasWrapper.getBoundingClientRect();
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');
        const [x, y] = getPosition(e);
        const positionLeft = x - frameWidth / 2;
        const positionTop = y - frameHeight / 2;

        setCanvasPosition({ ...canvasPosition, top: positionTop, left: positionLeft });
        setCanvasFrameSizeInfo({ ...canvasFrameSizeInfo, width: frameWidth, height: frameHeight });

        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = '#333';
          ctx.strokeRect(x - frameWidth / 2, y - frameHeight / 2, frameWidth, frameHeight);
          ctx.stroke();
        }
      }
    },
    [
      canvasFrameSizeInfo,
      canvasPosition,
      frameHeight,
      frameWidth,
      getPosition,
      setCanvasFrameSizeInfo,
      setCanvasPosition,
    ],
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
});

export default ToolSelectedFrame;
