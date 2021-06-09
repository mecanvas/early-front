import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGetCursorPosition, useGetScollPosition, useGlobalState } from 'src/hooks';
import axios from 'axios';
import ToolColorPalette from './ToolColorPalette';
import {
  ToolContainer,
  YouSelectedFrame,
  ImageWrapper,
  VersatileWrapper,
  Factory,
  FactoryTitle,
  FrameWrapper,
  FrameSize,
  FrameSizeName,
  BillInfomation,
  DropZone,
  CanvasInfomationWrapper,
  DropZoneDiv,
  BackIcon,
  ImgControlelr,
} from './ToolStyle';
import { ColorResult } from 'react-color';
import { useDropzone } from 'react-dropzone';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, notification, Popover, Upload, Checkbox, Input } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { theme } from 'src/style/theme';
import { useRouter } from 'next/router';
import Loading from '../common/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faHome, faPaintRoller, faPlus, faUndo } from '@fortawesome/free-solid-svg-icons';
import ToolSave from './ToolSave';

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
  const router = useRouter();
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
  const [imgUploadLoading, setImgUploadLoading] = useState(false);

  const [originWidth, setOriginWidth] = useState(0);
  const [originHeight, setOriginHeight] = useState(0);
  const [resizeWidth, setResizeWidth] = useState(0);
  const [resizeHeight, setResizeHeight] = useState(0);
  const [ratioPersist, setRatioPersist] = useState(true);
  const [imgModalResizeOpen, setImgModalResizeOpen] = useState(false);
  const [canvasFramePositionList, setCanvasFramePositionList] = useState<CanvasFramePositionList[]>([]);
  const [selectedFrameList, setSelectedFrameList] = useState<HTMLCanvasElement[]>([]);
  const [yourSelectedFrame, setYourSelectedFrame] = useState<SelectedFrameInfo | null>(null);

  const youSelectedFrameRef = useRef<HTMLDivElement>(null);

  const [framePrice, setFramePrice] = useState<FramePrice[]>([]);

  const [isSaveCanvas, setIsSaveCanvas] = useGlobalState('saveModal', false);

  // 고른 액자의 이름과 수량
  const yourPriceList = useMemo(() => {
    return Object.entries(
      framePrice.reduce((acc: { [key: string]: any }, cur) => {
        const name = cur.name;
        if (!acc[name]) {
          acc[name] = { quantity: 1, price: cur.price };
          return acc;
        }
        acc[name].quantity++;
        return acc;
      }, {}),
    );
  }, [framePrice]);
  const [isPreview, setIsPreview] = useState(false);

  const handlePushMainPage = useCallback(() => {
    router.push('/');
  }, [router]);

  // 바뀌는 색상
  const [bgColor, setBgColor] = useState(theme.color.white);
  // const [frameBorderColor, setFrameBorderColor] = useState('#333');

  const [isResizeStart, setIsResizeStart] = useState(false);
  const [resizeCmd, setResizeCmd] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null>(null);
  const [isResizeMode, setIsResizeMode] = useState(false);

  const positioningImageResize = useCallback(
    (resizeCmd: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null, x: number, y: number) => {
      if (!imgNode.current) return;
      const { width, height, left, top, right } = imgNode.current.getBoundingClientRect();
      const absX = Math.abs(x - Math.ceil(left));
      const absY = Math.abs(height + Math.ceil(top - y));
      const absLeftX = Math.abs(x - Math.ceil(right));
      const absBottomY = Math.abs(y + height - (top + height)); // bottom - top <- 이거 풀어씀.
      let newWidth = width;
      let newHeight = height;
      switch (resizeCmd) {
        case 'bottom-right':
          newWidth = absX;
          newHeight = absBottomY;
          break;
        case 'top-right':
          newHeight = absY;
          newWidth = absX;
          break;
        case 'bottom-left':
          newWidth = absLeftX;
          newHeight = absBottomY;
          break;
        case 'top-left':
          newHeight = absY;
          newWidth = absLeftX;
          break;
        default:
          break;
      }

      imgNode.current.style.width = `${newWidth}px`;
      imgNode.current.style.height = `${newHeight}px`;
      setResizeWidth(newWidth);
      setResizeHeight(newHeight);
    },
    [],
  );

  const handleResizeMode = useCallback((e) => {
    e.stopPropagation();
    const { component } = e.currentTarget.dataset;
    if (component === 'wrapper') {
      return setIsResizeMode(false);
    }

    setIsResizeMode((prev) => !prev);
  }, []);

  const handleImgResize = useCallback(
    (e) => {
      if (!isResizeStart && !isResizeMode) return;
      if (imgNode.current) {
        if (e.type === 'touchmove') {
          const { clientX, clientY } = e.changedTouches[0];
          positioningImageResize(resizeCmd, clientX, clientY);
        }

        const { clientY, clientX } = e.nativeEvent;
        positioningImageResize(resizeCmd, clientX, clientY);
      }
    },
    [isResizeMode, isResizeStart, positioningImageResize, resizeCmd],
  );

  const handleImgResizeStart = useCallback((e) => {
    const { cmd } = e.currentTarget.dataset;
    setIsResizeStart(true);
    setResizeCmd(cmd);
  }, []);

  const handleImgResizeEnd = useCallback(() => {
    setIsResizeStart(false);
    setResizeCmd(null);
  }, []);

  // 이미지 업로드
  const handleImgReUpload = useCallback(
    async (file: RcFile) => {
      setImgUploadLoading(true);
      try {
        if (imgWrapperRef.current) {
          const fd = new FormData();
          fd.append('image', file);
          await axios.post('/canvas/img', fd).then((res) => setImgUploadUrl(res.data || ''));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setImgUploadLoading(false);
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
    setImgUploadLoading(true);
    try {
      if (imgWrapperRef.current) {
        const file = acceptedFiles[0];
        const fd = new FormData();
        fd.append('image', file);

        await axios.post('/canvas/img', fd).then((res) => setImgUploadUrl(res.data || ''));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setImgUploadLoading(false);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleImgDropUpload });

  const handleDeleteCanvas = useCallback(
    (e) => {
      if (imgWrapperRef.current) {
        const { current: imgBox } = imgWrapperRef;
        if (imgBox.childNodes.length <= 1) {
          if (!isPreview) {
            return;
          }
          if (imgBox.childNodes.length === 0) {
            return;
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
      if (imgBox.childNodes.length <= 2) {
        return notification.info({ message: '존재하는 액자가 없습니다.', placement: 'bottomLeft' });
      }
      const imgBoxId = +(imgBox.childNodes[0] as any).id;
      imgBox?.removeChild(imgBox.childNodes[0]);
      setFramePrice(framePrice.slice(1));
      setCanvasFramePositionList(canvasFramePositionList.filter((lst) => lst.id !== imgBoxId));
      setSelectedFrameList(selectedFrameList.filter((lst) => +lst.id !== imgBoxId));
    }
  }, [framePrice, canvasFramePositionList, selectedFrameList]);

  // 이미지 저장을 위한 캔버스 생성 (스프라이트 기법으로 이미지 저장은 안되기 때문에 품질이 깨지더라도 이 방법 사용합니다.)
  const createCanvasForSave = useCallback(
    (id: number) => {
      if (!youSelectedFrameRef.current || !imgNode.current || !selectedFrameInfo) return;

      const { name } = selectedFrameInfo;
      const { width: frameWidth, height: frameHeight } = youSelectedFrameRef.current.getBoundingClientRect();
      const { left, top } = imgNode.current.getBoundingClientRect();

      const image = imgNode.current;
      const oCanvas = document.createElement('canvas');
      oCanvas.id = id.toString();
      oCanvas.dataset.paper = name;
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
    [cursorX, cursorY, selectedFrameInfo, selectedFrameList],
  );

  const createImageCanvas = useCallback(
    (id: number) => {
      if (!youSelectedFrameRef.current || !imgNode.current) return;
      const { width: frameWidth, height: frameHeight } = youSelectedFrameRef.current.getBoundingClientRect();
      const { left, top, width, height } = imgNode.current.getBoundingClientRect();

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
      const canvasTopPosition = cursorY - frameHeight / 2;
      div.style.left = `${canvasLeftPosition + scrollX}px`;
      div.style.top = `${canvasTopPosition + scrollY}px`;
      div.setAttribute('data-originleft', `${canvasLeftPosition - left}`);
      div.setAttribute('data-origintop', `${canvasTopPosition - top}`);
      div.id = id.toString();

      // 크롭된 이미지 생성 (화질 구지 방지를 위해 스프라이트 기법 사용)
      const cropImage = new Image();
      cropImage.setAttribute(
        'style',
        `
        background-image : url(${imgUploadUrl});
        background-color : ${bgColor};
        background-repeat : no-repeat;
        background-size: ${width}px ${height}px; 
        background-position-x: ${-canvasLeftPosition + left}px;
        background-position-y: ${-canvasTopPosition + top}px;
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
    [handleDeleteCanvas, cursorX, cursorY, scrollX, scrollY, imgUploadUrl, bgColor, canvasFramePositionList],
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

  const handleModalResize = useCallback(() => {
    setImgModalResizeOpen((prev) => !prev);
  }, []);

  const handleModalResizeOk = useCallback(() => {
    if (imgNode.current) {
      imgNode.current.style.width = `${resizeWidth}px`;
      imgNode.current.style.height = `${resizeHeight}px`;
      setImgModalResizeOpen((prev) => !prev);
    }
  }, [resizeWidth, resizeHeight]);

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

  const handleSaveCanvas = useCallback(() => {
    setIsSaveCanvas(true);
  }, [setIsSaveCanvas]);

  // 액자 클릭시 움직이는 로직
  useEffect(() => {
    if (selectedFrame && yourSelectedFrame) {
      const { width, height } = yourSelectedFrame;
      const x = cursorX + scrollX - +width.replace('px', '') / 2;
      const y = cursorY + scrollY - +height.replace('px', '') / 2;
      setSelectedFramePosition({ left: `${x}px`, top: `${y}px` });
    }
  }, [selectedFrame, yourSelectedFrame, cursorX, cursorY, scrollX, scrollY]);

  useEffect(() => {
    if (imgNode.current) {
      imgNode.current.style.visibility = isPreview ? 'hidden' : 'visible';
    }
  }, [isPreview]);

  useEffect(() => {
    if (!imgUploadUrl) return;
    const el = imgNode.current;
    if (el) {
      el.style.width = '';
      el.style.height = '';
      el.src = imgUploadUrl;
      el.onload = () => {
        setOriginWidth(el.width);
        setOriginHeight(el.height);
        setResizeWidth(el.width);
        setResizeHeight(el.height);
      };
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

  useEffect(() => {
    if (isSaveCanvas) {
      setIsSaveCanvas(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <BackIcon type="primary" onClick={handlePushMainPage}>
        <FontAwesomeIcon style={{ fontSize: '18px' }} icon={faHome} fill={theme.color.white} />
      </BackIcon>

      {/* 사진 조절하는 툴바들 */}

      <Factory>
        <Button onClick={handleImgGoBack}>
          <FontAwesomeIcon icon={faUndo} />
        </Button>
        <Upload accept="image/*" beforeUpload={handleImgReUpload} showUploadList={false}>
          <Button>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </Upload>
        <Popover
          style={{ padding: 0 }}
          trigger="click"
          placement="bottom"
          content={<ToolColorPalette type="bg" onChange={handleColorChange} />}
        >
          <Button>
            <FontAwesomeIcon icon={faPaintRoller} />
          </Button>
        </Popover>
      </Factory>

      {<Loading loading={imgUploadLoading} />}
      <Modal
        visible={imgModalResizeOpen}
        onOk={handleModalResizeOk}
        onCancel={handleModalResize}
        title="이미지의 너비와 높이를 입력하세요."
      >
        <div>
          <form onChange={handleChangeImgSize}>
            <Input type="text" name="width" value={resizeWidth || ''} addonBefore="너비" addonAfter="px" />
            <Input type="text" name="height" value={resizeHeight || ''} addonBefore="높이" addonAfter="px" />
          </form>

          <div style={{ textAlign: 'right' }}>
            <Checkbox defaultChecked={ratioPersist} onChange={handleRatioPersist}>
              너비에 비율을 맞춥니다.
            </Checkbox>
          </div>
          <div style={{ textAlign: 'right', marginTop: '6px' }}>
            <Button onClick={handleResizeReset}>원래의 이미지 크기로 되돌립니다.</Button>
          </div>
        </div>
      </Modal>

      <ToolContainer>
        {selectedFrame && selectedFramePosition && yourSelectedFrame && (
          <YouSelectedFrame
            // border={frameBorderColor}
            ref={youSelectedFrameRef}
            onClick={handleFrameRelease}
            {...yourSelectedFrame}
            {...selectedFramePosition}
          ></YouSelectedFrame>
        )}

        <ImageWrapper
          imgUploadLoading={imgUploadLoading}
          id="img-box"
          data-component="wrapper"
          onClick={handleResizeMode}
          onMouseMove={handleImgResize}
          onTouchMove={handleImgResize}
          ref={imgWrapperRef}
          bgColor={bgColor}
          onMouseUp={handleImgResizeEnd}
          cmd={resizeCmd}
        >
          {imgUploadUrl ? (
            <>
              {isResizeStart && <small>{`${resizeWidth.toFixed()}px X ${resizeHeight.toFixed()}px`}</small>}
              <ImgControlelr data-layout="inner" isResizeStart={isResizeMode} cmd={resizeCmd}>
                <img
                  onMouseUp={handleImgResizeEnd}
                  onTouchStart={handleImgResizeEnd}
                  ref={imgNode}
                  src={imgUploadUrl}
                  crossOrigin="anonymous"
                  alt="캔버스로 만들 이미지"
                />
                {isResizeMode ? (
                  <>
                    <div data-cmd="top-left" onMouseDown={handleImgResizeStart} onTouchEnd={handleImgResizeStart}></div>
                    <div
                      data-cmd="top-right"
                      onMouseDown={handleImgResizeStart}
                      onTouchEnd={handleImgResizeStart}
                    ></div>
                    <div
                      data-cmd="bottom-left"
                      onMouseDown={handleImgResizeStart}
                      onTouchEnd={handleImgResizeStart}
                    ></div>
                    <div
                      data-cmd="bottom-right"
                      onMouseDown={handleImgResizeStart}
                      onTouchEnd={handleImgResizeStart}
                    ></div>
                    <span onClick={handleModalResize}>
                      <FontAwesomeIcon icon={faEdit} />
                    </span>
                  </>
                ) : (
                  <button type="button" onClick={handleResizeMode}></button>
                )}
              </ImgControlelr>
              <VersatileWrapper>
                <FrameWrapper
                  children={paperSize.map((paper, index) => (
                    <FrameSize key={index} data-value={paper.name} {...paper.size} onClick={handleFrameSelect}>
                      <FrameSizeName>{paper.name}</FrameSizeName>
                    </FrameSize>
                  ))}
                />
                <CanvasInfomationWrapper>
                  {/* 사용한 액자 x 수량 */}
                  <BillInfomation>
                    <div>
                      {yourPriceList.map(([key, value], index) => (
                        <div
                          style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 3px' }}
                          key={index}
                        >
                          <div>{key}</div>
                          <div>
                            {value.price.toLocaleString()} x {value.quantity}개
                          </div>
                        </div>
                      ))}
                    </div>
                    <FactoryTitle>
                      예상 가격 <div>{framePrice.reduce((acc, cur) => (acc += cur.price), 0).toLocaleString()}원</div>
                    </FactoryTitle>
                  </BillInfomation>
                  <div>
                    <Button onClick={handleImgPreview}>미리보기 </Button>
                    <Button type="primary" onClick={handleSaveCanvas}>
                      저장
                    </Button>
                    {isSaveCanvas && <ToolSave yourPriceList={yourPriceList} selectedFrameList={selectedFrameList} />}
                  </div>
                </CanvasInfomationWrapper>
              </VersatileWrapper>
            </>
          ) : (
            <ImageWrapper imgUploadLoading={imgUploadLoading}>
              <DropZone {...getRootProps()}>
                <input {...getInputProps()} accept="image/*" />
                <DropZoneDiv isDragActive={isDragActive}>
                  <PlusOutlined />
                  <p>이미지를 드롭하거나 첨부하세요!</p>
                </DropZoneDiv>
              </DropZone>
            </ImageWrapper>
          )}
        </ImageWrapper>
      </ToolContainer>
    </>
  );
};

export default Tool;
