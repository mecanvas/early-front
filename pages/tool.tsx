import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useGetCursorPosition } from '../hooks';
import Resizer from 'react-image-file-resizer';
import { dataURLtoFile } from '../util/dataURLtoFile';

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

  .cropped-img {
    position: absolute;
    border: 1.5px solid #333;
  }
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
  width: ${({ width }) => `${+width.replace('px', '') / 5}px`};
  height: ${({ height }) => `${+height.replace('px', '') / 5}px`};
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
  const [paperSize] = useState<PaperSize[]>([
    {
      name: 'A4',
      size: {
        width: '210px',
        height: '297px',
      },
    },
    {
      name: 'A5',
      size: {
        width: '148px',
        height: '210px',
      },
    },
    {
      name: 'A6',
      size: {
        width: '105px',
        height: '148px',
      },
    },
  ]);

  const [selectedFrame, setSelectedFrame] = useState(false); // 골랐는지 상태 여부
  const [selectedFrameInfo, setSelectedFrameInfo] = useState<PaperSize | null>(null); // 고른 액자의 정보 (스타일 + 이름)
  const [selectedFramePosition, setSelectedFramePosition] = useState<FramePosition | null>(null); // top, letf 위치 조절
  const [cursorX, cursorY] = useGetCursorPosition(selectedFrame);

  const resizeFile = useCallback(
    (file: File) =>
      new Promise((resolve) => {
        Resizer.imageFileResizer(
          file,
          1000,
          1000,
          'JPEG',
          100,
          0,
          (uri) => {
            resolve(uri);
          },
          'base64',
        );
      }),
    [],
  );

  const imgNode = useRef<HTMLImageElement>(null);
  const [imgUploadUrl, setImgUploadUrl] = useState('');
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [resizeNewImgSrc, setResizeNewImgSrc] = useState('');
  const [isResize, setIsResize] = useState(false);

  const youSelectedFrameRef = useRef<HTMLDivElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);

  // canvas -> dataUrl로 바꿔야 이미지의 크기가 바뀐다. (canvas가 natural img에 따라 사용하기 때문)
  const resizeImageSrc = useCallback(() => {
    const img = new Image(imgWidth, imgHeight);
    img.src = imgUploadUrl;
    img.crossOrigin = 'Anonymous';
    const canvas = document.createElement('canvas');
    img.onload = () => {
      canvas.width = imgWidth;
      canvas.height = imgHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, imgWidth, imgHeight);
      (() => setResizeNewImgSrc(canvas.toDataURL('image/png', 1.0)))();
    };
  }, [imgHeight, imgUploadUrl, imgWidth]);

  //   액자를 사진 속에 눌렀을떄 이미지 크롭
  const insertFrameToCanvas = useCallback(async () => {
    if (youSelectedFrameRef.current && imgNode.current) {
      // 현재 액자의 사이즈
      const { width: frameWidth, height: frameHeight } = youSelectedFrameRef.current.getBoundingClientRect();
      // 현재 이미지의 크기에 따른 여백의 크기
      const { left, top } = imgNode.current.getBoundingClientRect();

      // 크롭된 이미지를 담을 액자 생성
      const canvas = document.createElement('canvas');
      canvas.classList.add('cropped-img');
      canvas.width = frameWidth;
      canvas.height = frameHeight;
      canvas.style.left = `${cursorX - frameWidth / 2}px`;
      canvas.style.top = `${cursorY - frameHeight / 2 - 50}px`;
      const cropX = cursorX - left;
      const cropY = cursorY - top;

      const ctx = canvas.getContext('2d');
      const img = new Image();
      // 사이즈를 바꿨으면 resizeNewImg 아니면 업로드 이미지
      img.src = resizeNewImgSrc || imgUploadUrl;
      img.onload = () => {
        ctx?.drawImage(
          img,
          cropX - frameWidth / 2,
          cropY - frameHeight / 2,
          frameWidth,
          frameHeight,
          0,
          0,
          frameWidth,
          frameHeight,
        );
        imgWrapperRef?.current?.prepend(canvas);
      };
    }
  }, [cursorX, cursorY, youSelectedFrameRef, imgNode, resizeNewImgSrc, imgUploadUrl]);

  //   따라다니는 액자를 재클릭하면 insert하고 사라짐.
  const handleFrameRelease = useCallback(() => {
    if (!selectedFrame) return;
    insertFrameToCanvas();
    setSelectedFrame(() => false);
    setSelectedFrameInfo(() => null);
    setSelectedFramePosition(() => null);
  }, [selectedFrame, insertFrameToCanvas]);

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

  // TODO: 스크롤? 에 따라 반영이 안되보임
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
    if (imgNode.current && imgUploadUrl) {
      const el = imgNode.current;
      el.src = imgUploadUrl;
      const { width, height } = el.getBoundingClientRect();
      if (!imgWidth && !imgHeight) {
        setImgWidth(width);
        setImgHeight(height);
      }
    }
  }, [imgNode, imgUploadUrl, imgWidth, imgHeight]);

  // 리사이즈를 하겠다는 표시가 뜨면 함수 실행 (canvas -> data:base64로 변경하기 위해서임)
  useEffect(() => {
    if (isResize) {
      resizeImageSrc();
    }
  }, [isResize, resizeImageSrc]);

  useEffect(() => {
    if (isResize && imgNode.current) {
      imgNode.current.width = 100;
      imgNode.current.height = 100;
      setImgWidth(100);
      setImgHeight(100);
    }
  }, [imgWidth, imgHeight, imgNode, isResize]);

  const handleImgUpload = async (e: React.ChangeEventHandler<HTMLInputElement> | any) => {
    try {
      const file = e.target.files[0];
      const image = await resizeFile(file);
      setImgUploadUrl(typeof image === 'string' ? image : '');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const g = dataURLtoFile(imgUploadUrl, 'img');
    console.log(g);
  }, [imgUploadUrl]);

  return (
    <ToolContainer>
      {selectedFrame && selectedFrameInfo && selectedFramePosition && (
        <YouSelectedFrame
          ref={youSelectedFrameRef}
          onClick={handleFrameRelease}
          {...selectedFrameInfo.size}
          {...selectedFramePosition}
        ></YouSelectedFrame>
      )}
      <ImageWrapper id="img-box" ref={imgWrapperRef}>
        {imgUploadUrl ? (
          <img ref={imgNode} src={imgUploadUrl} alt="샘플이미지" />
        ) : (
          <input type="file" accept="image/*" onChange={handleImgUpload} />
        )}
      </ImageWrapper>
      <button
        onClick={() => {
          setIsResize(true);
          setImgWidth(100);
        }}
      >
        클릭하면 너비가 100으로
      </button>
      <button
        onClick={() => {
          setImgHeight(100);
        }}
      >
        클릭하면 높이가가 100으로
      </button>

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
