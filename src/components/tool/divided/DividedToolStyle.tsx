import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { HEADER_HEIGHT } from 'src/constants';
import { ResizeCmd } from 'src/interfaces/ToolInterface';
import { replacePx } from 'src/utils/replacePx';

export const ToolContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  overflow-x: hidden;
  position: relative;
`;

export const ToolHeaderWrapper = styled.div`
  display: flex;
  width: 100%;
  background-color: ${({ theme }) => theme.color.white};
  position: fixed;
  z-index: 340;
  top: 0px;
  flex-direction: column;
`;

export const ToolHeaderMenu = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  height: 45px;
  display: flex;
  justify-content: space-between;
  padding: 0 2em;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray200};
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    border-bottom: none;
    height: 40px;
    padding: 0 0.5em;
  }

  & > div {
    display: flex;
    align-items: center;
    button {
      padding: 0.4em 1em;
      height: 33px;
      span {
        font-weight: 500;
        font-size: 13px;
      }
    }
    button + button {
      margin-left: 6px;
    }

    /* 미리보기/이미지 버튼 */
    button:nth-of-type(2) {
      @media all and (max-width: ${({ theme }) => theme.size.sm}) {
        padding: 0em 0.6em;
        span {
          font-size: 12px;
          line-height: 30px;
        }
      }
    }
    /* 저장 버튼 */
    button:nth-of-type(3) {
      background-color: ${({ theme }) => theme.color.secondary};
      color: ${({ theme }) => theme.color.white};
      @media all and (max-width: ${({ theme }) => theme.size.sm}) {
        padding: 0em 0.6em;
        height: 30px;
        span {
          line-height: 30px;
          font-size: 14px;
        }
      }
    }
  }
`;

export const ToolSinglePrice = styled.div`
  border-left: 1px solid ${({ theme }) => theme.color.gray200};
  padding-left: 20px;
  margin-left: 20px;
  span {
    margin-right: -9px;
  }

  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    padding-left: 10px;
    margin-left: 10px;
    span {
      font-size: 12px;
    }
    button {
      span {
        font-size: 12px !important;
      }
    }
  }
`;

export const FactoryTool = styled.div`
  display: flex;
  align-items: center;
  padding: 3px 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray300};
  justify-content: center;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    justify-content: space-around;
  }
  & > div:nth-of-type(1) {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 20px;
    }
    button {
      display: flex;
      align-items: center;
      padding: 3px 1em;
      height: 34px;
    }
  }
`;

export const FrameTool = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  display: flex;
  button {
    display: flex;
    border-top: none;
    border-bottom: none;
    button ~ button {
      border-right: none;
    }
    justify-content: center;
    align-items: center;
    padding: 5px 1.5em;
    height: 34px;
    font-size: 12px;
  }

  @media all and (max-width: ${({ theme }) => theme.size.md}) {
    bottom: 0;
    position: fixed;
    width: 100%;
    justify-content: center;
    padding: 0.3em 0;
    border-top: 1px solid ${({ theme }) => theme.color.gray400};
    background-color: ${({ theme }) => theme.color.white};
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
`;

export const SelectedFrameWrapper = styled.div<{
  isNearingX: boolean;
  isNearingY: boolean;
  isFitX: boolean;
  isFitY: boolean;
}>`
  width: 100%;
  height: 100vh;
  min-height: -webkit-fill-available;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  padding: ${HEADER_HEIGHT}px 10px 50px 10px;
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 34;
  }
  ${({ isNearingX, isFitX, theme }) =>
    isNearingX &&
    css`
      &:before {
        position: absolute;
        width: 2px;
        top: 0;
        height: 100%;
        content: '';
        border: 1px ${isFitX ? 'solid' : 'dashed'} ${theme.color.primary};
        z-index: 35;
      }
    `}
  ${({ isNearingY, isFitY, theme }) =>
    isNearingY &&
    css`
      &:after {
        position: absolute;
        width: 100%;
        left: 0;
        top: calc(50% + 43px);
        transform: translateY(-50%);
        height: 2px;
        content: '';
        z-index: 35;
        border: 1px ${isFitY ? 'solid' : 'dashed'} ${theme.color.primary};
      }
    `}
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

