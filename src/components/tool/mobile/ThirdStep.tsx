import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Popover, Button, Spin } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ColorResult } from 'react-color';
import { isMobile } from 'react-device-detect';
import { IMAGE_MAXIMUM_WIDTH, IMAGE_MAXIMUM_HEIGHT } from 'src/constants';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import { ResizeCmd } from 'src/interfaces/ToolInterface';
import { setCanvasSaveList } from 'src/store/reducers/canvas';
import {
  rotateSelectedFrameList,
  SelectedFrame,
  setBgColorFrame,
  setFrameSize,
  setOriginSize,
  updatePositionByFrame,
} from 'src/store/reducers/frame';
import { getOriginRatio } from 'src/utils/getOriginRatio';
import { getPosition } from 'src/utils/getPosition';
import { replacePx } from 'src/utils/replacePx';
import ToolColorPalette from '../divided/DividedToolColorPalette';

const SpinLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`;

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

const ThirdBgChanger = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
  img {
    width: 18px;
  }
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

const ThirdItem = styled.div<{ type: 1 | 2 | 3; selected: boolean }>`
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
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.color.gray100};
  margin: 0 auto;
`;

const ThirdContentCropperWrapper = styled.div<{ width: number; height: number }>`
  position: absolute;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;

  /* top-left */
  div:nth-of-type(1) {
    z-index: 12;
    position: absolute;
    top: -4px;
    left: -4px;
    width: 12px;
    height: 12px;
    background: ${({ theme }) => theme.color.primary};
    cursor: nwse-resize;
  }

  /* top-right */
  div:nth-of-type(2) {
    z-index: 12;
    position: absolute;
    top: -4px;
    right: -4px;
    width: 12px;
    height: 12px;
    background: ${({ theme }) => theme.color.primary};
    cursor: nesw-resize;
  }

  /* bottom-left */
  div:nth-of-type(3) {
    z-index: 12;
    position: absolute;
    bottom: -4px;
    left: -4px;
    width: 12px;
    height: 12px;
    background: ${({ theme }) => theme.color.primary};
    cursor: nesw-resize;
  }

  /* bottom-right */
  div:nth-of-type(4) {
    z-index: 12;
    position: absolute;
    bottom: -4px;
    right: -4px;
    width: 12px;
    height: 12px;
    background: ${({ theme }) => theme.color.primary};
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
  const { selectedFrame, frameInfoList } = useAppSelector(({ frame }) => frame);
  const imgCanvasRef = useRef<HTMLCanvasElement>(null);
  const cropperRef = useRef<HTMLCanvasElement>(null);
  const cropperWrapperRef = useRef<HTMLDivElement>(null);

  const [isResizeMode, setIsResizeMode] = useState(false);
  const [cmd, setCmd] = useState<ResizeCmd | null>(null);

  const [isCropperDrawing, setIsCropperDrawing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [selectFrameName, setSelectFrameName] = useState(selectedFrame[0]?.name);
  const [isMoving, setIsMoving] = useState(false);

  const [ratio, setRatio] = useState(0);
  const [xDiff, setXDiff] = useState(0);
  const [yDiff, setYDiff] = useState(0);
  const [cursorXDiff, setCursorXDiff] = useState(0);
  const [cursorYDiff, setCursorYDiff] = useState(0);
  const [isCalc, setIsCalc] = useState(false);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [resizeWidth, setResizeWidth] = useState(0);
  const [resizeHeight, setResizeHeight] = useState(0);
  const [initialOriginWidth, setInitialOriginWidth] = useState(0);
  const [initialOriginHeight, setInitialOriginHeight] = useState(0);

  const selectedInfo = useMemo(() => {
    const selectedCanvas = selectedFrame.filter((lst) => lst.name === selectFrameName)[0];
    return selectedCanvas;
  }, [selectFrameName, selectedFrame]);

  const isRotate = useMemo(() => {
    return selectedInfo.isRotate;
  }, [selectedInfo.isRotate]);

  const originWidth = useMemo(() => {
    return selectedInfo.originWidth || 0;
  }, [selectedInfo.originWidth]);

  const originHeight = useMemo(() => {
    return selectedInfo.originHeight || 0;
  }, [selectedInfo.originHeight]);

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

  const previewRef = useRef<HTMLCanvasElement>(null);

  const createSaveCanvas = useCallback(() => {
    selectedFrame.forEach((info: SelectedFrame) => {
      const saveCanvas = document.createElement('canvas');
      const previewCanvas = document.createElement('canvas');
      const sCtx = saveCanvas.getContext('2d');
      const pCtx = previewCanvas.getContext('2d');

      const img = new Image();
      img.src = info.imgUrl || '';
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        if (!sCtx || !pCtx) return;
        if (typeof selectedInfo.x !== 'number' || typeof selectedInfo.y !== 'number') {
          return;
        }
        const { naturalWidth, naturalHeight } = img;
        const [imgW, imgH] = getOriginRatio(naturalWidth, naturalHeight, IMAGE_MAXIMUM_WIDTH, IMAGE_MAXIMUM_HEIGHT);

        const isSquare = info.type === 1;

        let w = 0;
        let h = 0;

        if (!originWidth && !originHeight) {
          if (isSquare) {
            // 너비가 높이보다 크면 높이에 맞춰 렌더링
            if (imgW > imgH) {
              const [ratioW, ratioH] = getOriginRatio(info.size.width, info.size.height, imgH, imgH);
              w = ratioW;
              h = ratioH;
            } else {
              const [ratioW, ratioH] = getOriginRatio(info.size.width, info.size.height, imgW, imgW);
              w = ratioW;
              h = ratioH;
            }
          }
          if (!isSquare) {
            if (imgW > imgH) {
              const [ratioW, ratioH] = getOriginRatio(
                info.size.width,
                info.size.height,
                imgH,
                imgH,
                IMAGE_MAXIMUM_WIDTH,
              );
              w = ratioW;
              h = ratioH;
            } else {
              const [ratioW, ratioH] = getOriginRatio(
                info.size.width,
                info.size.height,
                imgW,
                imgW,
                IMAGE_MAXIMUM_WIDTH,
              );
              w = ratioW;
              h = ratioH;
            }
          }
          dispatch(setOriginSize({ originWidth: w, originHeight: h }));
          dispatch(setFrameSize({ resizeWidth: w, resizeHeight: h }));
          setInitialOriginWidth(w);
          setInitialOriginHeight(h);
        }

        const scaleX = naturalWidth / imgW;
        const scaleY = naturalHeight / imgH;

        const initialSize = frameInfoList.filter((lst) => lst.name === selectFrameName)[0].size;
        const ratio = initialSize.height / initialSize.width;

        const cropperSize = { w: info.size.width, h: info.size.height };
        const crop = { x: info.x || 0, y: info.y || 0 };

        const canvasW = (cropperSize.w || w) > imgW ? imgW : cropperSize.w || w;
        const canvasH = (cropperSize.w || w) > imgW ? imgW / ratio : cropperSize.h || h;
        // 프리뷰
        previewCanvas.width = canvasW * scaleX;
        previewCanvas.height = canvasH * scaleY;

        pCtx.clearRect(0, 0, canvasW * scaleX, canvasH * scaleY);
        pCtx.imageSmoothingQuality = 'high';
        pCtx.drawImage(
          img,
          crop.x * scaleX,
          crop.y * scaleY,
          canvasW * scaleX,
          canvasH * scaleY,
          0,
          0,
          canvasW * scaleX,
          canvasH * scaleY,
        );
        pCtx.globalCompositeOperation = 'destination-over';
        pCtx.fillStyle = info.bgColor || '#fff';
        pCtx.fillRect(0, 0, canvasW * scaleX, canvasH * scaleY);
        const preview = previewRef.current;
        if (preview) {
          const preCtx = preview.getContext('2d');
          if (!preCtx) return;
          const pW = isRotate ? h || initialOriginHeight || canvasW : w || initialOriginWidth || canvasW;
          const pH = isRotate ? w || initialOriginWidth || canvasH : h || initialOriginHeight || canvasH;
          preview.width = pW;
          preview.height = pH;
          preCtx.clearRect(0, 0, pW, pH);
          preCtx.imageSmoothingQuality = 'high';
          preCtx.drawImage(img, crop.x * scaleX, crop.y * scaleY, canvasW * scaleX, canvasH * scaleY, 0, 0, pW, pH);
          preCtx.globalCompositeOperation = 'destination-over';
          preCtx.fillStyle = info.bgColor || '#fff';
          preCtx.fillRect(0, 0, pW, pH);
          dispatch(setCanvasSaveList({ name: info.name, previewCanvas }));
        }
      };
    });
  }, [
    selectedFrame,
    selectedInfo.x,
    selectedInfo.y,
    originWidth,
    originHeight,
    dispatch,
    frameInfoList,
    isRotate,
    initialOriginHeight,
    initialOriginWidth,
    selectFrameName,
  ]);

  const createCropperCanvas = useCallback(
    async (canvas: HTMLCanvasElement, img: HTMLImageElement) => {
      if (typeof selectedInfo.x !== 'number' || typeof selectedInfo.y !== 'number') {
        return;
      }
      const ctx = canvas.getContext('2d');
      const imgCanvas = imgCanvasRef.current;
      const cropperWrapper = cropperWrapperRef.current;
      if (!ctx || !imgCanvas || !cropperWrapper) return;

      const { naturalWidth, naturalHeight } = img;

      const [imgW, imgH] = getOriginRatio(naturalWidth, naturalHeight, IMAGE_MAXIMUM_WIDTH, IMAGE_MAXIMUM_HEIGHT);

      const isSquare = selectedInfo.type === 1;

      let w = 0;
      let h = 0;

      const initialSize = frameInfoList.filter((lst) => lst.name == selectFrameName)[0].size;

      if (isSquare) {
        // 너비가 높이보다 크면 높이에 맞춰 렌더링
        if (imgW > imgH) {
          const [ratioW, ratioH] = getOriginRatio(initialSize.width, initialSize.height, imgH, imgH);
          w = ratioW;
          h = ratioH;
        } else {
          const [ratioW, ratioH] = getOriginRatio(initialSize.width, initialSize.height, imgW, imgW);
          w = ratioW;
          h = ratioH;
        }
      }
      if (!isSquare) {
        if (imgW > imgH) {
          const [ratioW, ratioH] = getOriginRatio(
            initialSize.width,
            initialSize.height,
            imgH,
            imgH,
            IMAGE_MAXIMUM_WIDTH,
          );
          w = ratioW;
          h = ratioH;
        } else {
          const [ratioW, ratioH] = getOriginRatio(
            initialSize.width,
            initialSize.height,
            imgW,
            imgW,
            IMAGE_MAXIMUM_WIDTH,
          );
          w = ratioW;
          h = ratioH;
        }
      }

      const scaleX = naturalWidth / imgW;
      const scaleY = naturalHeight / imgH;
      const canvasW = originWidth ? selectedInfo.size.width : w;
      const canvasH = originHeight ? selectedInfo.size.height : h;
      const ratio = initialSize.height / initialSize.width;
      setCanvasWidth(canvasW > imgW ? imgW : canvasW);
      setCanvasHeight(canvasW > imgW ? imgW / ratio : canvasH);

      const crop = { x: selectedInfo.x, y: selectedInfo.y };
      cropperWrapper.style.top = `${crop.y}px`;
      cropperWrapper.style.left = `${crop.x}px`;

      canvas.width = canvasW > imgW ? imgW : canvasW;
      canvas.height = canvasW > imgW ? imgW / ratio : canvasH;

      ctx.clearRect(0, 0, imgW, imgH);
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, crop.x * scaleX, crop.y * scaleY, imgW * scaleX, imgH * scaleY, 0, 0, imgW, imgH);
    },
    [
      frameInfoList,
      originHeight,
      originWidth,
      selectFrameName,
      selectedInfo.size.height,
      selectedInfo.size.width,
      selectedInfo.type,
      selectedInfo.x,
      selectedInfo.y,
    ],
  );

  const drawingCropper = useCallback(
    (img: HTMLImageElement) => {
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

    const w = newW;
    const h = newH;

    canvas.width = w;
    canvas.height = h;
    canvas.style.filter = 'brightness(60%)';

    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, w, h);

    setImgWidth(w);
    setImgHeight(h);
  }, []);

  const handleResizeStart = useCallback((e) => {
    const { cmd } = e.currentTarget.dataset;
    setIsResizeMode(true);
    setCmd(cmd);
    setIsCalc(true);
    setIsCropperDrawing(false);
  }, []);

  const handleResizeEnd = useCallback(() => {
    setIsResizeMode(false);
    setCmd(null);
    setIsCalc(false);
    dispatch(setOriginSize({ originWidth: resizeWidth, originHeight: resizeHeight }));
    dispatch(setFrameSize({ resizeWidth, resizeHeight }));
    setIsCropperDrawing(true);
  }, [dispatch, resizeWidth, resizeHeight]);

  const handleResize = useCallback(
    (e) => {
      if (!isResizeMode) return;
      if (cropperWrapperRef.current) {
        e.preventDefault();
        const [cursorX, cursorY] = getPosition(e);
        if (cursorX && cursorY && cmd) {
          const imgCanvas = imgCanvasRef.current;
          if (imgCanvas) {
            const {
              left: imgPaddingLeft,
              // top: imgPaddingTop,
              right: imgPaddingRight,
            } = imgCanvas.getBoundingClientRect();
            const cropperWrapper = cropperWrapperRef.current;
            const { right: cropperPaddingRight } = cropperWrapper.getBoundingClientRect();

            const cursorXInImage = cursorX - imgPaddingLeft;
            // const cursorYInImage = cursorY - imgPaddingTop;
            const cropperRight = imgPaddingRight - cropperPaddingRight;

            if (isCalc) {
              setCursorXDiff(replacePx(cropperWrapper.style.left));
              setCursorYDiff(replacePx(cropperWrapper.style.top));
              setIsCalc(false);
            }

            if (!isCalc) {
              // top-left에서 움직일시 크기
              const cursorX = cursorXInImage - cursorXDiff;
              // const cursorY = cursorYInImage - cursorYDiff;
              if (cmd === 'top-left') {
                const resizeByTopLeft = originWidth - cursorX;
                if (resizeByTopLeft + cropperRight > imgWidth) return;
                const resizeByBottomLeft = resizeByTopLeft * ratio;
                if (resizeByBottomLeft + cursorYDiff > imgHeight) return;
                // const resizeByBottomLeft = originHeight - cursorY;
                dispatch(
                  updatePositionByFrame({
                    name: selectedInfo.name,
                    x: cursorXInImage,
                    y: cursorYDiff,
                    width: resizeByTopLeft,
                    height: resizeByBottomLeft,
                  }),
                );
                setResizeWidth(resizeByTopLeft);
                setResizeHeight(resizeByBottomLeft);
              }

              // top-right에서 움직일시 크기
              if (cmd === 'top-right') {
                const resizeByTopRight = cursorX;
                if (resizeByTopRight + cursorXDiff > imgWidth) return;
                const resizeByBottomRight = resizeByTopRight * ratio;
                if (resizeByBottomRight + cursorYDiff > imgHeight) return;

                // const resizeByBottomRight = originHeight - cursorY;

                dispatch(
                  updatePositionByFrame({
                    name: selectedInfo.name,
                    x: cursorXDiff,
                    y: cursorYDiff,
                    width: resizeByTopRight,
                    height: resizeByBottomRight,
                  }),
                );
                setResizeWidth(resizeByTopRight);
                setResizeHeight(resizeByBottomRight);
              }

              // bottom-left에서 움직일시 크기
              if (cmd === 'bottom-left') {
                const resizeByBottomLeft = originWidth - cursorX;
                if (resizeByBottomLeft + cropperRight > imgWidth) return;
                const resizeByTopLeft = resizeByBottomLeft * ratio;
                if (resizeByTopLeft + cursorYDiff > imgHeight) return;
                // const resizeByTopLeft = cursorY;

                dispatch(
                  updatePositionByFrame({
                    name: selectedInfo.name,
                    x: cursorXInImage,
                    y: cursorYDiff,
                    width: resizeByBottomLeft,
                    height: resizeByTopLeft,
                  }),
                );
                setResizeWidth(resizeByBottomLeft);
                setResizeHeight(resizeByTopLeft);
              }

              // bottom-right에서 움직일시 크기
              if (cmd === 'bottom-right') {
                const resizeByTopRight = cursorX;
                if (resizeByTopRight + cursorXDiff > imgWidth) return;
                const resizeByBottomRight = resizeByTopRight * ratio;
                if (resizeByBottomRight + cursorYDiff > imgHeight) return;
                // const resizeByBottomRight = cursorY;

                dispatch(
                  updatePositionByFrame({
                    name: selectedInfo.name,
                    x: cursorXDiff,
                    y: cursorYDiff,
                    width: resizeByTopRight,
                    height: resizeByBottomRight,
                  }),
                );
                setResizeWidth(resizeByTopRight);
                setResizeHeight(resizeByBottomRight);
              }
            }
          }
        }
      }

      requestAnimationFrame(() => handleResize);
    },
    [
      isResizeMode,
      cmd,
      isCalc,
      cursorXDiff,
      originWidth,
      imgWidth,
      ratio,
      cursorYDiff,
      imgHeight,
      dispatch,
      selectedInfo.name,
    ],
  );

  const handleSelected = useCallback(
    (e) => {
      const { name } = e.currentTarget.dataset;
      if (selectFrameName === name) return;
      setSelectFrameName(name);
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

        dispatch(
          updatePositionByFrame({
            name: selectFrameName,
            x: positionLeft,
            y: positionTop,
          }),
        );
      }
    },
    [isCalc, xDiff, yDiff, canvasWidth, canvasHeight, dispatch, selectFrameName],
  );

  const handleActiveCropper = useCallback(() => {
    setIsMoving(true);
    setIsCropperDrawing(false);
    setIsCalc(true);
  }, []);

  const handleCancelMoveCropper = useCallback(() => {
    setIsMoving(false);
    setIsCalc(false);
    setIsCropperDrawing(true);
  }, []);

  const handleColorChange = useCallback(
    (color: ColorResult) => {
      const { hex } = color;
      dispatch(setBgColorFrame({ bgColor: hex }));
    },
    [dispatch],
  );

  const handleRotate = useCallback(
    (e) => {
      const { type, id } = e.currentTarget.dataset;
      dispatch(
        updatePositionByFrame({
          name: selectedInfo.name,
          x: 0,
          y: 0,
          width: originWidth,
          height: originHeight,
        }),
      );
      dispatch(rotateSelectedFrameList({ type: +type, id: +id }));
      setIsCropperDrawing(true);
    },
    [dispatch, originHeight, originWidth, selectedInfo.name],
  );

  useEffect(() => {
    if (selectedInfo.bgColor) {
      createSaveCanvas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInfo.bgColor]);

  useEffect(() => {
    setRatio(originHeight / originWidth);
  }, [originWidth, originHeight]);

  useEffect(() => {
    if (isCropperDrawing) {
      const img: HTMLImageElement = imgElements.get(selectFrameName);
      drawingCropper(img);
      createSaveCanvas();
      setIsCropperDrawing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCropperDrawing]);

  // 사이즈 확대/축소시 및 움직일때 크로퍼 반영
  useEffect(() => {
    const img: HTMLImageElement = imgElements.get(selectFrameName);
    drawingCropper(img);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resizeWidth, resizeHeight, selectedInfo.x, selectedInfo.y]);

  // 로드 true에 따라 이미지와 크로퍼 생성
  useEffect(() => {
    if (!isLoaded) return;
    const img: HTMLImageElement = imgElements.get(selectFrameName);
    const imgCanvas = imgCanvasRef.current;
    if (!imgCanvas) return;
    createImgCanvas(imgCanvas, img);
    drawingCropper(img);
    createSaveCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // 그리기 위한 이미지가 로드 되면 true로
  useEffect(() => {
    const img: HTMLImageElement = imgElements.get(selectFrameName);

    if (!isLoaded) {
      img.onload = () => {
        setIsLoaded(true);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectFrameName]);

  useEffect(() => {
    return () => {
      setIsLoaded(false);
    };
  }, []);

  if (!isLoaded) {
    return (
      <SpinLoader>
        <Spin />
      </SpinLoader>
    );
  }

  return (
    <Container
      cmd={cmd}
      onMouseMove={isResizeMode ? handleResize : undefined}
      onMouseUp={isResizeMode ? handleResizeEnd : undefined}
      onMouseLeave={isResizeMode ? handleResizeEnd : undefined}
    >
      <ThirdBgChanger>
        <Button type="default" onClick={handleRotate} data-type={selectedInfo.type} data-id={selectedInfo.id}>
          <span>액자 회전</span>
          {/* <img src={icons.bgPaint} /> */}
        </Button>
        <Popover
          style={{ padding: 0 }}
          trigger="click"
          placement="bottom"
          content={<ToolColorPalette type="bg" onChange={handleColorChange} />}
        >
          <Button type="default">
            <span>배경 변경</span>
            {/* <img src={icons.bgPaint} /> */}
          </Button>
        </Popover>
      </ThirdBgChanger>

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
        <></>
      )}
      <ThirdContent>
        <ThirdContentDrawingCanvas width={imgWidth} height={imgHeight}>
          <canvas ref={imgCanvasRef} />
          <ThirdContentCropperWrapper width={canvasWidth} height={canvasHeight} ref={cropperWrapperRef}>
            <ThirdContentCropper
              cmd={cmd}
              ref={cropperRef}
              data-url={selectedInfo.imgUrl || ''}
              onTouchStart={isMobile ? handleMovingCropper : undefined}
              onTouchEnd={isMobile ? handleActiveCropper : undefined}
              onTouchMove={isMobile ? handleCancelMoveCropper : undefined}
              onMouseMove={isMoving ? handleMovingCropper : undefined}
              onMouseDown={!isResizeMode ? handleActiveCropper : undefined}
              onMouseUp={isMoving ? handleCancelMoveCropper : undefined}
              onMouseLeave={isMoving ? handleCancelMoveCropper : undefined}
            />

            <div
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
            />
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </ThirdContentCropperWrapper>
        </ThirdContentDrawingCanvas>

        <ThirdPreviewCanvas>
          <canvas ref={previewRef} />
        </ThirdPreviewCanvas>
      </ThirdContent>
    </Container>
  );
};

export default ThirdStep;
