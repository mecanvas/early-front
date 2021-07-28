import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Divider } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import { ResizeCmd } from 'src/interfaces/ToolInterface';
import { setCanvasSaveList } from 'src/store/reducers/canvas';
import { SelectedFrame, updatePositionByFrame } from 'src/store/reducers/frame';
import { theme } from 'src/style/theme';
import { getOriginRatio } from 'src/utils/getOriginRatio';
import { getPosition } from 'src/utils/getPosition';
import { replacePx } from 'src/utils/replacePx';
import { positioningImageResize } from 'src/utils/resize';

const Container = styled.section<{ cmd: ResizeCmd | null }>`
  padding: 1em 0;

  ${({ cmd }) => {
    if (!cmd) return;
    if (cmd === 'top-left' || cmd === 'bottom-right') {
      return css`
        cursor: nwse-resize;
      `;
    }
    return css`
      cursor: nesw-resize;
    `;
  }}
`;

const ThirdItemList = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 2em 0;
  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 1em;
    text-align: center;
  }
  small {
    margin-top: 6px;
  }
`;

const ThirdItem = styled.div<{ type: 1 | 2; selected: boolean }>`
  cursor: pointer;
  width: ${({ type }) => (type === 1 ? '80px' : '60px')};
  height: ${({ type }) => (type === 2 ? '80px' : '80px')};
  text-align: center;
  border: 1px solid ${({ theme }) => theme.color.gray400};
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  ${({ selected }) =>
    selected
      ? css`
          transform: scale(1.2);
        `
      : css`
          filter: brightness(60%);
        `}
  &:hover {
    transform: scale(1.1);
  }
`;

const ThirdContent = styled.div`
  display: grid;
  gap: 1em;
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    justify-content: space-between;
  }
`;

const ThirdContentDrawingCanvas = styled.div<{ width: number; height: number }>`
  position: relative;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.color.gray100};
`;

const ThirdContentCropperWrapper = styled.div<{ width: number; height: number }>`
  position: absolute;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* top-left */
  div:nth-of-type(1) {
    z-index: 12;
    position: absolute;
    top: 0;
    left: 0;
    width: 12px;
    height: 12px;
    border-top: 2px solid ${({ theme }) => theme.color.primary};
    border-left: 2px solid ${({ theme }) => theme.color.primary};
    cursor: nwse-resize;
  }

  /* top-right */
  div:nth-of-type(2) {
    z-index: 12;
    position: absolute;
    top: 0;
    right: 0;
    width: 12px;
    height: 12px;
    border-top: 2px solid ${({ theme }) => theme.color.primary};
    border-right: 2px solid ${({ theme }) => theme.color.primary};
    cursor: nesw-resize;
  }

  /* bottom-left */
  div:nth-of-type(3) {
    z-index: 12;
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 12px;
    height: 12px;
    border-bottom: 2px solid ${({ theme }) => theme.color.primary};
    border-left: 2px solid ${({ theme }) => theme.color.primary};
    cursor: nesw-resize;
  }

  /* bottom-right */
  div:nth-of-type(4) {
    z-index: 12;
    position: absolute;
    bottom: 0px;
    right: 0px;
    width: 12px;
    height: 12px;
    border-bottom: 2px solid ${({ theme }) => theme.color.primary};
    border-right: 2px solid ${({ theme }) => theme.color.primary};
    cursor: nwse-resize;
  }

  /* top */
  span:nth-of-type(1) {
    position: absolute;
    top: 0;
    width: 100%;
    height: 1px;
    border-top: 2px dashed ${({ theme }) => theme.color.primary};
  }
  /* right */
  span:nth-of-type(2) {
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    border-right: 2px dashed ${({ theme }) => theme.color.primary};
  }
  /* bottom */
  span:nth-of-type(3) {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1px;
    border-bottom: 2px dashed ${({ theme }) => theme.color.primary};
  }
  /* left */
  span:nth-of-type(4) {
    position: absolute;
    left: 0;
    top: 0;
    width: 1px;
    height: 100%;
    border-left: 2px dashed ${({ theme }) => theme.color.primary};
  }
