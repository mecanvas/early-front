import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useGetScollPosition, useGlobalState } from 'src/hooks';
import { CanvasFrameSizeInfo, CanvasPosition, CroppedFrame } from 'src/interfaces/ToolInterface';
import { theme } from 'src/style/theme';
import { replacePx } from 'src/utils/replacePx';
import { SelectedFrameWrapper } from './DividedToolStyle';

interface Props {
  width?: number;
  height?: number;
  onClick: () => void;
  croppedList: CroppedFrame[];
}

const ToolSelectedFrame = memo(({ width, height, onClick, croppedList }: Props) => {
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

  const [centerX] = useGlobalState<number>('centerX');
  const [centerY] = useGlobalState<number>('centerY');
  const [isNearingX, setIsNearingX] = useGlobalState('isNearingX', false);
  const [isNearingY, setIsNearingY] = useGlobalState('isNearingY', false);
  const [isFitX, setIsFitX] = useGlobalState('isFitX', false);
  const [isFitY, setIsFitY] = useGlobalState('isFitY', false);

  const checkNearingParallelForBox = useCallback(() => {
    if (!canvasFrameSizeInfo || !canvasPosition || !centerX || !centerY) return;

    const { width, height } = canvasFrameSizeInfo;
    const { left, top } = canvasPosition;
    const right = left + width;
    const bottom = top + height;

    const diffY = 86;
    const isNearingAxisXByBox = (conditionValue: number) =>
      Math.abs(right - centerX) < conditionValue || Math.abs(left - centerX) < conditionValue;
    const isNearingAxisYByBox = (conditionValue: number) =>
      Math.abs(top - diffY - centerY) < conditionValue || Math.abs(bottom - diffY - centerY) < conditionValue;
    if (isNearingAxisXByBox(5.5) || isNearingAxisYByBox(5.5)) {
      if (isNearingAxisXByBox(5.5) && isNearingAxisYByBox(5.5)) {
        if (isNearingAxisXByBox(0.5) || isNearingAxisYByBox(0.5)) {
          setIsFitX(true);
          setIsFitY(true);
        }
        setIsNearingX(true);
        setIsNearingY(true);
        return;
      }
      if (isNearingAxisXByBox(5.5)) {
        if (isNearingAxisXByBox(0.5)) {
          setIsFitX(true);
        }
        setIsNearingX(true);
      }

      if (isNearingAxisYByBox(5.5)) {
        if (isNearingAxisYByBox(0.5)) {
          setIsFitY(true);
        }
        setIsNearingY(true);
      }
    }
  }, [canvasFrameSizeInfo, canvasPosition, centerX, centerY, setIsFitX, setIsFitY, setIsNearingX, setIsNearingY]);

  // 커서가 x, y축 중 하나라도 정 중앙에 위치하게 되면 평행선을 solid로 바꿉니다.
  const checkNearingCenterForMouse = useCallback(
    (cursorX: number, cursorY: number) => {
      const diffY = 43;

      const isNearingAxisX = (conditionValue: number) => Math.abs(cursorX - window.innerWidth / 2) < conditionValue;
      const isNearingAxisY = (conditionValue: number) =>
        Math.abs(cursorY - diffY - window.innerHeight / 2) < conditionValue;

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
        let positionLeft = x - frameWidth / 2;
        let positionTop = y - frameHeight / 2;
        checkNearingCenterForMouse(x, y);
        checkNearingParallelForBox();

        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = '#333';
          ctx.strokeRect(positionLeft, positionTop, frameWidth, frameHeight);
          ctx.stroke();
          const drawingLine = (nearing: { top: boolean; right: boolean; bottom: boolean; left: boolean }) => {
            const { top, right, left, bottom } = nearing;
            // top
            if (top) {
              ctx.fillStyle = `${theme.color.primary}`;
              ctx.fillRect(0, positionTop, canvas.width, 1);
            }

            //  right
            if (right) {
              ctx.fillStyle = `${theme.color.primary}`;
              ctx.fillRect(positionLeft + frameWidth, 0, 1, canvas.height);
            }

            //  bottom
            if (bottom) {
              ctx.fillStyle = `${theme.color.primary}`;
              ctx.fillRect(0, positionTop + frameHeight, canvas.width, 1);
            }

            //  left
            if (left) {
              ctx.fillStyle = `${theme.color.primary}`;
              ctx.fillRect(positionLeft, 0, 1, canvas.height);
            }
          };

          if (croppedList && croppedList.length) {
            for (const list of croppedList) {
              const cropWidth = replacePx(list.width);
              const cropHeight = replacePx(list.height);
              const cropLeft = replacePx(list.left);
              const cropRight = cropLeft + cropWidth;
              const cropTop = replacePx(list.top);
              const cropBottom = cropTop + cropHeight;

              const top = positionTop + scrollY;
              const left = positionLeft + scrollX;
              const right = left + frameWidth;
              const bottom = top + frameHeight;

              // TODO: 로직 추상화 작업
              const isNearingRight = (conditionValue: number) => {
                if (Math.abs(right - cropRight) < conditionValue) {
                  positionLeft = positionLeft - (right - cropRight);
                  return true;
                }
                if (Math.abs(right - cropLeft) < conditionValue) {
                  positionLeft = positionLeft - (right - cropLeft);

                  return true;
                }
                return false;
              };
              const isNearingLeft = (conditionValue: number) => {
                if (Math.abs(left - cropLeft) < conditionValue) {
                  positionLeft = positionLeft - (left - cropLeft);
                  return true;
                }
                if (Math.abs(left - cropRight) < conditionValue) {
                  positionLeft = positionLeft - (left - cropRight);
                  return true;
                }
                return false;
              };

              const isNearingBottom = (conditionValue: number) => {
                if (Math.abs(bottom - cropBottom) < conditionValue) {
                  positionTop = positionTop - (bottom - cropBottom);
                  return true;
                }
                if (Math.abs(bottom - cropTop) < conditionValue) {
                  positionTop = positionTop - (bottom - cropTop);
                  return true;
                }
                return false;
              };

              const isNearingTop = (conditionValue: number) => {
                if (Math.abs(top - cropTop) < conditionValue) {
                  positionTop = positionTop - (top - cropTop);
                  return true;
                }
                if (Math.abs(top - cropBottom) < conditionValue) {
                  positionTop = positionTop - (top - cropBottom);
                  return true;
                }
                return false;
              };

              const nearing = {
                top: isNearingTop(1),
                right: isNearingRight(1),
                left: isNearingLeft(1),
                bottom: isNearingBottom(1),
              };
              drawingLine(nearing);
            }
          }
        }
        setCanvasPosition({ ...canvasPosition, top: positionTop, left: positionLeft });
        setCanvasFrameSizeInfo({ ...canvasFrameSizeInfo, width: frameWidth, height: frameHeight });
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
      croppedList,
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
    <SelectedFrameWrapper
      isFitX={isFitX || false}
      isFitY={isFitY || false}
      isNearingX={isNearingX || false}
      isNearingY={isNearingY || false}
      ref={selectFrameWrapper}
    >
      <canvas ref={selectFrameRef} onClick={onClick}></canvas>
    </SelectedFrameWrapper>
  );
});

export default ToolSelectedFrame;
