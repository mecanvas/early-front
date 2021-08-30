import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Popover, Button, Spin } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ColorResult } from 'react-color';
import { IMAGE_MAXIMUM_WIDTH, IMAGE_MAXIMUM_HEIGHT, CROPPER_LIMIT_SIZE } from 'src/constants';
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
import { icons } from 'public/icons';
import { isIOS, isMobile } from 'react-device-detect';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

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
  margin-bottom: 1em;
  button {
    padding: 0 0.6em;
    font-size: 13px;
  }
  img {
    transform: scale(-1, 1);
    width: 17px;
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

  /* 텍스트 드래그 제거 */
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;

  /* top-left */
  div:nth-of-type(1) {
    z-index: 12;
    position: absolute;
    top: -6px;
    left: -6px;
    width: 1.1em;
    height: 1.1em;
    background: ${({ theme }) => theme.color.primary};
    cursor: nwse-resize;
  }

  /* top-right */
  div:nth-of-type(2) {
    z-index: 12;
    position: absolute;
    top: -6px;
    right: -6px;
    width: 1.1em;
    height: 1.1em;
    background: ${({ theme }) => theme.color.primary};
    cursor: nesw-resize;
  }

  /* bottom-left */
  div:nth-of-type(3) {
    z-index: 12;
    position: absolute;
    bottom: -6px;
    left: -6px;
    width: 1.1em;
    height: 1.1em;
    background: ${({ theme }) => theme.color.primary};
    cursor: nesw-resize;
  }

  /* bottom-right */
  div:nth-of-type(4) {
    z-index: 12;
    position: absolute;
    bottom: -6px;
    right: -6px;
    width: 1.1em;
    height: 1.1em;
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

  const [ratio, setRatio] = useState({ wRatio: 0, hRatio: 0 });
  const [xDiff, setXDiff] = useState(0);
  const [yDiff, setYDiff] = useState(0);
  const [topLeftXControl, setTopLeftXControl] = useState(0);

  const [cursorXDiff, setCursorXDiff] = useState(0);
  const [cursorYDiff, setCursorYDiff] = useState(0);
  const [isCalc, setIsCalc] = useState(false);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [cropperWidth, setCropperWidth] = useState(0);
  const [cropperHeight, setCropperHeight] = useState(0);
  const [resizeWidth, setResizeWidth] = useState(0);
  const [resizeHeight, setResizeHeight] = useState(0);

  const selectedInfo = useMemo(() => {
    const selectedCanvas = selectedFrame.filter((lst) => lst.name === selectFrameName)[0];
    return selectedCanvas;
  }, [selectFrameName, selectedFrame]);

  const originWidth = useMemo(() => {
    return selectedInfo.originWidth || 0;
  }, [selectedInfo.originWidth]);

  const originHeight = useMemo(() => {
    return selectedInfo.originHeight || 0;
  }, [selectedInfo.originHeight]);

  const imgElements = useMemo(() => {
    let res: { [key: string]: HTMLImageElement } = {};

    for (const info of selectedFrame) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.addEventListener('load', () => {
        setIsLoaded(true);
      });
      img.src = info.imgUrl || '';
      res = { ...res, [info.name]: img };
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
        const { naturalWidth, naturalHeight } = img;
        const [imgW, imgH] = getOriginRatio(naturalWidth, naturalHeight, IMAGE_MAXIMUM_WIDTH, IMAGE_MAXIMUM_HEIGHT);

        const isSquare = info.type === 1;

        let w = 0;
        let h = 0;
        const initialSize = frameInfoList.filter((lst) => lst.name === selectFrameName)[0].size;
        const ratio = initialSize.height / initialSize.width;
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
          if (w && h) {
            dispatch(setFrameSize({ resizeWidth: w > imgW ? imgW : w, resizeHeight: w > imgW ? imgW * ratio : h }));
            dispatch(setOriginSize({ originWidth: w > imgW ? imgW : w, originHeight: w > imgW ? imgW * ratio : h }));
          }
        }

        const scaleX = naturalWidth / imgW;
        const scaleY = naturalHeight / imgH;

        const crop = { x: info.x || 0, y: info.y || 0 };

        const canvasW = originWidth ? selectedInfo.size.width : w;
        const canvasH = originHeight ? selectedInfo.size.height : h;

        // 프리뷰
        const previewW = canvasW > imgW ? imgW : canvasW;
        const previewH = canvasW > imgW ? imgW * ratio : canvasH;
        previewCanvas.width = previewW * scaleX;
        previewCanvas.height = previewH * scaleY;
        pCtx.clearRect(0, 0, previewW * scaleX, previewH * scaleY);
        pCtx.imageSmoothingQuality = 'high';
        pCtx.drawImage(
          img,
          crop.x * scaleX,
          crop.y * scaleY,
          previewW * scaleX,
          previewH * scaleY,
          0,
          0,
          previewW * scaleX,
          previewH * scaleY,
        );
        pCtx.globalCompositeOperation = 'destination-over';
        pCtx.fillStyle = info.bgColor || '#fff';
        pCtx.fillRect(0, 0, previewW * scaleX, previewH * scaleY);
        const preview = previewRef.current;
        if (preview) {
          const preCtx = preview.getContext('2d');
          if (!preCtx) return;

          const pW = initialSize.width / 1.2;
          const pH = initialSize.height / 1.2;
          preview.width = pW;
          preview.height = pH;
          preCtx.clearRect(0, 0, pW, pH);
          preCtx.imageSmoothingQuality = 'high';
          preCtx.drawImage(img, crop.x * scaleX, crop.y * scaleY, previewW * scaleX, previewH * scaleY, 0, 0, pW, pH);
          preCtx.globalCompositeOperation = 'destination-over';
          preCtx.fillStyle = info.bgColor || '#fff';
          preCtx.fillRect(0, 0, pW, pH);
          dispatch(setCanvasSaveList({ name: info.name, previewCanvas }));
        }
      };
    });
  }, [
    selectedFrame,
    originWidth,
    originHeight,
    frameInfoList,
    selectedInfo.size.width,
    selectedInfo.size.height,
    dispatch,
    selectFrameName,
  ]);

  const createCropperCanvas = useCallback(
    async (canvas: HTMLCanvasElement, img: HTMLImageElement) => {
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
      setCropperWidth(canvasW > imgW ? imgW : canvasW);
      setCropperHeight(canvasW > imgW ? imgW * ratio : canvasH);

      // 처음 그릴때 cropper의 너비 높이를 저장합니다. resize 시 사용됩니다.

      if (isCropperDrawing) {
        dispatch(
          setFrameSize({
            resizeWidth: canvasW > imgW ? imgW : canvasW,
            resizeHeight: canvasW > imgW ? imgW * ratio : canvasH,
          }),
        );
        dispatch(
          setOriginSize({
            originWidth: canvasW > imgW ? imgW : canvasW,
            originHeight: canvasW > imgW ? imgW * ratio : canvasH,
          }),
        );
      }

      const crop = { x: selectedInfo.x || 0, y: selectedInfo.y || 0 };
      cropperWrapper.style.top = `${crop.y}px`;
      cropperWrapper.style.left = `${crop.x}px`;

      canvas.width = canvasW > imgW ? imgW : canvasW;
      canvas.height = canvasW > imgW ? imgW * ratio : canvasH;

      ctx.clearRect(0, 0, imgW, imgH);
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, crop.x * scaleX, crop.y * scaleY, imgW * scaleX, imgH * scaleY, 0, 0, imgW, imgH);
    },
    [
      dispatch,
      frameInfoList,
      isCropperDrawing,
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
    setIsCropperDrawing(true);
  }, []);

  const handleResize = useCallback(
    (e) => {
      if (!isResizeMode) return;
      if (cropperWrapperRef.current) {
        const [cursorX, cursorY] = getPosition(e);
        if (cursorX && cursorY && cmd) {
          const imgCanvas = imgCanvasRef.current;
          if (imgCanvas) {
            const { left: imgPaddingLeft, top: imgPaddingTop } = imgCanvas.getBoundingClientRect();
            const cropperWrapper = cropperWrapperRef.current;

            const cursorXInImage = cursorX - imgPaddingLeft;
            const cursorYInImage = cursorY - imgPaddingTop;
            // const cropperRight = imgPaddingRight - cropperPaddingRight;

            if (isCalc) {
              const hRatio = originHeight / originWidth;
              const x = cursorYInImage / hRatio;
              setCursorXDiff(replacePx(cropperWrapper.style.left));
              setCursorYDiff(replacePx(cropperWrapper.style.top));
              setTopLeftXControl(x - replacePx(cropperWrapper.style.left));
              setIsCalc(false);
            }

            if (!isCalc) {
              const { wRatio, hRatio } = ratio;
              const cursorX = cursorXInImage - cursorXDiff;
              const cursorY = cursorYInImage - cursorYDiff;
              // top-left에서 움직일시 크기
              if (cmd === 'top-left') {
                const resizeByBottomLeft = originHeight - cursorY;
                const resizeByTopLeft = resizeByBottomLeft * wRatio;
                if (resizeByBottomLeft > imgHeight || cursorYInImage < 0) return;
                // if (cursorYInImage / hRatio - topLeftXControl < 0) return;
                if (resizeByTopLeft > imgWidth) return;
                if (resizeByTopLeft < CROPPER_LIMIT_SIZE || resizeByTopLeft < CROPPER_LIMIT_SIZE) return;
                dispatch(
                  updatePositionByFrame({
                    name: selectedInfo.name,
                    x: cursorYInImage / hRatio - topLeftXControl,
                    y: cursorYInImage,
                    width: resizeByTopLeft,
                    height: resizeByBottomLeft,
                  }),
                );
                setResizeWidth(resizeByTopLeft);
                setResizeHeight(resizeByBottomLeft);
              }

              // top-right에서 움직일시 크기
              if (cmd === 'top-right') {
                const resizeByBottomRight = originHeight - cursorY;
                const resizeByTopRight = resizeByBottomRight * wRatio;
                if (cursorYInImage < 0) return;
                if (resizeByTopRight + cursorXDiff > imgWidth) return;
                if (resizeByBottomRight < CROPPER_LIMIT_SIZE || resizeByTopRight < CROPPER_LIMIT_SIZE) return;
                dispatch(
                  updatePositionByFrame({
                    name: selectedInfo.name,
                    x: cursorXDiff,
                    y: cursorYInImage,
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
                const resizeByTopLeft = resizeByBottomLeft * hRatio;

                if (resizeByBottomLeft > imgWidth && cursorXInImage < 0) return;
                if (cursorXInImage > imgWidth) return;
                if (resizeByTopLeft + cursorYDiff > imgHeight) return;
                if (resizeByTopLeft < CROPPER_LIMIT_SIZE || resizeByBottomLeft < CROPPER_LIMIT_SIZE) return;
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
                const resizeByBottomRight = resizeByTopRight * hRatio;
                if (cursorXInImage > imgWidth || cursorXInImage < 0) return;
                if (resizeByBottomRight + cursorYDiff > imgHeight) return;
                if (resizeByBottomRight < CROPPER_LIMIT_SIZE || resizeByTopRight < CROPPER_LIMIT_SIZE) return;
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
      originHeight,
      originWidth,
      cursorXDiff,
      cursorYDiff,
      imgHeight,
      imgWidth,
      dispatch,
      selectedInfo.name,
      topLeftXControl,
      ratio,
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
        const cropperLeft = (window.innerWidth - cropperWidth) / 2;
        const cropperTop = (window.innerHeight - cropperHeight) / 2;
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
    [isCalc, xDiff, yDiff, cropperWidth, cropperHeight, dispatch, selectFrameName],
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
        }),
      );
      dispatch(rotateSelectedFrameList({ type: +type, id: +id }));
      setIsCropperDrawing(true);
    },
    [dispatch, selectedInfo.name],
  );

  useEffect(() => {
    if (selectedInfo.bgColor) {
      createSaveCanvas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInfo.bgColor]);

  useEffect(() => {
    setRatio({ wRatio: originWidth / originHeight, hRatio: originHeight / originWidth });
  }, [originWidth, originHeight]);

  useEffect(() => {
    if (isCropperDrawing) {
      const img: HTMLImageElement = imgElements[selectFrameName];
      drawingCropper(img);
      createSaveCanvas();

      setIsCropperDrawing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCropperDrawing]);

  // 사이즈 확대/축소시 및 움직일때 크로퍼 반영
  useEffect(() => {
    const img: HTMLImageElement = imgElements[selectFrameName];

    drawingCropper(img);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resizeWidth, resizeHeight, selectedInfo.x, selectedInfo.y]);

  // 로드 true에 따라 이미지와 크로퍼 생성
  useEffect(() => {
    if (!isLoaded) return;
    const img: HTMLImageElement = imgElements[selectFrameName];

    const imgCanvas = imgCanvasRef.current;
    if (!imgCanvas) return;
    createImgCanvas(imgCanvas, img);
    drawingCropper(img);
    createSaveCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  useEffect(() => {
    if (!isMoving && !isResizeMode) return;
    const body = document.querySelector('main') as HTMLElement;
    const scrollPosition = window.scrollY;
    if (isIOS && isMobile) {
      const cropper = document.querySelector('.cropper') as HTMLElement;

      if (cropper) {
        cropper.style.pointerEvents = 'auto';
      }
      body.style.overflow = 'hidden';
      body.style.pointerEvents = 'none';
      body.style.position = 'fixed';
      body.style.top = `-${scrollPosition}px`;
      body.style.left = '0';
      body.style.right = '0';
    } else {
      if (!isMobile) return;
      disableBodyScroll(body);
    }

    return () => {
      if (isIOS && isMobile) {
        body.style.removeProperty('overflow');
        body.style.removeProperty('pointer-events');
        body.style.removeProperty('position');
        body.style.removeProperty('top');
        body.style.removeProperty('left');
        body.style.removeProperty('right');
        window.scrollTo(0, scrollPosition);
      } else {
        if (!isMobile) return;
        enableBodyScroll(body);
      }
    };
  }, [isMoving, isResizeMode]);

  useEffect(() => {
    dispatch(updatePositionByFrame({ name: selectFrameName, x: 0, y: 0 }));
    return () => {
      setIsLoaded(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      className="cropper"
      cmd={cmd}
      onTouchMove={isResizeMode ? handleResize : undefined}
      onTouchEnd={isResizeMode ? handleResizeEnd : undefined}
      onMouseUp={isResizeMode ? handleResizeEnd : undefined}
      onMouseMove={isResizeMode ? handleResize : undefined}
      onMouseLeave={isResizeMode ? handleResizeEnd : undefined}
    >
      <ThirdBgChanger>
        <Button type="default" onClick={handleRotate} data-type={selectedInfo.type} data-id={selectedInfo.id}>
          <img src={icons.rotate} />
        </Button>
        <Popover
          style={{ padding: 0 }}
          trigger="click"
          placement="bottom"
          content={<ToolColorPalette type="bg" onChange={handleColorChange} />}
        >
          <Button type="default">
            <img src={icons.bgPaint} />
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
          <ThirdContentCropperWrapper width={cropperWidth} height={cropperHeight} ref={cropperWrapperRef}>
            <ThirdContentCropper
              cmd={cmd}
              ref={cropperRef}
              data-url={selectedInfo.imgUrl || ''}
              onTouchStart={handleActiveCropper}
              onTouchEnd={handleCancelMoveCropper}
              onTouchMove={handleMovingCropper}
              onMouseMove={isMoving ? handleMovingCropper : undefined}
              onMouseDown={!isResizeMode ? handleActiveCropper : undefined}
              onMouseUp={isMoving ? handleCancelMoveCropper : undefined}
              onMouseLeave={isMoving ? handleCancelMoveCropper : undefined}
            />

            <div data-cmd="top-left" onMouseDown={handleResizeStart} onTouchStart={handleResizeStart} />
            <div data-cmd="top-right" onMouseDown={handleResizeStart} onTouchStart={handleResizeStart} />
            <div data-cmd="bottom-left" onMouseDown={handleResizeStart} onTouchStart={handleResizeStart} />
            <div data-cmd="bottom-right" onMouseDown={handleResizeStart} onTouchStart={handleResizeStart} />
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
