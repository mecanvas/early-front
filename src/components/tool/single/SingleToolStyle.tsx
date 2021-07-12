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
  button {
    padding: 5px 1em;
    height: 34px;
  }

  svg {
    margin-right: 4px;
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
  ${({ isPreview, theme }) =>
    isPreview
      ? css`
          width: 100%;
          min-height: calc(100vh - ${HEADER_HEIGHT}px);
          max-height: calc(100vh - ${HEADER_HEIGHT}px);
          display: flex;
          justify-content: center;
          align-items: center;
          canvas {
            display: block;
            background-color: ${theme.color.white};
            box-shadow: ${theme.canvasShadow};
          }
        `
      : css`
          canvas {
            display: none;
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
        border: 1px dashed ${theme.color.primary};
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
        border: 1px dashed ${theme.color.primary};
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
}>`
  position: absolute;
  background-color: ${({ bgColor }) => bgColor};
  ${({ width, height }) =>
    width &&
    height &&
    css`
      width: ${width}px;
      height: ${height}px;
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
    border-top: 4px dashed ${({ theme }) => theme.color.primary};
  }
  /* right */
  span:nth-of-type(2) {
    z-index: 15;
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    border-right: 4px dashed ${({ theme }) => theme.color.primary};
  }
  /* bottom */
  span:nth-of-type(3) {
    z-index: 15;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1px;
    border-bottom: 4px dashed ${({ theme }) => theme.color.primary};
  }
  /* left */
  span:nth-of-type(4) {
    z-index: 15;
    position: absolute;
    left: 0;
    top: 0;
    width: 1px;
    height: 100%;
    border-left: 4px dashed ${({ theme }) => theme.color.primary};
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
  flex-direction: column;
  right: 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray300};
  top: ${HEADER_HEIGHT - 35}px;

  button {
    padding: 5px 1em;
    height: 34px;
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
  border: 1px solid ${({ theme }) => theme.color.gray300};
  justify-content: center;
  align-items: center;
  padding: ${({ padding }) => padding};
  max-height: ${({ maxHeight }) => maxHeight};
  height: ${({ height }) => height};
  overflow: ${({ overflow }) => overflow};
  background-color: ${({ theme }) => theme.color.white};
  transition: all 500ms ease-in-out;
  div {
    flex: 1;
    text-align: center;
    small {
      font-size: 9px;
    }
  }
`;

export const SingleFrameList = styled.div<{ width: string; height: string }>`
  position: relative;
  cursor: pointer;
  margin: 0 auto;
  margin-top: 0.4em;
  width: ${({ width }) => `${replacePx(width) / 4}px`};
  height: ${({ height }) => `${replacePx(height) / 4}px`};
  border: 1px solid ${({ theme }) => theme.color.gray300};
`;

export const FrameListGridHideButton = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  cursor: pointer;
  padding: 0.4em 0;
  border: 1px solid ${({ theme }) => theme.color.gray100};
  width: 100%;
  margin-top: 0.2em;
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
`;
