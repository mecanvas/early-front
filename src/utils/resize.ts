import { RefObject } from 'react';
import { ResizeCmd } from 'src/interfaces/ToolInterface';

export const positioningImageResize = (
  wrapperRef: RefObject<HTMLDivElement>,
  resizeCmd: ResizeCmd | null,
  x: number,
  y: number,
) => {
  if (!wrapperRef || !wrapperRef.current) return;

  const { width, height, left, top, right } = wrapperRef.current.getBoundingClientRect();
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
    case 'top-right':
      newHeight = getNewHeight(absX);
      newWidth = absX;
      break;
    case 'bottom-right':
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

  return {
    newWidth,
    newHeight,
  };
};
