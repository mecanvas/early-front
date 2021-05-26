import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGetCursorPosition, useGetScollPosition } from 'src/hooks';
import axios from 'axios';

import {
  ImageGoBack,
  ToolContainer,
  YouSelectedFrame,
  ImageWrapper,
  VersatileWrapper,
  ImageToolWrapper,
  ImageToolBtn,
  Versatile,
  Factory,
  FactoryTitle,
  ColorPaletteWrapper,
  ColorPalette,
  FrameWrapper,
  FrameSize,
  FrameSizeName,
  BillInfomation,
} from './toolStyle';

interface PaperSize {
  name: string;
  size: {
    width: string;
    height: string;
  };
  price: number;
}

interface FramePrice {
  name: string;
  price: number;
}

interface FramePosition {
  left: string;
  top: string;
}

interface CanvasFramePositionList {
  id: number;
  left: number;
  top: number;
}

const Tool = () => {
  const paperSize = useMemo<PaperSize[]>(
    () => [
      {
        name: 'A4',
        size: {
          width: '210px',
          height: '297px',
        },
        price: 55000,
      },
      {
        name: 'A5',
        size: {
          width: '148px',
          height: '210px',
        },
        price: 40000,
      },
      {
        name: 'A6',
        size: {
          width: '105px',
          height: '148px',
        },
        price: 30000,
      },
    ],
    [],
  );

  const [selectedFrame, setSelectedFrame] = useState(false); // 골랐는지 상태 여부
  const [selectedFrameInfo, setSelectedFrameInfo] = useState<PaperSize | null>(null); // 고른 액자의 정보 (스타일 + 이름)
  const [selectedFramePosition, setSelectedFramePosition] = useState<FramePosition | null>(null); // top, letf 위치 조절
  const [cursorX, cursorY] = useGetCursorPosition(selectedFrame);
  const [scrollX, scrollY] = useGetScollPosition();

  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const imgNode = useRef<HTMLImageElement>(null);
  const [imgUploadUrl, setImgUploadUrl] = useState('');
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [imgResizeStart, setImgResizeStart] = useState(false);
  const [imgResizeEnd, setImgResizeEnd] = useState(false);
  const [canvasFramePositionList, setCanvasFramePositionList] = useState<CanvasFramePositionList[]>([]);

  const youSelectedFrameRef = useRef<HTMLDivElement>(null);

  const [framePrice, setFramePrice] = useState<FramePrice[]>([]);

  const [isPreview, setIsPreview] = useState(false);

  //   액자를 사진 속에 눌렀을떄 이미지 크롭
  const insertFrameToCanvas = useCallback(async () => {
    if (youSelectedFrameRef.current && imgNode.current && selectedFrameInfo) {
      //  액자의 가격을 price에 넣기
      const { name, price } = selectedFrameInfo;
      setFramePrice([{ name, price }, ...framePrice]);
      // 현재 액자의 사이즈
      const { width: frameWidth, height: frameHeight } = youSelectedFrameRef.current.getBoundingClientRect();
      // 현재 이미지의 크기에 따른 여백의 크기
      const { left, top } = imgNode.current.getBoundingClientRect();

      // 크롭된 이미지를 담을 액자 생성
      const canvas = document.createElement('div');
      canvas.classList.add('cropped-img');
      canvas.style.width = `${frameWidth}px`;
      canvas.style.height = `${frameHeight}px`;
      const canvasLeftPosition = cursorX + scrollX - frameWidth / 2;
      const canvasTopPosition = cursorY + scrollY - frameHeight / 2 - 50;
      canvas.style.left = `${canvasLeftPosition}px`;
      canvas.style.top = `${canvasTopPosition}px`;
      canvas.setAttribute('data-originleft', `${canvasLeftPosition - left}`);
      canvas.setAttribute('data-origintop', `${canvasTopPosition - top}`);
      canvas.id = Date.now().toString();
      setCanvasFramePositionList([
        ...canvasFramePositionList,
        { left: canvasLeftPosition, top: canvasTopPosition, id: Date.now() },
      ]);

      const sampleImg = document.createElement('img');
      sampleImg.setAttribute(
        'style',
        `
        background-image : url(${imgUploadUrl});
        background-repeat : no-repeat;
        background-size: ${imgWidth}px ${imgHeight}px; 
        background-position-x: ${-canvasLeftPosition + left - 1}px;
        background-position-y: ${-canvasTopPosition + top - 50 - 1}px;
        width: ${100}%;
        height: ${100}%;
      `,
      );
      canvas.append(sampleImg);
      imgWrapperRef.current?.prepend(canvas);
    }
  }, [
    selectedFrameInfo,
    framePrice,
    cursorX,
    scrollX,
    cursorY,
    scrollY,
    canvasFramePositionList,
    imgUploadUrl,
    imgWidth,
    imgHeight,
  ]);

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
      const el = imgNode.current;
      if (el) {
        const { width, height } = el.getBoundingClientRect();
        setImgWidth(width);
        setImgHeight(height);
      }
      const selectedFrameName = paperSize.filter((lst) => lst.name === value);
      setSelectedFrame(() => true);
      setSelectedFrameInfo(selectedFrameName[0]);
    },
    [paperSize],
  );

  const handleImgResizing = useCallback(() => {
    setImgResizeStart(true);
    setImgResizeEnd(false);
  }, []);

  const handleImgResizeEnd = useCallback(() => {
    setImgResizeEnd(true);
    setImgResizeStart(false);
  }, []);

  const handleImgPreview = useCallback(() => {
    if (!imgUploadUrl) return;
    setIsPreview((prev) => !prev);
  }, [imgUploadUrl]);

  const handleImgGoBack = useCallback(() => {
    if (imgWrapperRef.current) {
      const { current: imgBox } = imgWrapperRef;
      if (imgBox.childNodes.length <= 1) {
        if (!isPreview) {
          return console.log('존재하는 액자가 없습니다.');
        }
        if (imgBox.childNodes.length === 0) {
          return console.log('존재하는 액자가 없습니다.');
        }
      }
      const imgBoxId = +(imgBox.childNodes[0] as any).id;
      imgBox?.removeChild(imgBox.childNodes[0]);
      setFramePrice(framePrice.slice(1));
      setCanvasFramePositionList(canvasFramePositionList.filter((lst) => lst.id !== imgBoxId));
    }
  }, [framePrice, isPreview, canvasFramePositionList]);

  const handleImgUpload = useCallback(
    async (e: React.ChangeEventHandler<HTMLInputElement> | any) => {
      try {
        if (imgWrapperRef.current) {
          const file = e.target.files[0];
          const fd = new FormData();
          fd.append('image', file);

          await axios
            .post('/post/img', fd, { baseURL: 'http://localhost:4000' })
            .then((res) => setImgUploadUrl(res.data || ''));
        }
      } catch (err) {
        console.error(err);
      }
    },
    [imgWrapperRef],
  );

  // 리사이즈시에도 동일하게 움직일 수 있도록 설정
  const handleFramePositionReletive = useCallback(() => {
    if (imgNode.current) {
      const { left: imgLeft, top: imgTop } = imgNode.current.getBoundingClientRect();
      const cropImg = document.querySelectorAll('.cropped-img');
      cropImg.forEach((node) => {
        if (!node) return;
        const { originleft, origintop } = (node as HTMLDivElement).dataset;
        if (originleft && origintop) {
          const left = `${+originleft + imgLeft}px`;
          const top = `${+origintop + imgTop}px`;
          (node as HTMLDivElement).style.left = left;
          (node as HTMLDivElement).style.top = top;
        }
      });
    }
  }, [imgNode]);

  // 액자 클릭시 움직이는 로직
  useEffect(() => {
    if (selectedFrame && selectedFrameInfo) {
      const {
        size: { width, height },
      } = selectedFrameInfo;
      const x = cursorX + scrollX - +width.replace('px', '') / 2;
      const y = cursorY + scrollY - +height.replace('px', '') / 2;
      setSelectedFramePosition({ left: `${x}px`, top: `${y}px` });
    }
  }, [selectedFrame, selectedFrameInfo, cursorX, cursorY, scrollX, scrollY]);

  useEffect(() => {
    if (imgResizeStart) {
      console.log('이미지 자르기 시작');
    }
  }, [imgResizeStart]);

  useEffect(() => {
    if (imgResizeEnd) {
      console.log('이미지 자르기 끝');
    }
  }, [imgResizeEnd]);

  useEffect(() => {
    if (!imgUploadUrl) return;
    const el = imgNode.current;
    if (el) {
      el.src = imgUploadUrl;
    }
  }, [imgUploadUrl]);

  useEffect(() => {
    if (window) {
      window.addEventListener('resize', handleFramePositionReletive);
    }
    return () => {
      window.removeEventListener('resize', handleFramePositionReletive);
    };
  }, [handleFramePositionReletive]);

  return (
    <>
      <ImageGoBack onClick={handleImgGoBack}>뒤로 가기</ImageGoBack>
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
            <>
              <img
                ref={imgNode}
                style={{ visibility: `${isPreview ? 'hidden' : 'visible'}` }}
                src={imgUploadUrl}
                alt="샘플이미지"
              />
            </>
          ) : (
            <input type="file" accept="image/*" onChange={handleImgUpload} />
          )}
        </ImageWrapper>

        <VersatileWrapper>
          <ImageToolWrapper>
            <ImageToolBtn onClick={handleImgResizing}>이미지 리사이징</ImageToolBtn>
            {imgResizeStart && <ImageToolBtn onClick={handleImgResizeEnd}>리사이징끝</ImageToolBtn>}
            <ImageToolBtn onClick={handleImgPreview}>미리보기</ImageToolBtn>
          </ImageToolWrapper>
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
              예상 가격 <div>{framePrice.reduce((acc, cur) => (acc += cur.price), 0).toLocaleString()}원</div>
            </FactoryTitle>
          </BillInfomation>
        </VersatileWrapper>
      </ToolContainer>
    </>
  );
};

export default Tool;
