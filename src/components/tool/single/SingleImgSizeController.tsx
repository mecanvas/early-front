import React, { RefObject, useCallback, useEffect, useState } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ResizeCmd } from 'src/interfaces/ToolInterface';
import { useGlobalState } from 'src/hooks';
import { filterOverMaxHeight } from 'src/utils/filterOverMaxHeight';

export const ImgController = styled.div<{
  cmd: ResizeCmd | null;
}>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${({ theme }) => theme.color.cyan};

  ${({ cmd }) => {
    if (!cmd) return;
    if (cmd === 'top-left' || cmd === 'bottom-right') {
      return css`
        cursor: nwse-resize;
      `;
    }
    if (cmd === 'right' || cmd === 'left') {
      return css`
        cursor: ew-resize;
      `;
    }
    if (cmd === 'bottom-center' || cmd === 'top-center') {
      return css`
        cursor: ns-resize;
      `;
    }
    return css`
      cursor: nesw-resize;
    `;
  }}
  /* 클릭 시 resize mode on */
/* button {
    all: unset;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    cursor: pointer;
    z-index: 11;
  } */
  /* top-left */
  div:nth-of-type(1) {
    z-index: 12;
    position: absolute;
    top: -4px;
    left: -4px;
    width: 12px;
    height: 12px;
    border-radius: 9999px;
    background: ${({ theme }) => theme.color.white};
    border: 1px solid ${({ theme }) => theme.color.blue};
    cursor: nwse-resize;
  }
  /* top-center */
  div:nth-of-type(2) {
    z-index: 12;
    position: absolute;
    top: -3px;
    transform: translateX(-50%);
    left: 50%;
    width: 20px;
    height: 5px;
    background: ${({ theme }) => theme.color.white};
    border: 1px solid ${({ theme }) => theme.color.blue};
    cursor: ns-resize;
  }
  /* top-right */
  div:nth-of-type(3) {
    z-index: 12;
    position: absolute;
    top: -4px;
    right: -4px;
    width: 12px;
    height: 12px;
    border-radius: 9999px;
    background: ${({ theme }) => theme.color.white};
    border: 1px solid ${({ theme }) => theme.color.blue};
    cursor: nesw-resize;
  }
  /* right */
  div:nth-of-type(4) {
    z-index: 12;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: -3px;
    width: 5px;
    height: 20px;
    background: ${({ theme }) => theme.color.white};
    border: 1px solid ${({ theme }) => theme.color.blue};
    cursor: ew-resize;
  }
  /* bottom-left */
  div:nth-of-type(5) {
    z-index: 12;
    position: absolute;
    bottom: -4px;
    left: -4px;
    width: 12px;
    height: 12px;
    border-radius: 9999px;
    background: ${({ theme }) => theme.color.white};
    border: 1px solid ${({ theme }) => theme.color.blue};
    cursor: nesw-resize;
  }
  /* bottom-center */
  div:nth-of-type(6) {
    z-index: 12;
    position: absolute;
    bottom: -3px;
    transform: translateX(-50%);
    left: 50%;
    width: 20px;
    height: 5px;
    background: ${({ theme }) => theme.color.white};
    border: 1px solid ${({ theme }) => theme.color.blue};
    cursor: ns-resize;
  }
  /* bottom-right */
  div:nth-of-type(7) {
    z-index: 12;
    position: absolute;
    bottom: -4px;
    right: -4px;
    width: 12px;
    height: 12px;
    border-radius: 9999px;
    background: ${({ theme }) => theme.color.white};
    border: 1px solid ${({ theme }) => theme.color.blue};
    cursor: nwse-resize;
  }
  /* left */
  div:nth-of-type(8) {
    z-index: 12;
    position: absolute;
    bottom: 50%;
    transform: translateY(50%);
    width: 5px;
    height: 20px;
    left: -3px;
    background: ${({ theme }) => theme.color.white};
    border: 1px solid ${({ theme }) => theme.color.blue};
    cursor: ew-resize;
  }
