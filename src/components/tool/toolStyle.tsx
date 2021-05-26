import styled from '@emotion/styled';

export const ToolContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
`;

export const ImageGoBack = styled.button`
  position: absolute;
  top: 55px;
  left: 12px;
  z-index: 4;
`;

export const YouSelectedFrame = styled.div<{ width: string; height: string; left: string; top: string }>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  border: 1px solid #333;
  position: absolute;
  cursor: pointer;
  z-index: 2;
`;

export const ImageWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: calc(100vh - 50px);
  img {
    max-height: calc(100vh - 50px);
  }
  .cropped-img {
    position: absolute;
    border: 1px inset #333;

    &.position {
      left: 0 !important;
    }
  }
`;

export const VersatileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 3;
  background: #fff;
`;

export const Versatile = styled.div`
  width: 275px;
  border: 1px solid #dbdbdb;
  margin-right: 8px;
`;

export const Factory = styled.div`
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
`;

export const FactoryTitle = styled.div`
  width: 100%;
  display: flex;
  padding: 0 4px;
  margin-bottom: 3px;
  font-size: 18px;
  div {
    margin-left: auto;
  }
`;

export const ImageToolWrapper = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

export const ImageToolBtn = styled.button`
  padding: 8px 12px;
  border-radius: 6px;
  background-color: aliceblue;
`;

export const ColorPaletteWrapper = styled.div`
  display: flex;
  margin-bottom: 12px;

  div + div {
    margin-left: 8px;
    cursor: pointer;
  }
`;

export const ColorPalette = styled.div<{ color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ color }) => {
    return color || 'antiquewhite';
  }};
`;

export const FrameWrapper = styled.div`
  display: flex;
  margin-bottom: 12px;

  div {
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

export const BillInfomation = styled.div`
  display: flex;
  padding: 6px 8px;
  border-bottom: 1px solid #dbdbdb;
  margin-top: 8px;
`;
