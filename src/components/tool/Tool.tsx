import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGetCursorPosition, useGetScollPosition } from 'src/hooks';
import axios from 'axios';
import ToolColorPalette from './ToolColorPalette';
import {
  ToolContainer,
  YouSelectedFrame,
  ImageWrapper,
  VersatileWrapper,
  Versatile,
  Factory,
  FactoryTitle,
  FrameWrapper,
  FrameSize,
  FrameSizeName,
  BillInfomation,
  DropZone,
  CanvasInfomationWrapper,
} from './ToolStyle';
import { canvasToImage } from 'src/util/canvasToImage';
import { ColorResult } from 'react-color';
import { useDropzone } from 'react-dropzone';
import { BgColorsOutlined, ColumnWidthOutlined, DiffOutlined, UndoOutlined } from '@ant-design/icons';
import { Button, Modal, notification, Popover, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';

interface PaperSize {
  name: string;
  size: {
    width: string;
    height: string;
  };
  price: number;
}

interface SelectedFrameInfo {
  width: string;
  height: string;
}

interface FramePrice {
  name: string;
  price: number;
  id: number;
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
        name: '10x10',
        // 10cm X 10cm
        size: {
          width: `${377.95275590551 / 3}px`,
          height: `${377.95275590551 / 3}px`,
        },
        price: 55000,
      },
      {
        name: '20x20',
        // 20cm X 20cm
        size: {
          width: `${755.90551181102 / 3}px`,
          height: `${755.90551181102 / 3}px`,
        },
        price: 40000,
      },
      {
        name: '30x30',
        // 30cm X 30cm
        size: {
          width: `${1133.8582677165 / 3}px`,
          height: `${1133.8582677165 / 3}px`,
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

  const [originWidth, setOriginWidth] = useState(0);
  const [originHeight, setOriginHeight] = useState(0);
  const [resizeWidth, setResizeWidth] = useState(0);
  const [resizeHeight, setResizeHeight] = useState(0);
  const [ratioPersist, setRatioPersist] = useState(true);
  const [imgResizeStart, setImgResizeStart] = useState(false);
  const [imgResizeEnd, setImgResizeEnd] = useState(false);
  const [imgResizeModal, setIsImgResizeModal] = useState(false);
  const [canvasFramePositionList, setCanvasFramePositionList] = useState<CanvasFramePositionList[]>([]);
  const [selectedFrameList, setSelectedFrameList] = useState<HTMLCanvasElement[]>([]);
  const [yourSelectedFrame, setYourSelectedFrame] = useState<SelectedFrameInfo | null>(null);

  const youSelectedFrameRef = useRef<HTMLDivElement>(null);

  const [framePrice, setFramePrice] = useState<FramePrice[]>([]);

  const [isPreview, setIsPreview] = useState(false);

  // 바뀌는 색상
  const [bgColor, setBgColor] = useState('#ffffff');
  // const [frameBorderColor, setFrameBorderColor] = useState('#333');

  // 이미지 업로드
  const handleImgUpload = useCallback(
    async (file: RcFile) => {
      console.log(file);

      try {
        if (imgWrapperRef.current) {
          const fd = new FormData();
          fd.append('image', file);
          await axios.post('/canvas/img', fd).then((res) => setImgUploadUrl(res.data || ''));
        }
      } catch (err) {
        console.error(err);
      }
      return false;
    },
    [imgWrapperRef],
  );

  const handleImgDropUpload = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles[0].type.includes('image')) {
      return alert('이미지 파일이 아닌건 지원하지 않습니다.');
    }
    if (acceptedFiles[0].type.includes('svg')) {
      return alert('svg 파일은 지원하지 않습니다.');
    }

    try {
      if (imgWrapperRef.current) {
        const file = acceptedFiles[0];
        const fd = new FormData();
        fd.append('image', file);

        await axios.post('/canvas/img', fd).then((res) => setImgUploadUrl(res.data || ''));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleImgDropUpload });

  const handleDeleteCanvas = useCallback(
    (e) => {
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
        imgBox.childNodes.forEach((node) => {
          if ((node as HTMLElement).id === e.target.id) {
            imgBox.removeChild(node);
          }
        });
        setFramePrice((prev) => prev.filter((lst) => lst.id !== +e.target.id));
        setCanvasFramePositionList((prev) => prev.filter((lst) => +lst.id !== +e.target.id));
        setSelectedFrameList((prev) => prev.filter((lst) => +lst.id !== +e.target.id));
      }
    },
    [isPreview],
  );

  const handleImgGoBack = useCallback(() => {
    if (imgWrapperRef.current) {
      const { current: imgBox } = imgWrapperRef;
      if (imgBox.childNodes.length <= 1) {
        if (!isPreview) {
          return notification.info({ message: '존재하는 액자가 없습니다.', placement: 'bottomLeft' });
        }
        if (imgBox.childNodes.length === 0) {
          return notification.info({ message: '존재하는 액자가 없습니다.', placement: 'bottomLeft' });
        }
      }
      const imgBoxId = +(imgBox.childNodes[0] as any).id;
      imgBox?.removeChild(imgBox.childNodes[0]);
      setFramePrice(framePrice.slice(1));
      setCanvasFramePositionList(canvasFramePositionList.filter((lst) => lst.id !== imgBoxId));
      setSelectedFrameList(selectedFrameList.filter((lst) => +lst.id !== imgBoxId));
    }
  }, [framePrice, canvasFramePositionList, selectedFrameList, isPreview]);

  // 이미지 저장을 위한 캔버스 생성 (스프라이트 기법으로 이미지 저장은 안되기 때문에 품질이 깨지더라도 이 방법 사용합니다.)
  const createCanvasForSave = useCallback(
    (id: number) => {
      if (!youSelectedFrameRef.current || !imgNode.current) return;
      const { width: frameWidth, height: frameHeight } = youSelectedFrameRef.current.getBoundingClientRect();
      const { left, top } = imgNode.current.getBoundingClientRect();

      const image = imgNode.current;
      const oCanvas = document.createElement('canvas');
      oCanvas.id = id.toString();
      const cropX = cursorX - left - frameWidth / 2;
      const cropY = cursorY - top - frameHeight / 2;

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const oCtx = oCanvas.getContext('2d');
      const pixelRatio = window.devicePixelRatio;

      oCanvas.width = frameWidth * pixelRatio;
      oCanvas.height = frameHeight * pixelRatio;

      oCtx?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      (oCtx as CanvasRenderingContext2D).imageSmoothingQuality = 'high';

      oCtx?.drawImage(
        image,
        cropX * scaleX,
        cropY * scaleY,
        frameWidth * scaleX,
        frameHeight * scaleY,
        0,
        0,
        frameWidth,
        frameHeight,
      );

      setSelectedFrameList([...selectedFrameList, oCanvas]);
    },
    [cursorX, cursorY, selectedFrameList],
  );

  const createImageCanvas = useCallback(
    (id: number) => {
      if (!youSelectedFrameRef.current || !imgNode.current) return;
      const { width: frameWidth, height: frameHeight } = youSelectedFrameRef.current.getBoundingClientRect();
      const { left, top } = imgNode.current.getBoundingClientRect();

      // 크롭된 이미지를 담을 캔버스 생성
      const div = document.createElement('div');
      const deleteBtn = document.createElement('div');
      deleteBtn.classList.add('cropped-img-delete');
      deleteBtn.addEventListener('click', handleDeleteCanvas);
      deleteBtn.id = id.toString();
      div.classList.add('cropped-img');
      div.style.width = `${frameWidth}px`;
      div.style.height = `${frameHeight}px`;
      const canvasLeftPosition = cursorX - frameWidth / 2;
      const canvasTopPosition = cursorY - frameHeight / 2 - 50;
      div.style.left = `${canvasLeftPosition + scrollX}px`;
      div.style.top = `${canvasTopPosition + scrollY}px`;
      div.setAttribute('data-originleft', `${canvasLeftPosition - left}`);
      div.setAttribute('data-origintop', `${canvasTopPosition - top}`);
      div.id = id.toString();

      // 크롭된 이미지 생성 (화질 구지 방지를 위해 스프라이트 기법 사용)
      const cropImage = document.createElement('img');
      cropImage.setAttribute(
        'style',
        `
        background-image : url(${imgUploadUrl});
        background-repeat : no-repeat;
        background-size: ${imgWidth}px ${imgHeight}px; 
        background-position-x: ${-canvasLeftPosition + left}px;
        background-position-y: ${-canvasTopPosition + top - 50}px;
        width: ${100}%;
        height: ${100}%;
        box-shadow : 0 0 7px #333 inset, 0 0 6px #ededed;
        `,
      );

      // 만든 캔버스 액자의 포지션이 어떤지 설정해주기, 왜 와이? 리사이즈 시 위치 바꾸기 위함
      setCanvasFramePositionList([
        ...canvasFramePositionList,
        { left: canvasLeftPosition, top: canvasTopPosition, id },
      ]);

      div.append(cropImage);
      div.append(deleteBtn);
      imgWrapperRef.current?.prepend(div);
    },
    [
      canvasFramePositionList,
      cursorX,
      cursorY,
      handleDeleteCanvas,
      imgHeight,
      imgUploadUrl,
      imgWidth,
      scrollX,
      scrollY,
    ],
  );

  //   액자를 사진 속에 눌렀을떄 이미지 크롭
  const insertFrameToCanvas = useCallback(async () => {
    if (youSelectedFrameRef.current && imgNode.current && selectedFrameInfo) {
      //  액자의 가격을 price에 넣기
      const { name, price } = selectedFrameInfo;
      const id = Date.now();
      setFramePrice([{ name, price, id }, ...framePrice]);
      createImageCanvas(id);
      createCanvasForSave(id);
    }
  }, [selectedFrameInfo, framePrice, createImageCanvas, createCanvasForSave]);

  //   따라다니는 액자를 재클릭하면 insert하고 사라짐.
  const handleFrameRelease = useCallback(() => {
    if (!selectedFrame) return;
    insertFrameToCanvas();
    setSelectedFrame(() => false);
    setSelectedFrameInfo(() => null);
    setSelectedFramePosition(() => null);
    setYourSelectedFrame(() => null);
  }, [selectedFrame, insertFrameToCanvas]);

  //   액자를 클릭하묜?
  const handleFrameSelect = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { value } = e.currentTarget.dataset;
      const el = imgNode.current;
      if (el) {
        const { width, height } = el.getBoundingClientRect();
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.maxHeight = `${height}px`;

        setImgWidth(width);
        setImgHeight(height);
        const naturalWidth = el.naturalWidth / width > 1 ? el.naturalWidth / width : 1;
        const naturalHeight = el.naturalHeight / height > 1 ? el.naturalHeight / height : 1;
        const seletctedName = paperSize.filter((lst) => {
          if (lst.name === value) {
            const newWidth = (+lst.size.width.replace('px', '') * 3) / naturalWidth;
            const newHeight = (+lst.size.height.replace('px', '') * 3) / naturalHeight;
            setYourSelectedFrame({ width: `${newWidth}px`, height: `${newHeight}px` });
            setSelectedFrame(() => true);
            return lst;
          }
        });
        setSelectedFrameInfo(seletctedName[0]);
      }
    },
    [paperSize],
  );

  // 사이즈 변경입력을 확인
  const handleConfirmChange = useCallback(() => {
    if (imgNode.current) {
      const el = imgNode.current;
      el.style.width = `${resizeWidth}px`;
      el.style.height = `${resizeHeight}px`;
      el.style.maxHeight = `${resizeHeight}px`;
    }
  }, [resizeHeight, resizeWidth]);

  const handleResizeReset = useCallback(() => {
    setResizeWidth(originWidth);
    setResizeHeight(originHeight);
  }, [originWidth, originHeight]);

  const handleRatioPersist = useCallback(() => {
    setRatioPersist((prev) => !prev);
  }, []);

  // 이미지 사이즈를 변경 입력
  const handleChangeImgSize = useCallback(
    (e) => {
      const { name, value } = e.target;

      if (name === 'width') {
        setResizeWidth(+value);
        if (ratioPersist) {
          const ratioHeight = (+value * originHeight) / originWidth;
          setResizeHeight(ratioHeight);
        }
      }
      if (name === 'height') {
        setResizeHeight(+value);
        if (ratioPersist) {
          setResizeWidth((+value * originWidth) / originHeight);
        }
      }
    },
    [originHeight, originWidth, ratioPersist],
  );

  const handleImgResizing = useCallback(() => {
    setImgResizeStart(true);
    setIsImgResizeModal(true);
    setImgResizeEnd(false);
  }, []);

  const handleImgResizeEnd = useCallback(() => {
    setImgResizeEnd(true);
    setImgResizeStart(false);
    setIsImgResizeModal(false);
  }, []);

  const handleImgResizeCancel = useCallback(() => {
    setIsImgResizeModal(false);
    setImgResizeStart(false);
  }, []);

  const handleImgPreview = useCallback(() => {
    if (!imgUploadUrl) return;
    setIsPreview((prev) => !prev);
  }, [imgUploadUrl]);

  // 리사이즈시에도 동일하게 움직일 수 있도록 설정
  const handleFramePositionReletive = useCallback(() => {
    if (imgNode.current) {
      const { left: imgLeft, top: imgTop } = imgNode.current.getBoundingClientRect();
      const cropImg = document.querySelectorAll('.cropped-img');
      cropImg.forEach((node) => {
        if (!node) return;
        const { originleft, origintop } = (node as HTMLDivElement).dataset;
        if (originleft && origintop) {
          const left = `${+originleft + imgLeft + scrollX}px`;
          const top = `${+origintop + imgTop + scrollY}px`;
          (node as HTMLDivElement).style.left = left;
          (node as HTMLDivElement).style.top = top;
        }
      });
    }
  }, [scrollX, scrollY]);

  // 컬러 체이닞
  const handleColorChange = useCallback((color: ColorResult) => {
    const { hex } = color;
    setBgColor(hex);
  }, []);

  // const handleFrameColorChange = useCallback((color: ColorResult) => {
  //   const { hex } = color;
  //   setFrameBorderColor(hex);
  // }, []);

  // 액자 클릭시 움직이는 로직
  useEffect(() => {
    if (selectedFrame && yourSelectedFrame) {
      const { width, height } = yourSelectedFrame;
      const x = cursorX + scrollX - +width.replace('px', '') / 2;
      const y = cursorY + scrollY - +height.replace('px', '') / 2;
      setSelectedFramePosition({ left: `${x}px`, top: `${y}px` });
    }
  }, [selectedFrame, yourSelectedFrame, cursorX, cursorY, scrollX, scrollY]);

  // 자르기 시작할때 원래 이미지 사이즈 저장
  useEffect(() => {
    if (imgResizeStart) {
      if (imgNode.current) {
        const { width, height } = imgNode.current?.getBoundingClientRect();
        const { naturalHeight, naturalWidth } = imgNode.current;
        setOriginWidth(naturalWidth);
        setOriginHeight(naturalHeight);
        setResizeWidth(width);
        setResizeHeight(height);
      }
    }
  }, [imgResizeStart]);

  // 자르기 끝
  useEffect(() => {
    if (imgResizeEnd) {
      console.log('이미지 자르기 끝');
    }
  }, [imgResizeEnd]);

  useEffect(() => {
    if (imgNode.current) {
      imgNode.current.style.visibility = isPreview ? 'hidden' : 'visible';
    }
  }, [isPreview]);

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
      {imgResizeStart && (
        <Modal
          visible={imgResizeModal}
          onOk={handleImgResizeEnd}
          onCancel={handleImgResizeCancel}
          title="이미지의 너비와 높이를 입력하세요."
          children={
            <div>
              <div>입력하세요</div>
              <form onChange={handleChangeImgSize}>
                <input type="text" name="width" value={resizeWidth} placeholder="너비" />
                <input type="text" name="height" value={resizeHeight} placeholder="높이" />
              </form>
              <div>
                <input type="checkbox" defaultChecked={ratioPersist} onChange={handleRatioPersist} />
                <span>너비에 비율을 맞춥니다.</span>
              </div>
              <div>
                <button type="button" onClick={handleResizeReset}>
                  원래대로
                </button>
              </div>
              <button type="button" onClick={handleConfirmChange}>
                확인
              </button>
            </div>
          }
        ></Modal>
      )}

      <ToolContainer bgColor={bgColor}>
        {selectedFrame && selectedFramePosition && yourSelectedFrame && (
          <YouSelectedFrame
            // border={frameBorderColor}
            ref={youSelectedFrameRef}
            onClick={handleFrameRelease}
            {...yourSelectedFrame}
            {...selectedFramePosition}
          ></YouSelectedFrame>
        )}
        <ImageWrapper id="img-box" ref={imgWrapperRef}>
          {imgUploadUrl ? (
            <>
              <img ref={imgNode} src={imgUploadUrl} crossOrigin="anonymous" alt="캔버스로 만들 이미지" />
            </>
          ) : (
            <>
              <DropZone {...getRootProps()}>
                <input {...getInputProps()} accept="image/*" />
                {isDragActive ? <p>드롭하시오!</p> : <p>이곳을 눌러 이미지를 첨부하거나 이곳으로 드롭하세용</p>}
              </DropZone>
            </>
          )}
        </ImageWrapper>

        <VersatileWrapper>
          <Versatile>
            <Button onClick={handleImgGoBack}>
              <UndoOutlined />
            </Button>
            <Upload accept="image/*" beforeUpload={handleImgUpload} showUploadList={false}>
              <Button>
                <DiffOutlined />
              </Button>
            </Upload>
            {imgResizeStart ? (
              <Button onClick={handleImgResizeEnd}>
                <ColumnWidthOutlined />
              </Button>
            ) : (
              <Button onClick={handleImgResizing}>
                <ColumnWidthOutlined />
              </Button>
            )}
            <Factory>
              <Popover
                style={{ padding: 0 }}
                trigger="click"
                placement="bottom"
                content={<ToolColorPalette type="bg" onChange={handleColorChange} />}
              >
                <Button>
                  <BgColorsOutlined />
                </Button>
              </Popover>

              {/* <ToolColorPalette type="frame" onChange={handleFrameColorChange} /> */}
            </Factory>
          </Versatile>
          <FrameWrapper
            title="정사각"
            children={paperSize.map((paper, index) => (
              <FrameSize key={index} data-value={paper.name} {...paper.size} onClick={handleFrameSelect}>
                <FrameSizeName>{paper.name}</FrameSizeName>
              </FrameSize>
            ))}
          />
          <CanvasInfomationWrapper>
            <div>
              <Button onClick={handleImgPreview}>미리보기 </Button>
              <Button type="primary" onClick={() => canvasToImage(selectedFrameList)}>
                저장
              </Button>
            </div>
            <BillInfomation>
              <FactoryTitle>
                예상 가격 <div>{framePrice.reduce((acc, cur) => (acc += cur.price), 0).toLocaleString()}원</div>
              </FactoryTitle>
            </BillInfomation>
          </CanvasInfomationWrapper>
        </VersatileWrapper>
      </ToolContainer>
    </>
  );
};

export default Tool;
