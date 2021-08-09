import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { HEADER_HEIGHT } from 'src/constants';
import { ResizeCmd } from 'src/interfaces/ToolInterface';
import { replacePx } from 'src/utils/replacePx';

export const SingleToolContainer = styled.div`
  background-color: ${({ theme }) => theme.color.gray200};
`;

export const SingleToolFactory = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray200};
  background-color: ${({ theme }) => theme.color.white};
  padding: 3px 0;
  button {
    display: flex;
    align-items: center;
    padding: 3px 1em;
    height: 34px;
  }
  img {
    width: 20px;
  }

  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    button {
      padding: 0 0.8em;
    }
  }
`;

export const SingleCanvasField = styled.div<{ isPreview: boolean }>`
  min-height: calc(100vh - ${HEADER_HEIGHT}px);
  max-height: calc(100vh - ${HEADER_HEIGHT}px);
  max-width: 1000px;
  width: 100%;
  background-color: ${({ theme }) => theme.color.gray100};
  margin: 0 auto;
  ${({ isPreview }) =>
    isPreview
      ? css`
          position: absolute;
          top: 0;
          visibility: hidden;
          & > * {
            position: absolute;
            visibility: hidden;
          }
        `
      : css`
          display: flex;
          justify-content: center;
          align-items: center;
        `}
`;

export const PreviewCanvasWrapper = styled.div<{ isPreview: boolean }>`
  width: 100%;
  min-height: calc(100vh - ${HEADER_HEIGHT}px);
  max-height: calc(100vh - ${HEADER_HEIGHT}px);
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: ${({ theme }) => theme.color.gray100};

  canvas {
    display: block;
    background-color: ${({ theme }) => theme.color.white};
    filter: ${({ theme }) => theme.canvasShadowFilter};
    filter: none; /* IE 6-9 */
    -webkit-filter: ${({ theme }) => theme.canvasShadowFilter};
  }
  ${({ isPreview }) =>
    isPreview
      ? css`
          z-index: 0;
        `
      : css`
          z-index: -1;
          position: absolute;
          canvas {
            /* display: none; */
          }
        `}
`;

export const SingleWrapper = styled.div<{
  clicked: boolean;
  cmd: ResizeCmd | null;
  nearingCenterX: boolean;
  nearingCenterY: boolean;
}>`
  width: 100%;
  min-height: calc(100vh - ${HEADER_HEIGHT}px);
  max-height: calc(100vh - ${HEADER_HEIGHT}px);
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ clicked }) =>
    clicked
      ? css`
          cursor: pointer;
        `
      : css`
          cursor: default;
        `}

  ${({ nearingCenterX, theme }) =>
    nearingCenterX &&
    css`
      &:before {
        position: absolute;
        width: 2px;
        top: 0;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        height: 100%;
        content: '';
        border: 1px solid ${theme.color.primary};
        z-index: 33;
      }
    `}

  ${({ nearingCenterY, theme }) =>
    nearingCenterY &&
    css`
      &:after {
        position: absolute;
        width: 100%;
        top: (50% - ${HEADER_HEIGHT}px);
        transform: translateY(-50%);
        left: 0;
        height: 2px;
        content: '';
        z-index: 33;
        border: 1px solid ${theme.color.primary};
      }
    `}

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

export const SingleSelectedFrame = styled.div<{
  bgColor: string;
  isImgUploadUrl: boolean;
  width: number;
  height: number;
  rotate: boolean;
}>`
  position: absolute;
  background-color: ${({ bgColor }) => bgColor};
  ${({ width, height, rotate }) =>
    width && height && !rotate
      ? css`
          width: ${width}px;
          height: ${height}px;
        `
      : css`
          width: ${height}px;
          height: ${width}px;
        `}
  ${({ isImgUploadUrl }) =>
    isImgUploadUrl ||
    css`
      cursor: default !important;
    `}

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

export const SingleImageWrapper = styled.div<{ clicked: boolean }>`
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(98vh - ${HEADER_HEIGHT}px);

  canvas {
    max-height: calc(98vh - ${HEADER_HEIGHT}px);
    cursor: pointer;
    ${({ clicked }) =>
      clicked
        ? css`
            opacity: 0.5;
          `
        : css`
            opacity: 1;
          `};
  }
`;

export const SingleFrameListHeader = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  flex-direction: column;
  right: 2px;
  z-index: 1;
  @media all and (min-width: ${({ theme }) => theme.size.sm}) {
    top: ${HEADER_HEIGHT - 38}px;
  }

  button {
    padding: 5px 1.5em;
    height: 34px;
    font-size: 12px;
  }

  div:nth-of-type(1) {
    padding: 2px 0;

    & > button {
      border-top: none;
      border-bottom: none;
      button ~ button {
        border-right: none;
      }
    }
  }

  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    flex-direction: column-reverse;
    background-color: ${({ theme }) => theme.color.white};
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    text-align: center;
    bottom: 0px;
  }
`;

export const SingleFrameListGrid = styled.div<{
  maxHeight: string;
  height: string;
  overflow: string;
  padding: string;
}>`
  /* 스크롤 제거 */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: ${({ padding }) => padding};
  max-height: ${({ maxHeight }) => maxHeight};
  height: ${({ height }) => height};
  overflow: ${({ overflow }) => overflow};
  background-color: ${({ theme }) => theme.color.white};
  transition: all 500ms ease-in-out;
  border: 1px solid ${({ theme }) => theme.color.gray100};
  div {
    flex: 1;
    text-align: center;
    padding: 0 0.3em;
    small {
      font-size: 9px;
    }
  }

  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    max-height: ${({ maxHeight }) => `${replacePx(maxHeight) - 50}px`};
    height: ${({ height }) => `${replacePx(height) - 50}px`};
  }
`;

export const SingleFrameList = styled.div<{ rotate: boolean; width: string; height: string; clicked: boolean }>`
  position: relative;
  cursor: pointer;
  margin: 0 auto;
  margin-top: 0.4em;
  ${({ rotate, width, height }) =>
    rotate
      ? css`
          width: ${replacePx(height) / 4}px;
          height: ${replacePx(width) / 4}px;
        `
      : css`
          width: ${replacePx(width) / 4}px;
          height: ${replacePx(height) / 4}px;
        `}

  border: 1px solid ${({ theme, clicked }) => (clicked ? theme.color.primary : theme.color.gray300)};

  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    width: ${({ width }) => `${replacePx(width) / 6}px`};
    height: ${({ height }) => `${replacePx(height) / 6}px`};
  }
`;

export const FrameListGridHideButton = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  cursor: pointer;
  padding: 0.4em 0;
  border: 1px solid ${({ theme }) => theme.color.gray100};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  small {
    margin-left: 3px;
    margin-bottom: 1px;
  }
  svg {
    margin-top: 1px;
    font-size: 16px;
  }

  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    width: 20px;
    height: 20px;
    position: absolute;
    bottom: 8px;
    left: 10px;
    border: none;

    small {
      display: none;
    }
  }
`;
