import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useGetCursorPosition, useGetScollPosition } from 'src/hooks';
import { dataURLtoFile } from '../../util/dataURLtoFile';
import { resizeFile } from '../../util/resizeFile';
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
  const [paperSize] = useState<PaperSize[]>([
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
  ]);

  const [selectedFrame, setSelectedFrame] = useState(false); // 골랐는지 상태 여부
  const [selectedFrameInfo, setSelectedFrameInfo] = useState<PaperSize | null>(null); // 고른 액자의 정보 (스타일 + 이름)
  const [selectedFramePosition, setSelectedFramePosition] = useState<FramePosition | null>(null); // top, letf 위치 조절
  const [cursorX, cursorY] = useGetCursorPosition(selectedFrame);
  const [scrollX, scrollY] = useGetScollPosition();

  const imgNode = useRef<HTMLImageElement>(null);
  const [imgUploadUrl, setImgUploadUrl] = useState('');
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [resizeNewImgSrc, setResizeNewImgSrc] = useState('');
  const [isResize, setIsResize] = useState(false);
  const [canvasFramePositionList, setCanvasFramePositionList] = useState<CanvasFramePositionList[]>([]);

  const youSelectedFrameRef = useRef<HTMLDivElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);

  const [framePrice, setFramePrice] = useState<FramePrice[]>([]);

  const [isPreview, setIsPreview] = useState(false);

  // canvas로 이미지의 너비,높이를 바꿔야 이미지의 크기가 바뀐다. (액자로 자를 시 natural size를 사용하기 때문)
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
    if (youSelectedFrameRef.current && imgNode.current && selectedFrameInfo) {
      //  액자의 가격을 price에 넣기
      const { name, price } = selectedFrameInfo;
      setFramePrice([{ name, price }, ...framePrice]);
      // 현재 액자의 사이즈
      const { width: frameWidth, height: frameHeight } = youSelectedFrameRef.current.getBoundingClientRect();
      // 현재 이미지의 크기에 따른 여백의 크기
      const { left, top } = imgNode.current.getBoundingClientRect();

      // 크롭된 이미지를 담을 액자 생성
      const canvas = document.createElement('canvas');
      canvas.classList.add('cropped-img');
      canvas.width = frameWidth;
      canvas.height = frameHeight;
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

      const ctx = canvas.getContext('2d');
      (ctx as CanvasRenderingContext2D).imageSmoothingQuality = 'high';
      const cropX = cursorX - left;
      const cropY = cursorY - top;
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
  }, [
    selectedFrameInfo,
    framePrice,
    cursorX,
    scrollX,
    cursorY,
    scrollY,
    resizeNewImgSrc,
    imgUploadUrl,
    canvasFramePositionList,
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
      const selectedFrameName = paperSize.filter((lst) => lst.name === value);
      setSelectedFrame(() => true);
      setSelectedFrameInfo(selectedFrameName[0]);
    },
    [paperSize],
  );

  const handleImgResizing = useCallback(() => {
    setIsResize((prev) => !prev);
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

  const handleImgUpload = async (e: React.ChangeEventHandler<HTMLInputElement> | any) => {
    try {
      const file = e.target.files[0];
      const image = await resizeFile(file);
      setImgUploadUrl(typeof image === 'string' ? image : '');
    } catch (err) {
      console.error(err);
    }
  };

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

  // 이미지 업로드시 file로 변환 TODO: 이걸로 formData 만들어서 서버에 보내기
  useEffect(() => {
    const file = dataURLtoFile(imgUploadUrl, 'img');
  }, [imgUploadUrl]);

  // 리사이즈시에도 동일하게 움직일 수 있도록 설정
  const handleFramePositionReletive = useCallback(() => {
    if (imgNode.current) {
      const { left: imgLeft, top: imgTop } = imgNode.current.getBoundingClientRect();
      const cropImg = document.querySelectorAll('.cropped-img');
      cropImg.forEach((node) => {
        if (!node) return;
        const { originleft, origintop } = (node as HTMLCanvasElement).dataset;
        if (originleft && origintop) {
          const left = `${+originleft + imgLeft}px`;
          const top = `${+origintop + imgTop}px`;
          node.setAttribute('style', `left: ${left}; top: ${top};`);
        }
      });
    }
  }, [imgNode]);

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
            isPreview || <img ref={imgNode} src={imgUploadUrl} alt="샘플이미지" />
          ) : (
            <input type="file" accept="image/*" onChange={handleImgUpload} />
          )}
        </ImageWrapper>

        <VersatileWrapper>
          <ImageToolWrapper>
            <ImageToolBtn onClick={handleImgResizing}>이미지 리사이징</ImageToolBtn>
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
