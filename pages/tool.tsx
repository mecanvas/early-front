import React, { useCallback, useEffect, useState } from 'react';
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
    'https://lh3.googleusercontent.com/proxy/3vOprbwYSsnm5QdLaSoxy3OcTqMWYiCJo3-PKXm86gu1XmMyMiGIhgJQCnOwTsKK5K8-7uADt6lXbccdRbRyUiqT53jxj67YHmsyCwwegCyyYCnaoYs';

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

  const [selectedFrame, setSelectedFrame] = useState(false);
  const [selectedFrameInfo, setSelectedFrameInfo] = useState<PaperSize | null>(null);
  const [cursorX, cursorY] = useGetCursorPosition(selectedFrame);
  const [selectedFramePosition, setSelectedFramePosition] = useState<FramePosition | null>(null);

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

  return (
    <ToolContainer>
      {selectedFrame && selectedFrameInfo && selectedFramePosition && (
        <YouSelectedFrame {...selectedFrameInfo.size} {...selectedFramePosition}></YouSelectedFrame>
      )}
      <ImageWrapper id="img-box">
        <div>
          <img src={imgUrl} alt="샘플이미지" />
        </div>
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
