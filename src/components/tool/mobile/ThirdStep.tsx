import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppSelector } from 'src/hooks/useRedux';
import { theme } from 'src/style/theme';
import { getOriginRatio } from 'src/utils/getOriginRatio';

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

  /* top */
  span:nth-of-type(1) {
    z-index: 15;
    position: absolute;
    top: 0;
    width: 100%;
    height: 1px;
    border-top: 2px dashed ${({ theme }) => theme.color.primary};
  }
  /* right */
  span:nth-of-type(2) {
    z-index: 15;
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    border-right: 2px dashed ${({ theme }) => theme.color.primary};
  }
  /* bottom */
  span:nth-of-type(3) {
    z-index: 15;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1px;
    border-bottom: 2px dashed ${({ theme }) => theme.color.primary};
  }
  /* left */
  span:nth-of-type(4) {
    z-index: 15;
    position: absolute;
    left: 0;
    top: 0;
    width: 1px;
    height: 100%;
    border-left: 2px dashed ${({ theme }) => theme.color.primary};
  }
`;

const ThirdContentCropper = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  cursor: move;
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
  const IMAGE_MAXIMUM_WIDTH = 304;
  const IMAGE_MAXIMUM_HEIGHT = 304;

  const { selectedFrame } = useAppSelector(({ frame }) => frame);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgCanvasRef = useRef<HTMLCanvasElement>(null);
  const cropperRef = useRef<HTMLCanvasElement>(null);
  const cropperWrapperRef = useRef<HTMLDivElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [selectCanvas, setSelectCanvas] = useState(selectedFrame[0]?.name);

  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);

  const [bgColor] = useState(theme.color.white);

  const selectedInfo = useMemo(() => {
    const selectedCanvas = selectedFrame.filter((lst) => lst.name === selectCanvas)[0];
    return selectedCanvas;
  }, [selectCanvas, selectedFrame]);

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
      const left = (window.innerWidth - imgW) / 2;
      const top = (window.innerHeight - imgH) / 2;
      const cropperLeft = (window.innerWidth - w) / 2;
      const cropperTop = (window.innerHeight - h) / 2;

      const cropX = cropperLeft - left;
      const cropY = cropperTop - top;
      const scaleX = naturalWidth / imgW;
      const scaleY = naturalHeight / imgH;

      setCanvasWidth(w);
      setCanvasHeight(h);

      canvas.width = w;
      canvas.height = h;

      cropperWrapper.style.top = `${cropY}px`;
      cropperWrapper.style.left = `${cropX}px`;

      ctx.clearRect(0, 0, imgW, imgH);
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, cropX * scaleX, cropY * scaleY, imgW * scaleX, imgH * scaleY, 0, 0, imgW, imgH);

      // 프리뷰 드로잉
      if (preview) {
        const previewCanvas = previewCanvasRef.current;
        if (previewCanvas) {
          const pCtx = previewCanvas.getContext('2d');
          previewCanvas.width = w;
          previewCanvas.height = h;
          if (!pCtx) return;
          pCtx.clearRect(0, 0, imgW, imgH);
          pCtx.imageSmoothingQuality = 'high';
          pCtx.drawImage(img, cropX * scaleX, cropY * scaleY, imgW * scaleX, imgH * scaleY, 0, 0, imgW, imgH);

          pCtx.globalCompositeOperation = 'destination-over';
          pCtx.fillStyle = bgColor;
          pCtx.fillRect(0, 0, imgW, imgH);
        }
      }
    },
    [bgColor, selectedInfo],
  );

  const drawingPreview = useCallback(
    (name: string) => {
      const img: HTMLImageElement = imgElements.get(name);
      const canvas = previewCanvasRef.current;
      if (canvas) {
        createCropperCanvas(canvas, img, true);
      }
    },
    [createCropperCanvas, imgElements],
  );

  const drawingCropper = useCallback(
    (name: string) => {
      const img: HTMLImageElement = imgElements.get(name);
      const canvas = cropperRef.current;
      if (canvas) {
        createCropperCanvas(canvas, img);
      }
    },
    [createCropperCanvas, imgElements],
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

  const handleSelected = useCallback((e) => {
    const { name } = e.currentTarget.dataset;
    setSelectCanvas(name);
  }, []);

  const handleActiveCropper = useCallback(() => {
    drawingCropper(selectedInfo.name);
  }, [selectedInfo.name, drawingCropper]);
  const handleCancelMoveCropper = useCallback(() => {}, []);

  useEffect(() => {
    const { name } = selectedInfo;
    const img: HTMLImageElement = imgElements.get(name);
    const imgCanvas = imgCanvasRef.current;

    if (isLoaded) {
      if (imgCanvas) {
        createImgCanvas(imgCanvas, img);
        drawingCropper(name);
        drawingPreview(name);
      }
    }

    img.onload = () => {
      if (imgCanvas) {
        createImgCanvas(imgCanvas, img);
        drawingCropper(name);
        drawingPreview(name);
      }
      setIsLoaded(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectCanvas, imgElements, isLoaded]);

  return (
    <>
      <ThirdItemList>
        {selectedFrame.map((lst) => (
          <div>
            <ThirdItem
              type={lst.type}
              selected={lst.name === selectCanvas}
              onClick={handleSelected}
              data-name={lst.name}
            >
              <img src={lst.imgUrl} />
            </ThirdItem>
          </div>
        ))}
      </ThirdItemList>
      <ThirdContent>
        <ThirdContentDrawingCanvas width={imgWidth} height={imgHeight}>
          <canvas ref={imgCanvasRef} />

          <ThirdContentCropperWrapper width={canvasWidth} height={canvasHeight} ref={cropperWrapperRef}>
            <ThirdContentCropper
              ref={cropperRef}
              onMouseDown={handleActiveCropper}
              onMouseUp={handleCancelMoveCropper}
            />
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
    </>
  );
};

export default ThirdStep;
