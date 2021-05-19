import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useGetCursorPosition } from '../hooks';

const ToolContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
`;

const YouSelectedFrame = styled.div<{ width: string; height: string; left: string; top: string }>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  border: 1px solid #333;
  position: absolute;
  cursor: pointer;
  z-index: 2;
`;

const ImageWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const FakeCanvas = styled.canvas`
  position: absolute;
  z-index: 1;
`;

const VersatileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 3;
  background: #fff;
`;

const Versatile = styled.div`
  width: 275px;
  border: 1px solid #dbdbdb;
  margin-right: 8px;
`;

const Factory = styled.div`
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
`;

const FactoryTitle = styled.div`
  width: 100%;
  display: flex;
  padding: 0 4px;
  margin-bottom: 3px;
  font-size: 18px;
  div {
    margin-left: auto;
  }
`;

const ColorPaletteWrapper = styled.div`
  display: flex;
  margin-bottom: 12px;

  div + div {
    margin-left: 8px;
    cursor: pointer;
  }
`;

const ColorPalette = styled.div<{ color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ color }) => {
    return color || 'antiquewhite';
  }};
`;

const FrameWrapper = styled.div`
  display: flex;
  margin-bottom: 12px;

  div {
    cursor: pointer;
  }

  div + div {
    margin-left: 8px;
  }
`;

const FrameSize = styled.div<{ width: string; height: string }>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  border: 1px solid #333;
  position: relative;
`;

const FrameSizeName = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const BillInfomation = styled.div`
  display: flex;
  padding: 6px 8px;
  border-bottom: 1px solid #dbdbdb;
  margin-top: 8px;
`;

interface PaperSize {
  name: string;
  size: {
    width: string;
    height: string;
  };
}

interface FramePosition {
  left: string;
  top: string;
}

const Tool = () => {
  const imgUrl =
    'data:image/jpeg;base64,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';

  const [paperSize] = useState<PaperSize[]>([
    {
      name: 'a4',
      size: {
        width: '297px',
        height: '210px',
      },
    },
    {
      name: 'a5',
      size: {
        width: '210px',
        height: '148px',
      },
    },
    {
      name: 'a6',
      size: {
        width: '148px',
        height: '105px',
      },
    },
  ]);

  const [selectedFrame, setSelectedFrame] = useState(false); // 골랐는지 상태 여부
  const [selectedFrameInfo, setSelectedFrameInfo] = useState<PaperSize | null>(null); // 고른 액자의 정보 (스타일 + 이름)
  const [selectedFramePosition, setSelectedFramePosition] = useState<FramePosition | null>(null); // top, letf 위치 조절
  const [cursorX, cursorY] = useGetCursorPosition(selectedFrame);

  const imgNode = useRef<HTMLImageElement>(null);
  const fakeCanvasRef = useRef<HTMLCanvasElement>(null);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  //   따라다니는 액자를 재클릭하면 사라짐.
  const handleFrameRelease = useCallback(() => {
    if (!selectedFrame) return;
    setSelectedFrame(() => false);
    setSelectedFrameInfo(() => null);
    setSelectedFramePosition(() => null);
  }, [selectedFrame]);

  //   액자를 클릭하묜?
  const handleFrameSelect = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { value } = e.currentTarget.dataset;
      const selectedFrameName = paperSize.filter((lst) => lst.name === value);
      setSelectedFrame(() => true);
      setSelectedFrameInfo(selectedFrameName[0]);
    },
    [paperSize],
  );

  useEffect(() => {
    if (selectedFrame && selectedFrameInfo) {
      const {
        size: { width, height },
      } = selectedFrameInfo;
      const x = cursorX - +width.replace('px', '') / 2;
      const y = cursorY - +height.replace('px', '') / 2;
      setSelectedFramePosition({ left: `${x}px`, top: `${y}px` });
    }
  }, [selectedFrame, selectedFrameInfo, cursorX, cursorY]);

  useEffect(() => {
    if (fakeCanvasRef.current && imgSrc) {
      const { current: canvas } = fakeCanvasRef;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = imgSrc;
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
    }
  }, [fakeCanvasRef, imgSrc]);

  useEffect(() => {
    if (imgNode.current) {
      const el = imgNode.current;
      const { src } = el;
      const { width, height } = el.getBoundingClientRect();
      setImgWidth(width);
      setImgHeight(height);
      setImgSrc(src);
    }
  }, [imgNode]);

  return (
    <ToolContainer>
      {selectedFrame && selectedFrameInfo && selectedFramePosition && (
        <YouSelectedFrame
          onClick={handleFrameRelease}
          {...selectedFrameInfo.size}
          {...selectedFramePosition}
        ></YouSelectedFrame>
      )}
      <ImageWrapper id="img-box">
        <img ref={imgNode} src={imgUrl} alt="샘플이미지" />
        <FakeCanvas ref={fakeCanvasRef} width={imgWidth} height={imgHeight} />
      </ImageWrapper>

      <VersatileWrapper>
        <Versatile>
          <Factory>
            <FactoryTitle>색상</FactoryTitle>
            <ColorPaletteWrapper>
              <ColorPalette />
              <ColorPalette color="blue" />
              <ColorPalette color="green" />
              <ColorPalette color="yellow" />
            </ColorPaletteWrapper>

            <FactoryTitle>액자크기</FactoryTitle>
            <FrameWrapper>
              {paperSize.map((paper, index) => (
                <FrameSize key={index} data-value={paper.name} {...paper.size} onClick={handleFrameSelect}>
                  <FrameSizeName>{paper.name}</FrameSizeName>
                </FrameSize>
              ))}
            </FrameWrapper>
          </Factory>
        </Versatile>
        <BillInfomation>
          <FactoryTitle>
            예상 가격 <div>86,000원 </div>
          </FactoryTitle>
        </BillInfomation>
      </VersatileWrapper>
    </ToolContainer>
  );
};

export default Tool;