export const ImageWrapper = styled.div<{
  bgColor?: string;
  imgUploadLoading?: boolean;
  cmd?: ResizeCmd | null;
  isPreview?: boolean;
}>`
  background-color: ${({ bgColor, isPreview, theme }) => (isPreview ? theme.color.white : bgColor)};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${HEADER_HEIGHT}px 10px 10px 10px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  min-height: 100vh;
  max-height: -webkit-fill-available;
  @media all and (max-width: ${({ theme }) => theme.size.md}) {
    flex-direction: row;
    padding: ${HEADER_HEIGHT} 10px 10px 10px;
  }

  ${({ imgUploadLoading }) =>
    imgUploadLoading &&
    css`
      opacity: 0.2;
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
    @media all and (max-width: ${({ theme }) => theme.size.sm}) {
      max-width: 96vw;
    }
    max-height: ${() => 'calc(100vh - 170px)'};
  }
  .cropped-img {
    position: absolute;
    z-index: 1;
    filter: ${({ theme }) => theme.canvasShadowFilter};
    filter: none; /* IE 6-9 */
    -webkit-filter: ${({ theme }) => theme.canvasShadowFilter};
    ${({ isPreview }) =>
      isPreview &&
      css`
        img {
          box-shadow: none !important;
        }
      `};

    &:hover .cropped-img-delete {
      ${({ isPreview }) =>
        isPreview
          ? css`
              display: none;
            `
          : css`
              display: block;
            `}
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

export const PreviewBg = styled.div<{ isPreviewBgRemove?: boolean }>`
  position: absolute;
  button {
    left: 0;
    top: -35px;
    position: absolute;
    width: 70px;
    height: 25px;
    span {
      font-size: 14px;
    }
    div {
      margin-top: 1.5px;
    }
  }
  top: calc(50% + ${HEADER_HEIGHT / 2}px);
  transform: translateY(-50%);
  min-width: ${({ theme }) => theme.size.md};
  img {
    min-height: 626px;
    object-fit: contain;
    ${({ isPreviewBgRemove }) =>
      isPreviewBgRemove
        ? css`
            visibility: hidden;
          `
        : css`
            visibility: visible;
          `}
  }
`;

export const CroppedWrapper = styled.div<{
  isPreview: boolean;
  top?: number;
  left?: number;
  isPreviewBgRemove?: boolean;
}>`
  ${({ isPreview, top, left, isPreviewBgRemove, theme }) =>
    isPreview &&
    left &&
    top &&
    !isPreviewBgRemove &&
    css`
      position: absolute;
      top: ${top}px;
      left: ${left}px;
      /* transform: scale(0.3); */
      div {
        filter: ${theme.canvasShadowFilter};
      }
    `}
`;

export const ImgController = styled.div<{
  isResizeStart: boolean;
  isPreview: boolean;
  cmd: ResizeCmd | null;
}>`
  ${({ isPreview, theme }) =>
    isPreview
      ? css`
          pointer-events: none;
        `
      : css`
          filter: ${theme.canvasShadowFilter};
        `}

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
  /* top-center */
  div:nth-of-type(2) {
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
      border: 1px solid ${({ theme }) => theme.color.gray200};

      border-radius: 50%;
    }
  }
`;

export const ColorPaletteFreeColor = styled.div`
  text-align: center;
  cursor: pointer;
  border-top: 1px solid ${({ theme }) => theme.color.gray200};
`;

export const FrameWrapper = styled.div`
  position: absolute;
  top: ${HEADER_HEIGHT}px;
  right: 5px;
  z-index: 340;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    width: 100%;
    top: ${HEADER_HEIGHT};
  }
  & > div {
    border-radius: 20px;
    border: 1px solid ${({ theme }) => theme.color.gray300};
    background-color: ${({ theme }) => theme.color.white};
    text-align: center;
    padding: 1em;
    padding-top: 1.5em;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    @media all and (max-width: ${({ theme }) => theme.size.sm}) {
      flex-direction: row;
      justify-content: space-evenly;
      align-items: center;
      padding: 0.2em;
      div {
        margin: 0 auto;
        line-height: 14px;
      }
    }
    & > div {
      flex-direction: column;
      display: flex;
    }
  }
  /* 접는 아이콘 */
  & > span {
    z-index: 33;
    cursor: pointer;
    position: fixed;
    top: ${HEADER_HEIGHT + 3}px;
    right: 20px;
    fill: ${({ theme }) => theme.color.secondarydark};
    padding: 3px 6px;
    border-radius: 20px;
    @media all and (max-width: ${({ theme }) => theme.size.sm}) {
      top: ${HEADER_HEIGHT + 10}px;
      padding: 1.5px 3px;
    }
    &:hover {
      background-color: ${({ theme }) => theme.color.gray300};
    }
  }
  small {
    font-size: 8px;
  }
  /* 가로/세로 체인지 버튼 */
  button {
    width: 80px;
    height: 30px;
    font-size: 14px;
    padding: 0;
    margin-top: 0.7em;
    @media all and (max-width: ${({ theme }) => theme.size.sm}) {
      padding: 1.5px 3px;
      position: absolute;
      right: 14px;
      width: fit-content;
    }
    svg {
      font-size: 12px;
      path {
        fill: ${({ theme }) => theme.color.secondary};
      }
    }
  }
`;

export const FrameSizeList = styled.div<{ width: string; height: string; clicked: boolean }>`
  width: ${({ width }) => `${replacePx(width) / 5}px`};
  height: ${({ height }) => `${replacePx(height) / 5}px`};
  z-index: 30;
  border: 1px solid ${({ theme, clicked }) => (clicked ? theme.color.primary : theme.color.gray200)};
  cursor: pointer;
  margin: 10px auto 5px auto;
  position: relative;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    margin: 5px 2.5px;
  }
`;

export const FrameSizeName = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex !important;
  font-size: 12px;
  width: 100%;
  justify-content: center;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    font-size: 9px;
  }
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
  font-size: 14px;
  div {
    display: flex;
    justify-content: space-between;
    color: ${({ theme }) => theme.color.gray700};
  }
`;

export const BillTotal = styled.div`
  width: 100%;
  padding-top: 0.3em;
  border-top: 1px solid ${({ theme }) => theme.color.gray300};
  text-align: right;
  font-weight: 500;
  font-size: 14px;
`;