`;

interface Props {
  children: React.ReactChild;
  imgRef: RefObject<HTMLCanvasElement>;
  wrapperRef: RefObject<any>;
  isMovingImage: boolean;
  controllerRef: (node: any) => any;
}

const SingleImgSizeController = ({ children, controllerRef, imgRef, wrapperRef, isMovingImage }: Props) => {
  const [, setIsResizeMode] = useGlobalState('isResizeMode', false);
  const [isResizeStart, setIsResizeStart] = useState(false);
  const [resizeCmd, setResizeCmd] = useGlobalState<ResizeCmd | null>('resizeCmd', null);

  const [, setResizeWidth] = useGlobalState('resizeWidth', 0);
  const [, setResizeHeight] = useGlobalState('resizeHeight', 0);

  const positioningImageResize = useCallback(
    (resizeCmd: ResizeCmd | null, x: number, y: number) => {
      if (!imgRef || !imgRef.current) return;

      const { width, height, left, top, right } = imgRef.current.getBoundingClientRect();
      const absX = Math.abs(x - Math.ceil(left));
      const absY = Math.abs(height + Math.ceil(top - y));
      const absLeftX = Math.abs(x - Math.ceil(right));
      const absBottomY = Math.abs(y + height - (top + height));

      let newWidth = width;
      let newHeight = height;

      const getNewHeight = (x: number) => {
        return (x * height) / width;
      };

      switch (resizeCmd) {
        case 'bottom-right':
          newHeight = getNewHeight(absX);
          newWidth = absX;
          break;
        case 'top-right':
          newHeight = getNewHeight(absX);
          newWidth = absX;
          break;
        case 'bottom-left':
          newHeight = getNewHeight(absLeftX);
          newWidth = absLeftX;
          break;
        case 'top-left':
          newHeight = getNewHeight(absLeftX);
          newWidth = absLeftX;
          break;
        case 'bottom-center':
          newHeight = absBottomY;
          break;
        case 'top-center':
          newHeight = absY;
          break;
        case 'right':
          newWidth = absX;
          break;
        case 'left':
          newWidth = absLeftX;
          break;
        default:
          break;
      }

      const { url } = imgRef.current.dataset;
      const imgCtx = imgRef.current.getContext('2d');
      if (imgCtx && url) {
        const img = new Image();
        img.src = url;
        setResizeWidth(newWidth);
        setResizeHeight(filterOverMaxHeight(newHeight));
        img.onload = () => {
          if (!imgRef.current) return;
          imgCtx.clearRect(0, 0, imgRef.current.width, imgRef.current.height);
          imgRef.current.width = newWidth;
          imgRef.current.height = filterOverMaxHeight(newHeight);
          imgCtx.imageSmoothingQuality = 'high';
          imgCtx.drawImage(img, 0, 0, newWidth, filterOverMaxHeight(newHeight));
        };
      }

      requestAnimationFrame(() => positioningImageResize);
    },
    [imgRef, setResizeHeight, setResizeWidth],
  );

  const handleImgResize = useCallback(
    (e) => {
      if (!isResizeStart) return;
      if (imgRef.current) {
        e.preventDefault();
        const { clientY, clientX } = e.type !== 'touchmove' ? e : e.changedTouches[0];
        if (clientY && clientX && resizeCmd) {
          positioningImageResize(resizeCmd, clientX, clientY);
        }
      }
    },
    [isResizeStart, positioningImageResize, resizeCmd, imgRef],
  );

  // const handleResizeModeStart = useCallback((e) => {
  //   setIsResizeMode((prev) => !prev);
  // }, []);

  const handleImgResizeStart = useCallback(
    (e) => {
      const { cmd } = e.currentTarget.dataset;
      setIsResizeStart(true);
      setResizeCmd(cmd);
      setIsResizeMode(true);
    },
    [setIsResizeMode, setResizeCmd],
  );

  const handleImgResizeEnd = useCallback(() => {
    setIsResizeStart(false);
    setResizeCmd(null);
    setIsResizeMode(false);
  }, [setIsResizeMode, setResizeCmd]);

  useEffect(() => {
    if (!imgRef || !imgRef.current) return;

    imgRef.current.ontouchend = handleImgResizeEnd;
    imgRef.current.onmouseup = handleImgResizeEnd;
  }, [handleImgResizeEnd, imgRef]);

  useEffect(() => {
    if (!wrapperRef || !wrapperRef.current || !imgRef.current) return;

    wrapperRef.current.ontouchmove = handleImgResize;
    wrapperRef.current.ontouchend = handleImgResizeEnd;
    wrapperRef.current.onmousemove = handleImgResize;
    wrapperRef.current.onmouseup = handleImgResizeEnd;
  }, [handleImgResize, handleImgResizeEnd, imgRef, wrapperRef]);

  return (
    <ImgController cmd={resizeCmd ?? null} ref={controllerRef}>
      {children}
      {isMovingImage ? null : (
        <>
          <div data-cmd="top-left" onTouchStart={handleImgResizeStart} onMouseDown={handleImgResizeStart}></div>
          <div data-cmd="top-center" onTouchStart={handleImgResizeStart} onMouseDown={handleImgResizeStart}></div>
          <div data-cmd="top-right" onTouchStart={handleImgResizeStart} onMouseDown={handleImgResizeStart}></div>

          <div data-cmd="right" onTouchStart={handleImgResizeStart} onMouseDown={handleImgResizeStart}></div>

          <div data-cmd="bottom-left" onTouchStart={handleImgResizeStart} onMouseDown={handleImgResizeStart}></div>
          <div data-cmd="bottom-center" onTouchStart={handleImgResizeStart} onMouseDown={handleImgResizeStart}></div>
          <div data-cmd="bottom-right" onTouchStart={handleImgResizeStart} onMouseDown={handleImgResizeStart}></div>

          <div data-cmd="left" onTouchStart={handleImgResizeStart} onMouseDown={handleImgResizeStart}></div>
        </>
      )}
    </ImgController>
  );
};

export default SingleImgSizeController;
