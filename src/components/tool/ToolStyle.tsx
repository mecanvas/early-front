import styled from '@emotion/styled';
import { Card } from 'antd';

export const ToolContainer = styled.div<{ bgColor: string }>`
  width: 100%;
  margin: 0 auto;
  display: flex;
  background-color: ${({ bgColor }) => bgColor};
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

export const ImageWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  text-align: center;
  position: relative;
  height: calc(100vh - 50px);
  & > img {
    max-height: calc(100vh - 50px);
  }
  .cropped-img {
    position: absolute;
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

export const VersatileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 3;
  padding: 4px;
  position: absolute;
  top: 50px;
  right: 4px;
`;

export const Versatile = styled.div`
  border-radius: 4px;
  display: flex;
`;

export const Factory = styled.div`
  display: flex;
`;

export const FactoryTitle = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 3px;
  font-size: 14px;
  div {
    margin-left: auto;
  }
`;

export const ColorPaletteWrapper = styled.div`
  display: flex;
  margin-bottom: 12px;
  width: 40px;
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

export const FrameWrapper = styled(Card)`
  border: 1px solid #dbdbdb;
  margin-top: 6px;
  div {
    display: flex;
    cursor: pointer;
  }

  div + div {
    margin-left: 8px;
  }
`;

export const FrameSize = styled.div<{ width: string; height: string }>`
  width: ${({ width }) => `${+width.replace('px', '') / 5}px`};
  height: ${({ height }) => `${+height.replace('px', '') / 5}px`};
  border: 1px solid #333;
  position: relative;
`;

export const FrameSizeName = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const CanvasInfomationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  border-radius: 4px;
  button {
    width: 100%;
  }

  div {
    display: flex;
  }
`;

export const BillInfomation = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.color.white};
  padding: 6px 8px;
  border-bottom: 1px solid #dbdbdb;
  margin-top: 8px;
  border-radius: 4px;
`;