`;

const ThirdContentCropper = styled.canvas<{ cmd: ResizeCmd | null }>`
  position: absolute;
  cursor: move;
  ${({ cmd }) => {
    if (!cmd) return;
    if (cmd === 'top-left' || cmd === 'bottom-right') {
      return css`
        cursor: nwse-resize;
      `;
    }
    if (cmd === 'bottom-left' || cmd === 'top-right') {
      return css`
        cursor: nesw-resize;
      `;
    }
  }}
`;

const ThirdPreviewCanvas = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: ${({ theme }) => theme.canvasShadowFilter};
  text-align: center;
`;

const ThirdStep = () => {
  const dispatch = useAppDispatch();
  const { selectedFrame } = useAppSelector(({ frame }) => frame);
  const { canvasSaveList } = useAppSelector(({ canvas }) => canvas);
  const IMAGE_MAXIMUM_WIDTH = 304;
  const IMAGE_MAXIMUM_HEIGHT = 304;

  const [isResizeMode, setIsResizeMode] = useState(false);
  const [cmd, setCmd] = useState<ResizeCmd | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const imgCanvasRef = useRef<HTMLCanvasElement>(null);
  const cropperRef = useRef<HTMLCanvasElement>(null);
  const cropperWrapperRef = useRef<HTMLDivElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [selectFrameName, setSelectFrameName] = useState(selectedFrame[0]?.name);
  const [isMoving, setIsMoving] = useState(false);

  const [xDiff, setXDiff] = useState(0);
  const [yDiff, setYDiff] = useState(0);
  const [isCalc, setIsCalc] = useState(false);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);

  const [bgColor] = useState(theme.color.white);

  const selectedInfo = useMemo(() => {
    const selectedCanvas = selectedFrame.filter((lst) => lst.name === selectFrameName)[0];
    return selectedCanvas;
  }, [selectFrameName, selectedFrame]);

  const imgElements = useMemo(() => {
    const res = new Map();

    for (const info of selectedFrame) {
      const img = new Image();
      img.src = info.imgUrl || '';
      img.crossOrigin = 'Anonymous';
      res.set(info.name, img);
    }
    return res;
  }, [selectedFrame]);

  const [isInitial, setIsInitial] = useState(false);

  const [cropperList, setCropperList] = useState<{ name: string; x: number; y: number }[]>([
    { name: selectedInfo.name, x: 0, y: 0 },
  ]);

  const createInitialCanvas = useCallback(() => {
    selectedFrame.forEach((info: SelectedFrame) => {
      const previewCanvas = document.createElement('canvas');
      const pCtx = previewCanvas.getContext('2d');

      const img = new Image();
      img.src = info.imgUrl || '';
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        if (!pCtx) return;
        const { naturalWidth, naturalHeight } = img;
        const [imgW, imgH] = getOriginRatio(naturalWidth, naturalHeight, IMAGE_MAXIMUM_WIDTH, IMAGE_MAXIMUM_HEIGHT);

        const isSquare = info.type === 1;

        let w = 0;
        let h = 0;

        const scaleX = naturalWidth / imgW;
        const scaleY = naturalHeight / imgH;

        if (isSquare) {
          // 정사각형이면 이미지 너비에 따라 정사각형
          if (imgW > imgH) {
            const [ratioW, ratioH] = getOriginRatio(info.size.width, info.size.height, imgH, imgH);
            w = ratioW;
            h = ratioH;
          } else {
            const [ratioW, ratioH] = getOriginRatio(info.size.width, info.size.height, imgW, imgW);
            w = ratioW;
            h = ratioH;
          }
        } else {
          const [ratioW, ratioH] = getOriginRatio(info.size.width, info.size.height, imgW, imgH);
          w = ratioW;
          h = ratioH;
        }
        const crop = { x: selectedInfo.x || 0, y: selectedInfo.y || 0 };
        console.log(crop);
        previewCanvas.width = w;
        previewCanvas.height = h;

        pCtx.clearRect(0, 0, imgW, imgH);
        pCtx.imageSmoothingQuality = 'high';
        pCtx.drawImage(img, crop.x * scaleX, crop.y * scaleY, imgW * scaleX, imgH * scaleY, 0, 0, imgW, imgH);
        pCtx.globalCompositeOperation = 'destination-over';
        pCtx.fillStyle = bgColor;
        pCtx.fillRect(0, 0, imgW, imgH);

        dispatch(setCanvasSaveList({ name: info.name, canvas: previewCanvas }));
        setCropperList((prev) => {
          return [...prev, { name: info.name, x: crop.x, y: crop.y }];
        });
        setIsInitial(true);
      };
    });
  }, [selectedFrame, selectedInfo.x, selectedInfo.y, bgColor, dispatch]);

  const createCropperCanvas = useCallback(
    (canvas: HTMLCanvasElement, img: HTMLImageElement, preview?: boolean) => {
      const ctx = canvas.getContext('2d');
      const imgCanvas = imgCanvasRef.current;
      const cropperWrapper = cropperWrapperRef.current;
      if (!ctx || !imgCanvas || !cropperWrapper) return;

      const { width: imgW, height: imgH } = imgCanvas.getBoundingClientRect();

      const isSquare = selectedInfo.type === 1;

      let w = 0;
      let h = 0;

      if (isSquare) {
        // 정사각형이면 이미지 너비에 따라 정사각형
        if (imgW > imgH) {
          const [ratioW, ratioH] = getOriginRatio(selectedInfo.size.width, selectedInfo.size.height, imgH, imgH);
          w = ratioW;
          h = ratioH;
        } else {
          const [ratioW, ratioH] = getOriginRatio(selectedInfo.size.width, selectedInfo.size.height, imgW, imgW);
          w = ratioW;
          h = ratioH;
        }
      } else {
        const [ratioW, ratioH] = getOriginRatio(selectedInfo.size.width, selectedInfo.size.height, imgW, imgH);
        w = ratioW;
        h = ratioH;
      }

      const { naturalWidth, naturalHeight } = img;

      const scaleX = naturalWidth / imgW;
      const scaleY = naturalHeight / imgH;

      setCanvasWidth(canvasWidth ? canvasWidth : w);
      setCanvasHeight(canvasHeight ? canvasHeight : h);
      // const crop = cropperList.filter((lst) => lst.name === selectFrameName)[0];
      const crop = { x: selectedInfo.x || 0, y: selectedInfo.y || 0 };
      cropperWrapper.style.top = `${crop?.y}px`;
      cropperWrapper.style.left = `${crop?.x}px`;

      canvas.width = canvasWidth || w;
      canvas.height = canvasHeight || h;
      cropperWrapper.dataset.width = `${w}`;
      cropperWrapper.dataset.height = `${h}`;

      ctx.clearRect(0, 0, imgW, imgH);
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, crop?.x * scaleX, crop?.y * scaleY, imgW * scaleX, imgH * scaleY, 0, 0, imgW, imgH);

      // 프리뷰 드로잉
      if (preview) {
        const previewCanvas = previewCanvasRef.current;
        if (previewCanvas) {
          const pCtx = previewCanvas.getContext('2d');

          previewCanvas.width = canvasWidth || w;
          previewCanvas.height = canvasHeight || h;

          if (!pCtx) return;
          pCtx.clearRect(0, 0, imgW, imgH);
          pCtx.imageSmoothingQuality = 'high';
          pCtx.drawImage(img, crop?.x * scaleX, crop?.y * scaleY, imgW * scaleX, imgH * scaleY, 0, 0, imgW, imgH);

          pCtx.globalCompositeOperation = 'destination-over';
          pCtx.fillStyle = bgColor;
          pCtx.fillRect(0, 0, imgW, imgH);
          dispatch(setCanvasSaveList({ name: selectFrameName, canvas: previewCanvas }));
          setCropperList((prev) => {
            const isExist = prev.find((lst) => lst.name === selectFrameName);
            if (isExist) {
              return prev;
            } else {
              return [...prev, { name: selectFrameName, x: 0, y: 0 }];
            }
          });
        }
      }
    },
    [
      bgColor,
      canvasHeight,
      canvasWidth,
      dispatch,
      selectFrameName,
      selectedInfo.size.height,
      selectedInfo.size.width,
      selectedInfo.type,
      selectedInfo.x,
      selectedInfo.y,
    ],
  );

  const drawingPreview = useCallback(
    (name: string, img: HTMLImageElement) => {
      const canvas = previewCanvasRef.current;
      if (canvas) {
        createCropperCanvas(canvas, img, true);
      }
    },
    [createCropperCanvas],
  );

  const drawingCropper = useCallback(
    (name: string, img: HTMLImageElement) => {
      const canvas = cropperRef.current;
      if (canvas) {
        createCropperCanvas(canvas, img);
      }
    },
    [createCropperCanvas],
  );

  const createImgCanvas = useCallback((canvas: HTMLCanvasElement, img: HTMLImageElement) => {
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    const { naturalWidth, naturalHeight } = img;

    const [newW, newH] = getOriginRatio(naturalWidth, naturalHeight, IMAGE_MAXIMUM_WIDTH, IMAGE_MAXIMUM_HEIGHT);

    canvas.width = newW;
    canvas.height = newH;
    canvas.style.filter = 'brightness(60%)';

    setImgWidth(newW);
    setImgHeight(newH);

    ctx.clearRect(0, 0, newW, newH);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, newW, newH);
  }, []);

  // const handleResizeStart = useCallback((e) => {
  //   const { cmd } = e.currentTarget.dataset;
  //   setIsResizeMode(true);
  //   setCmd(cmd);
  //   setIsCalc(true);
  // }, []);

  const handleResizeEnd = useCallback(() => {
    setIsResizeMode(false);
    setCmd(null);
    setIsCalc(false);
  }, []);

  const handleResize = useCallback(
    (e) => {
      if (!isResizeMode) return;
      if (cropperWrapperRef.current) {
        e.preventDefault();
        const [cursorX, cursorY] = getPosition(e);
        if (cursorX && cursorY && cmd) {
          const result = positioningImageResize(cropperWrapperRef, cmd, cursorX, cursorY);
          if (result) {
            // const { newWidth, newHeight } = result;
            // if (newWidth + cropperX > imgWidth || newHeight + cropperY > imgHeight) {
            //   return;
            // }
            // setResizeWidth(newWidth);
            // setResizeHeight(newHeight);
          }
        }
      }

      requestAnimationFrame(() => handleResize);
    },
    [isResizeMode, cmd],
  );

  const handleSelected = useCallback(
    (e) => {
      const { name } = e.currentTarget.dataset;
      if (selectFrameName === name) return;
      setSelectFrameName(name);
      setCanvasWidth(0);
      setCanvasHeight(0);
    },
    [selectFrameName],
  );

  const handleMovingCropper = useCallback(
    (e) => {
      const [cursorX, cursorY] = getPosition(e);

      const cropperWrapper = cropperWrapperRef.current;
      const imgCanvas = imgCanvasRef.current;
      if (!cropperWrapper || !imgCanvas) return;
      const x = cursorX - window.innerWidth / 2;
      const y = cursorY - window.innerHeight / 2 - 45;

      if (isCalc) {
        setXDiff(x - replacePx(cropperWrapper.style.left));
        setYDiff(y - replacePx(cropperWrapper.style.top));
        setIsCalc(false);
      }
      if (!isCalc) {
        const { width, height } = imgCanvas.getBoundingClientRect();
        const positionX = x - xDiff;
        const positionY = y - yDiff;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        const cropperLeft = (window.innerWidth - canvasWidth) / 2;
        const cropperTop = (window.innerHeight - canvasHeight) / 2;
        const cropX = cropperLeft - left;
        const cropY = cropperTop - top;

        const positionLeft = positionX >= 0 ? (positionX >= cropX * 2 ? cropX * 2 : positionX) : 0;
        const positionTop = positionY >= 0 ? (positionY >= cropY * 2 ? cropY * 2 : positionY) : 0;
        const cropper = cropperList[0];

        if (cropper) {
          const { x, y, name } = cropper;
          dispatch(updatePositionByFrame({ name, x, y }));
        }
        setCropperList((prev) => {
          const isExist = prev.find((lst) => lst.name === selectFrameName);
          if (isExist) {
            const res = prev.map((lst) => ({
              ...lst,
              name: lst.name === selectFrameName ? selectedInfo.name : lst.name,
              x: lst.name === selectFrameName ? positionLeft : lst.x,
              y: lst.name === selectFrameName ? positionTop : lst.y,
            }));
            return res;
          } else {
            return [...prev, { name: selectFrameName, x: positionLeft, y: positionTop }];
          }
        });
      }
    },
    [isCalc, xDiff, yDiff, canvasWidth, canvasHeight, cropperList, dispatch, selectFrameName, selectedInfo.name],
  );

  const handleActiveCropper = useCallback(() => {
    setIsMoving(true);
    setIsCalc(true);
  }, []);

  const handleCancelMoveCropper = useCallback(() => {
    setIsMoving(false);
    setIsCalc(false);
  }, []);

  useEffect(() => {
    const img: HTMLImageElement = imgElements.get(selectFrameName);

    if (!isLoaded) {
      img.onload = () => {
        setIsLoaded(true);
      };
    }
  }, [imgElements, isLoaded, selectFrameName]);

  useEffect(() => {
    const img: HTMLImageElement = imgElements.get(selectFrameName);

    if (isLoaded) {
      const imgCanvas = imgCanvasRef.current;
      if (imgCanvas) {
        new Promise((resolve) => {
          createImgCanvas(imgCanvas, img);
          resolve(true);
        })
          .then(() => {
            drawingCropper(selectFrameName, img);
            drawingPreview(selectFrameName, img);
          })
          .catch((err) => new Error(`캔버스 드로잉에 실패했습니다! ${err}`));
      }
    }
  }, [selectFrameName, imgElements, isLoaded, createImgCanvas, drawingCropper, drawingPreview]);

  // 초기 진입시 캔버스 생성
  useEffect(() => {
    if (canvasSaveList.length === selectedFrame.length) {
      setIsInitial(true);
      return;
    }
  }, [canvasSaveList.length, selectedFrame.length]);

  useEffect(() => {
    if (isInitial) return;
    createInitialCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitial]);

  return (
    <Container
      cmd={cmd}
      onMouseMove={isResizeMode ? handleResize : undefined}
      onMouseUp={handleResizeEnd}
      onMouseLeave={handleResizeEnd}
    >
      {selectedFrame.length > 1 ? (
        <ThirdItemList>
          {selectedFrame.map((lst) => (
            <div>
              <ThirdItem
                type={lst.type}
                selected={lst.name === selectFrameName}
                onClick={handleSelected}
                data-name={lst.name}
              >
                <img src={lst.imgUrl} />
              </ThirdItem>
            </div>
          ))}
        </ThirdItemList>
      ) : (
        <>
          <Divider />
          <br />
          <br />
        </>
      )}
      <ThirdContent>
        <ThirdContentDrawingCanvas
          width={imgWidth}
          height={imgHeight}
          onMouseUp={isResizeMode ? handleResizeEnd : undefined}
        >
          <canvas ref={imgCanvasRef} />

          <ThirdContentCropperWrapper
            width={canvasWidth}
            height={canvasHeight}
            ref={cropperWrapperRef}
            onMouseUp={isResizeMode ? handleResizeEnd : undefined}
          >
            <ThirdContentCropper
              cmd={cmd}
              ref={cropperRef}
              data-url={selectedInfo.imgUrl || ''}
              onTouchStart={isMoving && isMobile ? handleMovingCropper : undefined}
              onTouchEnd={isMobile ? handleActiveCropper : undefined}
              onTouchMove={isMobile ? handleCancelMoveCropper : undefined}
              onMouseMove={isMoving ? handleMovingCropper : undefined}
              onMouseDown={handleActiveCropper}
              onMouseUp={isMoving ? handleCancelMoveCropper : handleResizeEnd}
              onMouseLeave={isMoving ? handleCancelMoveCropper : undefined}
            />

            {/* <div
              data-cmd="top-left"
              onMouseDown={handleResizeStart}
              onTouchStart={isMobile ? handleResizeStart : undefined}
            />
            <div
              data-cmd="top-right"
              onMouseDown={handleResizeStart}
              onTouchStart={isMobile ? handleResizeStart : undefined}
            />
            <div
              data-cmd="bottom-left"
              onMouseDown={handleResizeStart}
              onTouchStart={isMobile ? handleResizeStart : undefined}
            />
            <div
              data-cmd="bottom-right"
              onMouseDown={handleResizeStart}
              onTouchStart={isMobile ? handleResizeStart : undefined}
            /> */}
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </ThirdContentCropperWrapper>
        </ThirdContentDrawingCanvas>

        <ThirdPreviewCanvas>
          <canvas ref={previewCanvasRef} />
        </ThirdPreviewCanvas>
      </ThirdContent>
    </Container>
  );
};

export default ThirdStep;
