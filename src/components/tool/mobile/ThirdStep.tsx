import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppSelector } from 'src/hooks/useRedux';

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

const ThirdContentDrawingCanvas = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.color.gray500};
  /* background-color: ${({ theme }) => theme.color.white}; */
`;

const ThirdContentCropper = styled.div<{ width: number; height: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  transform: translate(-50%, -50%);
  cursor: move;

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

// TODO: 캔버스로 전환 예정 이미지 자를 수 있게.
const LikeCanvas = styled.div`
  width: 100%;
  background-color: #a5b0e6;
  filter: brightness(70%);

  img {
    width: 100%;
  }
`;

const ThirdPreviewCanvasWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6em;
  background-color: ${({ theme }) => theme.color.gray000};

  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    padding: 6em;
  }
`;

const ThirdPreviewCanvas = styled.div`
  width: 100%;
  filter: ${({ theme }) => theme.canvasShadowFilter};
  text-align: center;
`;

const ThirdStep = () => {
  const { selectedFrame } = useAppSelector(({ frame }) => frame);
  const [isLoaded, setIsLoaded] = useState(false);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [selectCanvas, setSelectCanvas] = useState(selectedFrame[0]?.name);

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

  const createImgCanvas = useCallback((img: HTMLImageElement, w: number, h: number) => {
    if (!previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    // const img = new Image();
    // img.src = imgUrl;
    // img.crossOrigin = 'Anonymous';
    const { naturalWidth, naturalHeight } = img;
    const scaleX = naturalWidth / w;
    const scaleY = naturalHeight / h;

    canvas.width = w;
    canvas.height = h;

    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, w, h);
  }, []);

  const handleSelected = useCallback((e) => {
    const { name } = e.currentTarget.dataset;
    setSelectCanvas(name);
  }, []);

  useEffect(() => {
    const choiceCanvas = selectedFrame.filter((lst) => lst.name === selectCanvas);
    const {
      name,
      size: { width, height },
    } = choiceCanvas[0];

    const img: HTMLImageElement = imgElements.get(name);
    if (isLoaded) {
      createImgCanvas(img, width, height);
    }

    img.onload = () => {
      createImgCanvas(img, width, height);
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
        <ThirdContentDrawingCanvas>
          <LikeCanvas>
            <img src={selectedInfo.imgUrl} />
          </LikeCanvas>
          <ThirdContentCropper {...selectedInfo.size}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </ThirdContentCropper>
        </ThirdContentDrawingCanvas>

        <ThirdPreviewCanvasWrapper>
          <ThirdPreviewCanvas>
            <canvas ref={previewCanvasRef} />
          </ThirdPreviewCanvas>
        </ThirdPreviewCanvasWrapper>
      </ThirdContent>
    </>
  );
};

export default ThirdStep;
