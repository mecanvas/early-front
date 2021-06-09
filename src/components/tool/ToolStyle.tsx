import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const ToolContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  overflow-x: hidden;
  position: relative;
`;

export const FactoryHeader = styled.div`
  display: flex;
  width: 100%;
  background-color: ${({ theme }) => theme.color.white};
  position: fixed;
  z-index: 33;
  top: 0px;
  flex-direction: column;
`;

export const FactoryUtills = styled.div`
  height: 64px;
  display: flex;
  justify-content: space-between;
  padding: 0 3em;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray300};
  h1 {
    margin: 0;
    padding: 0.4em;
    text-align: center;
  }

  & > div {
    display: flex;
    button {
      span {
        font-weight: 500;
        font-size: 15px;
      }
    }
    button + button {
      margin-left: 6px;
    }

    /* 저장 버튼 */
    button:nth-of-type(3) {
      background-color: ${({ theme }) => theme.color.secondary};
      color: ${({ theme }) => theme.color.white};
    }
  }
`;

export const FactoryTool = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray300};
  justify-content: center;

  & > div:nth-of-type(1) {
    display: flex;
    justify-content: center;
    align-items: center;
    button {
      small {
        margin-left: 3px;
        font-size: 12px;
        color: ${({ theme }) => theme.color.gray800};
      }
      svg {
        font-size: 16px;
        path {
          fill: ${({ theme }) => theme.color.secondarydark};
        }
      }
    }
  }
`;

export const FrameTool = styled.div`
  position: absolute;
  right: 0;
  display: flex;

  button {
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      font-size: 18px;
      path {
      }
    }

    small {
      margin-left: 3px;
      font-size: 12px;
      color: ${({ theme }) => theme.color.gray800};
    }
  }
`;

export const YouSelectedFrame = styled.div<{
  width: string;
  height: string;
  left: string;
  top: string;
  border?: string;
}>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  border: 1px solid ${({ border }) => border};
  position: absolute;
  cursor: pointer;
  z-index: 2;
`;

export const DropZone = styled.div`
  border: 1px solid #dbdbdb;
  width: 300px;
  height: 300px;
  margin: 0 auto;
  cursor: pointer;
`;

export const DropZoneDiv = styled.div<{ isDragActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  p {
    margin-top: 6px;
  }

  &:hover {
    opacity: 0.4;
  }

  ${({ isDragActive }) =>
    isDragActive
      ? css`
          opacity: 0.4;
        `
      : css`
          opacity: 1;
        `}

  *  > svg {
    font-size: 50px;
    path {
      color: ${({ theme }) => theme.color.primary};
    }
  }
`;

export const ImageWrapper = styled.div<{
  bgColor?: string;
  imgUploadLoading?: boolean;
  cmd?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null;
}>`
  background-color: ${({ bgColor }) => bgColor};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 115px 10px 50px 10px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  min-height: 100vh;

  ${({ imgUploadLoading }) =>
    imgUploadLoading &&
    css`
      opacity: 0.3;
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

  img {
    max-height: ${() => 'calc(100vh - 170px)'};
  }

  .cropped-img {
    position: absolute;
    z-index: 3;
    &:hover .cropped-img-delete {
      display: block;
    }
  }
  .cropped-img-delete {
    display: none;
    cursor: pointer;
    &::before {
      content: 'X';
      font-size: 5em;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
    }

    &.position {
      left: 0 !important;
    }
  }
`;

export const ImageShowingWidthHeight = styled.small`
  position: absolute;
  top: 110px;
  z-index: 33;
  padding: 8px;
  font-weight: bold;
  border: 1px solid ${({ theme }) => theme.color.primary};
  border-radius: 20px;
  background-color: ${({ theme }) => theme.color.secondarybg};
  color: ${({ theme }) => theme.color.primary};

  /* 사진 edit btn */
  span {
    position: absolute;
    cursor: pointer;
    right: -35px;
    top: 0;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    border: 1px solid ${({ theme }) => theme.color.primary};
    background-color: ${({ theme }) => theme.color.secondarybg};
    svg {
      font-size: 16px;

      path {
        fill: ${({ theme }) => theme.color.primary};
      }
    }
  }
`;

export const ImgControlelr = styled.div<{
  isResizeStart: boolean;
  cmd: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null;
}>`
  position: relative;
  border: ${({ theme, isResizeStart }) => isResizeStart && `2px solid ${theme.color.cyan}`};

  ${({ isResizeStart }) =>
    isResizeStart &&
    css`
      img {
        opacity: 0.4;
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

/* 클릭 시 resize mode on */
button {
    all: unset;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    cursor: pointer;
  }

  /* top-left */
  div:nth-of-type(1) {
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

  /* top-right */
  div:nth-of-type(2) {
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

  /* bottom-left */
  div:nth-of-type(3) {
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

  /* bottom-right */
  div:nth-of-type(4) {
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
`;

export const ColorPaletteWrapper = styled.div`
  display: flex;
  margin-bottom: 12px;
  width: 40px;
  position: relative;
  .chrome-picker {
    position: absolute;
    z-index: 2;
    right: 0;
  }
  .circle-picker {
    & > span > div {
      border: 1px solid #dbdbdb;
      border-radius: 50%;
    }
  }
`;

export const ColorPaletteFreeColor = styled.div`
  text-align: center;
  cursor: pointer;
  border-top: 1px solid #dbdbdb;
`;

export const FrameWrapper = styled.div`
  & > div {
    position: absolute;
    top: 115px;
    right: 5px;
    z-index: 30;
    text-align: center;
    border: 1px solid ${({ theme }) => theme.color.gray300};
    background-color: ${({ theme }) => theme.color.white};
    border-radius: 20px;
    padding: 1em;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    & > div {
      flex-direction: column;
      display: flex;
    }
  }

  /* 접는 아이콘 */
  span {
    z-index: 33;
    cursor: pointer;
    position: fixed;
    top: 118px;
    right: 20px;
    fill: ${({ theme }) => theme.color.secondarydark};
    padding: 3px 6px;
    border-radius: 20px;
    &:hover {
      background-color: ${({ theme }) => theme.color.gray300};
    }
  }

  small {
    font-size: 10px;
  }
`;

export const FrameSizeList = styled.div<{ width: string; height: string }>`
  width: ${({ width }) => `${+width.replace('px', '') / 5}px`};
  height: ${({ height }) => `${+height.replace('px', '') / 5}px`};
  z-index: 30;
  background-color: ${({ theme }) => theme.color.secondarybg};
  cursor: pointer;
  margin: 10px;
  position: relative;
`;

export const FrameSizeName = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex !important;
  font-size: 12px;
`;

export const CanvasInfomationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
`;

export const BillInfomation = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.color.white};
`;

export const Bill = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.3em;

  div {
    display: flex;
    justify-content: space-between;
    color: ${({ theme }) => theme.color.gray700};
  }

  /* 액자 이름 */
  & > div > div:nth-of-type(1) {
    font-weight: bold;
  }
`;

export const BillTotal = styled.div`
  width: 100%;
  padding-top: 0.3em;
  border-top: 1px solid ${({ theme }) => theme.color.gray300};
  text-align: right;
  font-weight: bold;
`;
