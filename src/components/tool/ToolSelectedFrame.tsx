import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useGetScollPosition, useGlobalState } from 'src/hooks';
import { CanvasFramePositionList, CanvasFrameSizeInfo, CanvasPosition } from 'src/interfaces/ToolInterface';
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
  const [scrollX, scrollY] = useGetScollPosition();
  const [canvasPosition, setCanvasPosition] = useGlobalState<CanvasPosition>('canvasPosition', {
    left: 0,
    top: 0,
  });
  const [canvasFrameSizeInfo, setCanvasFrameSizeInfo] = useGlobalState<CanvasFrameSizeInfo>('canvasFrameSizeInfo', {
    width: 0,
    height: 0,
  });
  const [canvasFramePositionList] = useGlobalState<CanvasFramePositionList[]>('canvasFramePositionList');

  const [centerX] = useGlobalState<number>('centerX');
  const [centerY] = useGlobalState<number>('centerY');
  const [, setIsNearingX] = useGlobalState('isNearingX', false);
  const [, setIsNearingY] = useGlobalState('isNearingY', false);
  const [, setIsFitX] = useGlobalState('isFitX', false);
  const [, setIsFitY] = useGlobalState('isFitY', false);

  // 액자의 크기에 맞춰 x, y선 평행 TODO: 추후 모든 액자에.. 요 기능을 담아야지않을까?
  const checkNearingParallelForBox = useCallback(() => {
    if (!canvasFrameSizeInfo || !canvasPosition || !centerX || !centerY) return;

    const { width, height } = canvasFrameSizeInfo;
    const { left, top } = canvasPosition;
    const right = left + width;
    const bottom = top + height;

    const isNearingAxisXByBox = (conditionValue: number) =>
      Math.abs(right - centerX) < conditionValue || Math.abs(left - centerX) < conditionValue;
    const isNearingAxisYByBox = (conditionValue: number) =>
      Math.abs(top - centerY - 32) < conditionValue || Math.abs(bottom - centerY - 32) < conditionValue;
    if (isNearingAxisXByBox(5.5) || isNearingAxisYByBox(5.5)) {
      if (isNearingAxisXByBox(5.5) && isNearingAxisYByBox(5.5)) {
        if (isNearingAxisXByBox(1.1) || isNearingAxisYByBox(1.1)) {
          setIsFitX(true);
          setIsFitY(true);
        }
        setIsNearingX(true);
        setIsNearingY(true);
        return;
      }
      if (isNearingAxisXByBox(5.5)) {
        if (isNearingAxisXByBox(1.1)) {
          setIsFitX(true);
        }
        setIsNearingX(true);
      }

      if (isNearingAxisYByBox(5.5)) {
        if (isNearingAxisYByBox(1.1)) {
          setIsFitY(true);
        }
        setIsNearingY(true);
      }
    }
  }, [canvasFrameSizeInfo, canvasPosition, centerX, centerY, setIsFitX, setIsFitY, setIsNearingX, setIsNearingY]);

  // 커서가 x, y축 중 하나라도 정 중앙에 위치하게 되면 평행선을 solid로 바꿉니다.
  const checkNearingCenterForMouse = useCallback(
    (cursorX: number, cursorY: number) => {
      const isNearingAxisX = (conditionValue: number) => Math.abs(cursorX - window.innerWidth / 2) < conditionValue;
      const isNearingAxisY = (conditionValue: number) =>
        Math.abs(cursorY - 32 - window.innerHeight / 2) < conditionValue;

      // 초기 시작시 false로 초기화.
      setIsNearingX(false);
      setIsNearingY(false);
      setIsFitX(false);
      setIsFitY(false);

      if (isNearingAxisX(6) || isNearingAxisY(6)) {
        // 커서에 따라 평행선 변경
        if (isNearingAxisX(6) && isNearingAxisY(6)) {
          if (isNearingAxisX(0.1) || isNearingAxisY(0.1)) {
            setIsFitX(true);
            setIsFitY(true);
          }
          setIsNearingX(true);
          setIsNearingY(true);
          return;
        }
        if (isNearingAxisX(6)) {
          if (isNearingAxisX(0.1)) {
            setIsFitX(true);
          }
          setIsNearingX(true);
        }
        if (isNearingAxisY(6)) {
          if (isNearingAxisY(0.1)) {
            setIsFitY(true);
          }
          setIsNearingY(true);
        }
      }
    },
    [setIsFitX, setIsFitY, setIsNearingX, setIsNearingY],
  );

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
        checkNearingCenterForMouse(x, y);
        checkNearingParallelForBox();
        setCanvasPosition({ ...canvasPosition, top: positionTop, left: positionLeft });
        setCanvasFrameSizeInfo({ ...canvasFrameSizeInfo, width: frameWidth, height: frameHeight });

        const oCanvas = document.createElement('canvas');
        oCanvas.width = canvasWidth;
        oCanvas.height = canvasHeight;
        const oCtx = oCanvas.getContext('2d');
        if (oCtx) {
          oCtx.clearRect(0, 0, canvas.width, canvas.height);
          oCtx.fillStyle = '#333';
          oCtx.fillRect(x, y, 3, canvas.height);
          oCtx.strokeRect(x, y, 3, canvas.height);
          oCtx.stroke();
        }
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = '#333';
          ctx.strokeRect(positionLeft, positionTop, frameWidth, frameHeight);
          ctx.stroke();

          // checkNearingParallelForEachBox();
          if (canvasFramePositionList) {
            canvasFramePositionList.forEach((list) => {
              const top = positionTop + scrollY;
              const left = positionLeft + scrollX;
              const right = left + list.width;
              const bottom = top + list.height;

              console.log(
                'left',
                left - list.left,
                'right',
                right - list.left + list.width,
                'top',
                top - list.top,
                'bottom',
                bottom - list.top - list.height,
              );
              const isNearingRight = (conditionValue: number) => Math.abs(right - list.left) < conditionValue;
              const isNearingLeft = (conditionValue: number) =>
                (left - list.left <= 0 + conditionValue && left - list.left < conditionValue) ||
                left - list.left <= list.width + conditionValue;
              const isNearingTop = (conditionValue: number) => Math.abs(top - list.top) < conditionValue;
              const isNearingBottom = (conditionValue: number) =>
                Math.abs(bottom - list.top - list.height) < conditionValue;
            });
          }

          // top
          ctx.fillStyle = '#1a4ead';
          ctx.fillRect(0, positionTop, canvas.width, 1);

          //  right
          ctx.fillStyle = '#1a4ead';
          ctx.fillRect(positionLeft + frameWidth, 0, 1, canvas.height);

          //  bottom
          ctx.fillRect(0, positionTop + frameHeight, canvas.width, 1);

          //  left
          ctx.fillRect(positionLeft, 0, 1, canvas.height);

          //  centerX
          ctx.fillRect(0, positionTop + frameHeight / 2, canvas.width, 1);

          //  centerY
          ctx.fillRect(positionLeft + frameWidth / 2, 0, 1, canvas.height);
        }
      }
      requestAnimationFrame(() => handleDrawingFrame);
    },
    [
      frameWidth,
      frameHeight,
      getPosition,
      checkNearingCenterForMouse,
      checkNearingParallelForBox,
      setCanvasPosition,
      canvasPosition,
      setCanvasFrameSizeInfo,
      canvasFrameSizeInfo,
      canvasFramePositionList,
      scrollY,
      scrollX,
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
