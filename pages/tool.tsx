import React from 'react';
import styled from '@emotion/styled';

const ToolContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
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

const Tool = () => {
  const paperSize: PaperSize[] = [
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
  ];

  const imgUrl =
    'https://lh3.googleusercontent.com/proxy/3vOprbwYSsnm5QdLaSoxy3OcTqMWYiCJo3-PKXm86gu1XmMyMiGIhgJQCnOwTsKK5K8-7uADt6lXbccdRbRyUiqT53jxj67YHmsyCwwegCyyYCnaoYs';

  return (
    <ToolContainer>
      <ImageWrapper>
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
              {paperSize.map((paper) => (
                <FrameSize {...paper.size}>
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
