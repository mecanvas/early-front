import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ToolHeader from '../ToolHeader';
import { Button, Popover } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { imgSizeChecker } from 'src/utils/imgSizeChecker';
import axios from 'axios';
import { useProgress } from 'src/hooks/useProgress';
import Loading from 'src/components/common/Loading';
import Upload, { RcFile } from 'antd/lib/upload';
import {
  faAlignCenter,
  faChevronCircleDown,
  faChevronCircleUp,
  faCompress,
  faPalette,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import SingleImgSizeController from 'src/components/tool/single/SingleImgSizeController';
import { useGlobalState } from 'src/hooks';
import { FramePrice, ResizeCmd } from 'src/interfaces/ToolInterface';
import { getOriginRatio } from 'src/utils/getOriginRatio';
import { filterOverMaxHeight } from 'src/utils/filterOverMaxHeight';
import { frameSize, HEADER_HEIGHT } from 'src/constants';
import { FrameSizeName } from '../divided/DividedToolStyle';
import { replacePx } from 'src/utils/replacePx';
import { cmToPx } from 'src/utils/cmToPx';
import { FullscreenOutlined } from '@ant-design/icons';
import {
  SingleToolContainer,
  SingleToolFactory,
  SingleFrameListHeader,
  SingleFrameListGrid,
  SingleFrameList,
  FrameListGridHideButton,
  PreviewCanvasWrapper,
  SingleCanvasField,
  SingleWrapper,
  SingleSelectedFrame,
  SingleImageWrapper,
} from './SingleToolStyle';
import ToolColorPalette from '../divided/DividedToolColorPalette';
import { theme } from 'src/style/theme';
import { ColorResult } from 'react-color';
import ImageDropZone from 'src/components/common/ImageDropZone';

const SingleTool = () => {
  const singleWrapperRef = useRef<HTMLDivElement>(null);
  const singleSelectedFrameRef = useRef<HTMLDivElement>(null);
  const ImageCanvasRef = useRef<HTMLCanvasElement>(null);
  const [controllerNode, setControllerNode] = useState<HTMLDivElement | null>(null);
  const [isHideFrameList, setIsHideFrameList] = useState(false);
  const [frameListAnimation, setFrameListAnimation] = useState({
    maxHeight: '150px',
    overflow: 'auto',
    height: '150px',
    padding: '0.6em',
  });

  const handleHideFrameList = useCallback(() => {
    if (!isHideFrameList) {
      setFrameListAnimation((prev) => ({
        ...prev,
        maxHeight: '0px',
        height: '0px',
        overflow: 'hidden',
        padding: '0em',
      }));
    } else {
      setFrameListAnimation((prev) => ({
        ...prev,
        maxHeight: '150px',
        height: '150px',
        overflow: 'auto',
        padding: '0.6em',
      }));
    }

    setIsHideFrameList((prev) => !prev);
  }, [isHideFrameList]);

  const controllerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    setControllerNode(node);
  }, []);

  const [isPreview] = useGlobalState<boolean>('isPreview');
  const [bgColor, setBgColor] = useState(theme.color.white);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragDrop, setIsDragDrop] = useState(false);

  const [, setSelectedFrameList] = useGlobalState<HTMLCanvasElement[]>('selectedFrameList');
  const [isSaveCanvas] = useGlobalState<boolean>('saveModal');
  const [, setFramePrice] = useGlobalState<FramePrice[]>('framePrice');
  const [resizeWidth, setResizeWidth] = useGlobalState<number>('resizeWidth');
  const [resizeHeight, setResizeHeight] = useGlobalState<number>('resizeHeight');
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const [wrapperHeight, setWrapperHeight] = useState(0);
  const [originWidth, setOriginWidth] = useState<number>(0);
  const [originHeight, setOriginHeight] = useState<number>(0);
  const [resizeCmd] = useGlobalState<ResizeCmd>('resizeCmd');
  const [nearingCenterX, setNearingCenterX] = useState<boolean>(false);
  const [nearingCenterY, setNearingCenterY] = useState<boolean>(false);

  const { getProgressGage, progressPercentage } = useProgress();
  const [singleImgUploadUrl, setSingleimgUploadUrl] = useState('');
  const [isImgUploadLoading, setImgUploadLoading] = useState(false);
  const [isMovingImage, setIsMovingImage] = useState(false);

  const [singleFrameWidth, setSingleFrameWidth] = useState(0);
  const [singleFrameHeight, setSingleFrameHeight] = useState(0);

  const [frameAttributes, setFrameAttributes] = useState<any>('정방');
  const frameList = useMemo(() => frameSize().filter((lst) => lst.attribute === frameAttributes), [frameAttributes]);
  const [singlePrice, setSinglePrice] = useState(0);
  const [singleCanvasName, setSingleCanvasName] = useState('정방 S-1호');

  const getPosition = useCallback((event: MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;
    return [x, y];
  }, []);

  const createInitFrame = useCallback(() => {
    // 정방 s-1호로 초기 생성
    setSingleFrameWidth(cmToPx(16) * 1.5);
    setSingleFrameHeight(cmToPx(16) * 1.5);
    const myFrame = frameSize().filter((lst) => lst.name === 'S-1호');
    setFramePrice(myFrame.map((lst) => ({ id: Date.now(), cm: lst.cm, name: lst.name, price: lst.price })));
    setSinglePrice(myFrame[0].price);
    setSingleCanvasName(`${myFrame[0].attribute} ${myFrame[0].name}`);
  }, [setFramePrice]);

  const createPreviewCanvas = useCallback(() => {
    if (!controllerNode || !resizeWidth || !resizeHeight || !previewCanvasRef.current || !originWidth || !originHeight)
      return;

    const left = (window.innerWidth - resizeWidth) / 2 + replacePx(controllerNode.style.left);
    const top = (window.innerHeight - resizeHeight) / 2 + replacePx(controllerNode.style.top);
    const frameLeft = (window.innerWidth - singleFrameWidth) / 2;
    const frameTop = (window.innerHeight - singleFrameHeight) / 2;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const img = new Image();
      img.src = singleImgUploadUrl;
      img.onload = () => {
        const scaleX = originWidth / resizeWidth;
        const scaleY = originHeight / resizeHeight;
        const cropX = frameLeft - left;
        const cropY = frameTop - top;

        // const pixelRatio = window.devicePixelRatio;
        canvas.width = singleFrameWidth;
        canvas.height = singleFrameHeight;
        ctx.clearRect(0, 0, singleFrameWidth, singleFrameHeight);

        // ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(
          img,
          cropX * scaleX,
          cropY * scaleY,
          singleFrameWidth * scaleX,
          singleFrameHeight * scaleY,
          0,
          0,
          singleFrameWidth,
          singleFrameHeight,
        );

        // 배경을 칠합니다.
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, singleFrameWidth, singleFrameHeight);
      };
    }
  }, [
    bgColor,
    controllerNode,
    originHeight,
    originWidth,
    resizeHeight,
    resizeWidth,
    singleFrameHeight,
    singleFrameWidth,
    singleImgUploadUrl,
  ]);

  const handleColorChange = useCallback(
    (color: ColorResult) => {
      const { hex } = color;
      setBgColor(hex);
    },
    [setBgColor],
  );

  const handleHorizontal = useCallback(() => {
    if (controllerNode) {
      controllerNode.style.top = `0`;
    }
  }, [controllerNode]);

  const handleVertical = useCallback(() => {
    if (controllerNode) {
      controllerNode.style.left = `0`;
    }
  }, [controllerNode]);

  const handleSelectFrame = useCallback(
    (e) => {
      const { width, height, price, name } = e.currentTarget.dataset;
      const myFrame = frameSize().filter((lst) => lst.name === name);
      setFramePrice(myFrame.map((lst) => ({ id: Date.now(), cm: lst.cm, name: lst.name, price: lst.price })));
      setSingleFrameWidth(replacePx(width) * 1.5);
      setSingleFrameHeight(replacePx(height) * 1.5);
      setSinglePrice(+price);
      setSingleCanvasName(`${myFrame[0].attribute} ${name}`);
    },
    [setFramePrice],
  );

  const handleGetFrameAttribute = useCallback((e) => {
    const { value } = e.currentTarget;
    if (value) {
      setFrameAttributes(value);
    }
  }, []);

  const handleToImageInWrapper = useCallback(
    (e) => {
      if (!controllerNode || !singleWrapperRef.current) return;
      const [cursorX, cursorY] = getPosition(e);
      const { height } = singleWrapperRef.current.getBoundingClientRect();

      const x = cursorX - window.innerWidth / 2;
      const y = cursorY - height / 2 - HEADER_HEIGHT;

      if (0.5 >= Math.abs(x)) {
        setNearingCenterX(true);
      } else {
        setNearingCenterX(false);
      }

      if (0.5 >= Math.abs(y)) {
        setNearingCenterY(true);
      } else {
        setNearingCenterY(false);
      }

      controllerNode.style.position = 'relative';
      controllerNode.style.left = `${x}px`;
      controllerNode.style.top = `${y}px`;
    },
    [controllerNode, getPosition],
  );

  const imageDropUpload = useCallback(
    async (acceptedFiles) => {
      if (!acceptedFiles[0].type.includes('image')) {
        return alert('이미지 파일이 아닌건 지원하지 않습니다.');
      }

      if (!imgSizeChecker(acceptedFiles[0])) return;

      setImgUploadLoading(true);
      try {
        const file = acceptedFiles[0];
        const fd = new FormData();
        fd.append('image', file);

        await axios
          .post('/canvas/img', fd, {
            onUploadProgress: getProgressGage,
          })
          .then((res) => {
            setSingleimgUploadUrl(res.data || '');
          });
      } catch (err) {
        alert('이미지 업로드 실패, 괜찮아 다시 시도 ㄱㄱ, 3번시도 부탁');
        console.error(err);
      } finally {
        setImgUploadLoading(false);
        setIsDragDrop(false);
      }
    },
    [getProgressGage],
  );

  const handleDragCancel = useCallback(() => {
    setIsDragDrop(false);
  }, []);

  const handleDragImage = useCallback(() => {
    setIsDragDrop(true);
  }, []);

  const handleSingleImgUpload = useCallback(
    async (file: RcFile | any) => {
      if (file instanceof File === false) {
        // 드롭 로직
        imageDropUpload(file);
        return;
      }
      if (!file.type.includes('image')) {
        return alert('이미지 파일이 아닌건 지원하지 않습니다.');
      }

      if (!imgSizeChecker(file)) return;

      setImgUploadLoading(true);
      try {
        const fd = new FormData();
        fd.append('image', file);

        await axios
          .post('/canvas/img', fd, {
            onUploadProgress: getProgressGage,
          })
          .then((res) => {
            setSingleimgUploadUrl(res.data || '');
          });
      } catch (err) {
        alert('이미지 업로드 실패, 괜찮아 다시 시도 ㄱㄱ, 3번시도 부탁');
        console.error(err);
      } finally {
        setImgUploadLoading(false);
      }
    },
    [getProgressGage, imageDropUpload],
  );

  const handleMoveSingleImage = useCallback((e) => {
    e.preventDefault();
    setIsMovingImage(true);
  }, []);

  const handleMoveCancelSingleImage = useCallback(() => {
    setIsMovingImage(false);
    setNearingCenterX(false);
    setNearingCenterY(false);
  }, []);

  const drawingImage = useCallback(
    (resizeWidth?: number, resizeHeight?: number, url?: string) => {
      const imgCanvas = ImageCanvasRef.current;
      if (!imgCanvas || !wrapperWidth || !wrapperHeight) return;

      const imgCtx = imgCanvas.getContext('2d');
      if (imgCtx) {
        const img = new Image();
        img.src = url || singleImgUploadUrl;
        img.onload = () => {
          const { naturalWidth, naturalHeight } = img;
          setOriginWidth(naturalWidth);
          setOriginHeight(naturalHeight);
          const [w, h] = getOriginRatio(
            naturalWidth,
            naturalHeight,
            resizeWidth || singleFrameWidth || wrapperWidth,
            resizeHeight || singleFrameHeight || wrapperHeight,
          );
          imgCanvas.width = w;
          imgCanvas.height = filterOverMaxHeight(h);
          setResizeWidth(w);
          setResizeHeight(filterOverMaxHeight(h));
          imgCtx.clearRect(0, 0, wrapperWidth, wrapperHeight);
          imgCtx.imageSmoothingQuality = 'high';
          imgCtx.drawImage(img, 0, 0, w, filterOverMaxHeight(h));
        };
      }
    },
    [
      setResizeHeight,
      setResizeWidth,
      singleFrameHeight,
      singleFrameWidth,
      singleImgUploadUrl,
      wrapperHeight,
      wrapperWidth,
    ],
  );

  const handleImgRatioSetting = useCallback(() => {
    if (!ImageCanvasRef.current || !controllerNode) return;
    const canvas = ImageCanvasRef.current;
    const {
      width,
      height,
      dataset: { url },
    } = canvas;
    const [w, h] = getOriginRatio(originWidth, originHeight, width, height);
    drawingImage(w, h, url);
  }, [controllerNode, drawingImage, originHeight, originWidth]);

  const handleRatioForFrame = useCallback(() => {
    const [w, h] = getOriginRatio(originWidth, originHeight, singleFrameWidth, singleFrameHeight);
    drawingImage(w, h);
    if (controllerNode) {
      controllerNode.style.position = 'relative';
      controllerNode.style.left = `${0}px`;
      controllerNode.style.top = `${0}px`;
    }
  }, [controllerNode, drawingImage, originHeight, originWidth, singleFrameHeight, singleFrameWidth]);

  useEffect(() => {
    if (isSaveCanvas) {
      const imgCanvas = ImageCanvasRef.current;
      setSelectedFrameList(imgCanvas ? [imgCanvas] : []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaveCanvas]);

  useEffect(() => {
    drawingImage();
    if (controllerNode) {
      controllerNode.style.position = 'relative';
      controllerNode.style.left = `${0}px`;
      controllerNode.style.top = `${0}px`;
    }
  }, [singleImgUploadUrl, wrapperWidth, wrapperHeight, drawingImage, controllerNode]);

  useEffect(() => {
    if (isPreview) {
      createPreviewCanvas();
    }
  }, [createPreviewCanvas, isPreview]);

  useEffect(() => {
    const sCanvasWrapper = singleWrapperRef.current;
    if (!sCanvasWrapper) return;

    const { width, height } = sCanvasWrapper.getBoundingClientRect();
    setWrapperWidth(width);
    setWrapperHeight(height);
    createInitFrame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SingleToolContainer>
      <Loading loading={isImgUploadLoading} progressPercentage={progressPercentage} />
      <ToolHeader singlePrice={singlePrice.toLocaleString()} singleCanvasName={singleCanvasName} />
      <SingleToolFactory>
        <Button type="text" onClick={handleHorizontal}>
          <FontAwesomeIcon icon={faAlignCenter} />
          <small>수평</small>
        </Button>

        <Button type="text" onClick={handleVertical}>
          <FontAwesomeIcon icon={faAlignCenter} />
          <small>수직</small>
        </Button>
        <Popover
          style={{ padding: 0 }}
          trigger="click"
          placement="bottom"
          content={<ToolColorPalette type="bg" onChange={handleColorChange} />}
        >
          <Button type="text">
            <FontAwesomeIcon icon={faPalette} />
            <small>배경</small>
          </Button>
        </Popover>
        <Button type="text" onClick={handleRatioForFrame}>
          <FullscreenOutlined />
          <small>액자에 끼우기</small>
        </Button>
        <Button type="text" onClick={handleImgRatioSetting}>
          <FontAwesomeIcon icon={faCompress} />
          <small>비율 맞추기</small>
        </Button>
        <Upload accept="image/*" beforeUpload={handleSingleImgUpload} showUploadList={false}>
          <Button type="text">
            <FontAwesomeIcon icon={faUpload} />
            <small>가져오기</small>
          </Button>
        </Upload>
      </SingleToolFactory>

      {/* 액자 리스트 선택 */}
      <SingleFrameListHeader>
        <div>
          <Button type="text" onClick={handleGetFrameAttribute} value="정방">
            <FontAwesomeIcon icon={faSquare} />
            <small>정방</small>
          </Button>
          <Button type="text" onClick={handleGetFrameAttribute} value="인물">
            <FontAwesomeIcon icon={faSquare} />
            <small>인물</small>
          </Button>
          <Button type="text" onClick={handleGetFrameAttribute} value="해경">
            <FontAwesomeIcon icon={faSquare} />
            <small>해경</small>
          </Button>
          <Button type="text" onClick={handleGetFrameAttribute} value="풍경">
            <FontAwesomeIcon icon={faSquare} />
            <small>풍경</small>
          </Button>
        </div>

        <SingleFrameListGrid {...frameListAnimation}>
          {frameList.map((lst, index) => (
            <div
              key={index}
              data-width={lst.size.width}
              data-height={lst.size.height}
              data-price={lst.price}
              data-name={lst.name}
              onClick={handleSelectFrame}
            >
              <SingleFrameList {...lst.size}>
                <FrameSizeName>{lst.name}</FrameSizeName>
              </SingleFrameList>
              <small>{lst.cm}</small>
            </div>
          ))}
        </SingleFrameListGrid>

        <FrameListGridHideButton onClick={handleHideFrameList}>
          <FontAwesomeIcon icon={isHideFrameList ? faChevronCircleDown : faChevronCircleUp} />{' '}
          <small>{isHideFrameList ? '펼치기' : '접기'}</small>
        </FrameListGridHideButton>
      </SingleFrameListHeader>

      {/* 본격적인 툴  */}
      <PreviewCanvasWrapper isPreview={isPreview || false}>
        <canvas ref={previewCanvasRef} />
      </PreviewCanvasWrapper>
      <SingleCanvasField isPreview={isPreview || false} onDragOver={handleDragImage} onMouseLeave={handleDragCancel}>
        <SingleWrapper
          nearingCenterX={nearingCenterX}
          nearingCenterY={nearingCenterY}
          cmd={resizeCmd ?? null}
          ref={singleWrapperRef}
          clicked={isMovingImage}
          onMouseMove={isMovingImage ? handleToImageInWrapper : undefined}
          onMouseUp={handleMoveCancelSingleImage}
          onMouseLeave={handleMoveCancelSingleImage}
        >
          {/* 선택한 액자 렌더링  */}
          <SingleSelectedFrame
            bgColor={bgColor}
            isImgUploadUrl={singleImgUploadUrl ? true : false}
            ref={singleSelectedFrameRef}
            width={singleFrameWidth}
            height={singleFrameHeight}
          >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </SingleSelectedFrame>
          {!singleImgUploadUrl || isDragDrop ? (
            <ImageDropZone
              isDragDrop={isDragDrop}
              width={'100%'}
              height={`calc(100vh - 80px)`}
              onDrop={handleSingleImgUpload}
            />
          ) : null}

          {/* 첨부한 이미지 렌더링 */}
          {singleImgUploadUrl && (
            <SingleImageWrapper clicked={isMovingImage}>
              <SingleImgSizeController
                controllerRef={(node) => controllerRef(node)}
                isMovingImage={isMovingImage}
                imgRef={ImageCanvasRef}
                wrapperRef={singleWrapperRef}
              >
                <canvas
                  data-url={singleImgUploadUrl}
                  ref={ImageCanvasRef}
                  onMouseDown={handleMoveSingleImage}
                  onMouseUp={handleMoveCancelSingleImage}
                />
              </SingleImgSizeController>
            </SingleImageWrapper>
          )}
        </SingleWrapper>
      </SingleCanvasField>
    </SingleToolContainer>
  );
};

export default SingleTool;
