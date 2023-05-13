import { faChevronCircleDown, faChevronCircleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Popover } from 'antd';
import Upload, { RcFile } from 'antd/lib/upload';
import { icons } from 'public/icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ColorResult } from 'react-color';
import ImageDropZone from 'src/components/common/ImageDropZone';
import Loading from 'src/components/common/Loading';
import SingleImgSizeController from 'src/components/tool/single/SingleImgSizeController';
import { HEADER_HEIGHT, frameSize } from 'src/constants';
import { PreventPageLeave } from 'src/hoc/PreventPageLeave';
import { useGlobalState } from 'src/hooks';
import { useProgress } from 'src/hooks/useProgress';
import { FramePrice, ResizeCmd } from 'src/interfaces/ToolInterface';
import { theme } from 'src/style/theme';
import { mockPostImageUpload } from 'src/utils';
import { cmToPx } from 'src/utils/cmToPx';
import { filterOverMaxHeight } from 'src/utils/filterOverMaxHeight';
import { getOriginRatio } from 'src/utils/getOriginRatio';
import { imgSizeChecker } from 'src/utils/imgSizeChecker';
import { replacePx } from 'src/utils/replacePx';
import ToolHeader from '../ToolHeader';
import ToolColorPalette from '../divided/DividedToolColorPalette';
import { FrameSizeName } from '../divided/DividedToolStyle';
import {
  FrameListGridHideButton,
  PreviewCanvasWrapper,
  SingleCanvasField,
  SingleFrameList,
  SingleFrameListGrid,
  SingleFrameListHeader,
  SingleImageWrapper,
  SingleSelectedFrame,
  SingleToolContainer,
  SingleToolFactory,
  SingleWrapper,
} from './SingleToolStyle';

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

  const [isResizeMode] = useGlobalState('isResizeMode', false);
  const [isPreview, setIsPreview] = useGlobalState<boolean>('isPreview');
  const [isPreviewDrawing, setIsPreviewDrawing] = useState(false);
  const [bgColor, setBgColor] = useState(theme.color.white);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragDrop, setIsDragDrop] = useState(false);

  const [isRotate, setIsRotate] = useState(false);

  const [, setToolType] = useGlobalState<'single' | 'divided'>('toolType', 'single');
  const [, setSelectedFrameList] = useGlobalState<HTMLCanvasElement[]>('selectedFrameList');
  const [isSaveCanvas, setIsSaveCanvas] = useGlobalState<boolean>('saveModal');
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
  const [singleImgUploadUrl, setSingleimgUploadUrl] = useGlobalState<string>('singleImgUploadUrl', '');
  const [isImgUploadLoading, setImgUploadLoading] = useState(false);
  const [isMovingImage, setIsMovingImage] = useState(false);
  const [xDiff, setXDiff] = useState(0);
  const [yDiff, setYDiff] = useState(0);
  const [isCalc, setIsCalc] = useState(false);

  const [singleFrameWidth, setSingleFrameWidth] = useState(0);
  const [singleFrameHeight, setSingleFrameHeight] = useState(0);

  const [frameAttributes, setFrameAttributes] = useState<any>('정방');
  const frameList = useMemo(() => frameSize().filter((lst) => lst.attribute === frameAttributes), [frameAttributes]);
  const [singlePrice, setSinglePrice] = useState(0);
  const [singleCanvasName, setSingleCanvasName] = useState('정방 S-1호');

  const checkRotate = useCallback(
    (originAxis: number, rotateAxis: number): number => {
      if (!isRotate) {
        return originAxis;
      }
      return rotateAxis;
    },
    [isRotate],
  );

  const getPosition = useCallback((event: any) => {
    if (event.type === 'touchmove') {
      const touchs = event.changedTouches[0];
      const x = touchs.clientX;
      const y = touchs.clientY;
      return [x, y];
    }
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

  const createCanvasForSave = useCallback(
    (canvasProps?: HTMLCanvasElement) => {
      if (!controllerNode || !resizeWidth || !resizeHeight || !originWidth || !originHeight) return;
      const singleFrameWidthByRotate = checkRotate(singleFrameWidth, singleFrameHeight);
      const singleFrameHeightByRotate = checkRotate(singleFrameHeight, singleFrameWidth);
      const left = (window.innerWidth - resizeWidth) / 2 + replacePx(controllerNode.style.left);
      const top = (window.innerHeight - resizeHeight) / 2 + replacePx(controllerNode.style.top);
      const frameLeft = (window.innerWidth - singleFrameWidthByRotate) / 2;
      const frameTop = (window.innerHeight - singleFrameHeightByRotate) / 2;
      const canvas = canvasProps || document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (ctx && singleImgUploadUrl) {
        const img = new Image();
        img.src = singleImgUploadUrl;
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          const scaleX = img.naturalWidth / resizeWidth;
          const scaleY = img.naturalHeight / resizeHeight;
          const cropX = frameLeft - left;
          const cropY = frameTop - top;

          const originFrameWidth = singleFrameWidthByRotate * scaleX;
          const originFrameHeight = singleFrameHeightByRotate * scaleY;
          const canvasFrameWidth = canvasProps ? singleFrameWidthByRotate : originFrameWidth;
          const canvasFrameHeight = canvasProps ? singleFrameHeightByRotate : originFrameHeight;

          // const pixelRatio = window.devicePixelRatio;
          canvas.width = canvasFrameWidth;
          canvas.height = canvasFrameHeight;
          canvas.setAttribute('data-paper', singleCanvasName);

          ctx.clearRect(0, 0, canvasFrameWidth, canvasFrameHeight);

          // ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(
            img,
            cropX * scaleX,
            cropY * scaleY,
            originFrameWidth,
            originFrameHeight,
            0,
            0,
            canvasFrameWidth,
            canvasFrameHeight,
          );

          // 배경을 칠합니다.
          ctx.globalCompositeOperation = 'destination-over';
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvasFrameWidth, canvasFrameHeight);
        };
      }
      if (!canvasProps) {
        return canvas;
      }
    },
    [
      controllerNode,
      resizeWidth,
      resizeHeight,
      originWidth,
      originHeight,
      singleFrameWidth,
      singleFrameHeight,
      singleImgUploadUrl,
      checkRotate,
      singleCanvasName,
      bgColor,
    ],
  );

  const createPreviewCanvas = useCallback(() => {
    createCanvasForSave(previewCanvasRef.current || undefined);
  }, [createCanvasForSave]);

  const handleColorChange = useCallback((color: ColorResult) => {
    const { hex } = color;
    setBgColor(hex);
    setIsPreviewDrawing(true);
  }, []);

  const handleFrameRotate = useCallback(() => {
    setIsRotate((prev) => !prev);
    setIsPreviewDrawing(true);
  }, []);

  const handleHorizontal = useCallback(() => {
    if (controllerNode) {
      controllerNode.style.top = `0`;
      setNearingCenterY(true);
      setTimeout(() => {
        setNearingCenterY(false);
      }, 300);
      setIsPreviewDrawing(true);
    }
  }, [controllerNode]);

  const handleVertical = useCallback(() => {
    if (controllerNode) {
      controllerNode.style.left = `0`;
      setNearingCenterX(true);
      setTimeout(() => {
        setNearingCenterX(false);
      }, 300);
      setIsPreviewDrawing(true);
    }
  }, [controllerNode]);

  const handleSelectFrame = useCallback(
    (e) => {
      const { width, height, price, name } = e.currentTarget.dataset;
      const myFrame = frameSize().filter((lst) => lst.name === name);
      setFramePrice(myFrame.map((lst) => ({ id: Date.now(), cm: lst.cm, name: lst.name, price: lst.price })));
      const calcWidth = replacePx(width) * 1.5;
      const calcHeight = replacePx(height) * 1.5;
      setSingleFrameWidth(calcWidth);
      setSingleFrameHeight(calcHeight);
      setSinglePrice(+price);
      setSingleCanvasName(`${myFrame[0].attribute} ${name}`);
      setIsPreviewDrawing(true);
    },
    [setFramePrice],
  );

  const handleGetFrameAttribute = useCallback((e) => {
    const { value } = e.currentTarget;
    if (value) {
      setFrameAttributes(value);
    }
  }, []);

  const checkNearingCenter = useCallback(
    (x: number, y: number) => {
      if (!controllerNode) return;
      if (1 >= Math.abs(x)) {
        controllerNode.style.left = `${0}px`;
        setNearingCenterX(true);
      } else {
        setNearingCenterX(false);
      }

      if (1 >= Math.abs(y)) {
        controllerNode.style.top = `${0}px`;
        setNearingCenterY(true);
      } else {
        setNearingCenterY(false);
      }
    },
    [controllerNode],
  );

  const handleToImageInWrapper = useCallback(
    (e) => {
      if (!controllerNode) return;
      const [cursorX, cursorY] = getPosition(e);
      const x = cursorX - window.innerWidth / 2;
      const y = cursorY - window.innerHeight / 2 - HEADER_HEIGHT;
      if (isCalc) {
        setXDiff(x - replacePx(controllerNode.style.left));
        setYDiff(y - replacePx(controllerNode.style.top));
        setIsCalc(false);
      }
      if (!isCalc) {
        controllerNode.style.position = 'relative';
        controllerNode.style.left = `${x - xDiff}px`;
        controllerNode.style.top = `${y - yDiff}px`;
        checkNearingCenter(x - xDiff, y - yDiff);
      }
    },

    [checkNearingCenter, controllerNode, getPosition, isCalc, xDiff, yDiff],
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

        await mockPostImageUpload(file, getProgressGage).then((res) => {
          setSingleimgUploadUrl(res || '');
        });
      } catch (err) {
        alert('이미지 업로드 실패, 다시 시도해 주세요.');
        console.error(err);
      } finally {
        setImgUploadLoading(false);
        setIsDragDrop(false);
      }
    },
    [getProgressGage, setSingleimgUploadUrl],
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

        await mockPostImageUpload(file, getProgressGage).then((res) => {
          setSingleimgUploadUrl(res || '');
        });
      } catch (err) {
        alert('이미지 업로드 실패, 다시 시도해 주세요.');
        console.error(err);
      } finally {
        setImgUploadLoading(false);
      }
    },
    [getProgressGage, imageDropUpload, setSingleimgUploadUrl],
  );

  const handleMoveSingleImage = useCallback(() => {
    setIsMovingImage(true);
    setIsCalc(true);
  }, []);

  const handleMoveCancelSingleImage = useCallback(() => {
    setIsMovingImage(false);
    setNearingCenterX(false);
    setNearingCenterY(false);
    setIsCalc(false);
    setIsPreviewDrawing(true);
  }, []);

  const drawingImage = useCallback(
    (resizeWidth?: number, resizeHeight?: number, url?: string) => {
      const imgCanvas = ImageCanvasRef.current;
      if (!imgCanvas || !wrapperWidth || !wrapperHeight) return;

      const imgCtx = imgCanvas.getContext('2d');
      if (imgCtx && singleImgUploadUrl) {
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
          setIsPreviewDrawing(true);
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
    if (isPreview) {
      setFrameListAnimation((prev) => ({
        ...prev,
        maxHeight: '0px',
        height: '0px',
        overflow: 'hidden',
        padding: '0em',
      }));
      setIsHideFrameList(true);
    } else {
      setFrameListAnimation((prev) => ({
        ...prev,
        maxHeight: '150px',
        height: '150px',
        overflow: 'auto',
        padding: '0.6em',
      }));
      setIsHideFrameList(false);
    }
  }, [isPreview]);

  useEffect(() => {
    if (isPreviewDrawing) {
      createPreviewCanvas();
      setIsPreviewDrawing(false);
    }
  }, [createPreviewCanvas, isPreviewDrawing]);

  useEffect(() => {
    drawingImage();
    if (controllerNode) {
      controllerNode.style.position = 'relative';
      controllerNode.style.left = `${0}px`;
      controllerNode.style.top = `${0}px`;
    }
  }, [singleImgUploadUrl, wrapperWidth, wrapperHeight, drawingImage, controllerNode]);

  useEffect(() => {
    if (isSaveCanvas) {
      const imgCanvas = createCanvasForSave();
      setSelectedFrameList(imgCanvas ? [imgCanvas] : []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaveCanvas]);

  useEffect(() => {
    if (isResizeMode) {
      createPreviewCanvas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResizeMode]);

  useEffect(() => {
    setToolType('single');
    const sCanvasWrapper = singleWrapperRef.current;
    if (!sCanvasWrapper) return;

    const { width, height } = sCanvasWrapper.getBoundingClientRect();
    setWrapperWidth(width);
    setWrapperHeight(height);
    createInitFrame();

    return () => {
      setIsPreview(false);
      setFramePrice([]);
      setSelectedFrameList([]);
      setBgColor(theme.color.gray200);
      setSingleimgUploadUrl('');
      setIsSaveCanvas(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <SingleToolContainer>
        <Loading loading={isImgUploadLoading} progressPercentage={progressPercentage} />
        <ToolHeader
          imgUrl={singleImgUploadUrl || ''}
          singlePrice={singlePrice.toLocaleString()}
          singleCanvasName={singleCanvasName}
        />
        <SingleToolFactory>
          <Button type="text"></Button>
          <Upload accept="image/*" beforeUpload={handleSingleImgUpload} showUploadList={false}>
            <Button type="text">
              <img src={icons.imgUpload} style={{ width: '22px' }} />
            </Button>
          </Upload>
          <Button type="text" onClick={handleFrameRotate}>
            <img src={icons.rotate} />
          </Button>
          <Button type="text" onClick={handleHorizontal}>
            <img src={icons.horizontal} />
          </Button>

          <Button type="text" onClick={handleVertical}>
            <img src={icons.vertical} />
          </Button>
          <Popover
            style={{ padding: 0 }}
            trigger="click"
            placement="bottom"
            content={<ToolColorPalette type="bg" onChange={handleColorChange} />}
          >
            <Button type="text">
              <img src={icons.bgPaint} />
            </Button>
          </Popover>

          <Button type="text" onClick={handleRatioForFrame}>
            <img src={icons.auto} />
          </Button>
          <Button type="text" onClick={handleImgRatioSetting}>
            <img src={icons.ratioFrame} style={{ width: '24px' }} />
          </Button>
        </SingleToolFactory>

        {/* 액자 리스트 선택 */}
        {singleImgUploadUrl && (
          <SingleFrameListHeader>
            <div>
              <Button
                type={frameAttributes === '정방' ? 'primary' : 'text'}
                onClick={handleGetFrameAttribute}
                value="정방"
              >
                정방
              </Button>
              <Button
                type={frameAttributes === '인물' ? 'primary' : 'text'}
                onClick={handleGetFrameAttribute}
                value="인물"
              >
                인물
              </Button>
              <Button
                type={frameAttributes === '풍경' ? 'primary' : 'text'}
                onClick={handleGetFrameAttribute}
                value="풍경"
              >
                풍경
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
                  <SingleFrameList
                    {...lst.size}
                    rotate={isRotate}
                    clicked={`${frameAttributes} ${lst.name}` === singleCanvasName}
                  >
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
        )}

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
            onDragOver={handleDragImage}
            onMouseMove={isMovingImage ? handleToImageInWrapper : undefined}
            onMouseUp={isMovingImage ? handleMoveCancelSingleImage : undefined}
            onMouseLeave={isDragDrop ? handleDragCancel : handleMoveCancelSingleImage}
            onTouchMove={isMovingImage ? handleToImageInWrapper : undefined}
            onTouchEnd={isMovingImage ? handleMoveCancelSingleImage : undefined}
          >
            {/* 선택한 액자 렌더링  */}
            <SingleSelectedFrame
              rotate={isRotate}
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
                height={`calc(100vh - 86px)`}
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
                    onTouchStart={handleMoveSingleImage}
                    onTouchEnd={isMovingImage ? handleMoveCancelSingleImage : undefined}
                    onMouseDown={handleMoveSingleImage}
                    onMouseUp={isMovingImage ? handleMoveCancelSingleImage : undefined}
                  />
                </SingleImgSizeController>
              </SingleImageWrapper>
            )}
          </SingleWrapper>
        </SingleCanvasField>
      </SingleToolContainer>
    </>
  );
};

export default PreventPageLeave(SingleTool);
