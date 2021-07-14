import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGetScollPosition, useGlobalState } from 'src/hooks';
import axios from 'axios';
import {
  ToolContainer,
  ImageWrapper,
  ImgController,
  CroppedWrapper,
  PreviewBg,
  ToolHeaderWrapper,
} from './DividedToolStyle';
import { Button } from 'antd';
import { theme } from 'src/style/theme';
import Loading from '../../common/Loading';
import { cmToPx } from 'src/utils/cmToPx';
import { filterOverMaxHeight } from 'src/utils/filterOverMaxHeight';
import ToolFrameList from './DividedToolFrameList';
import {
  FrameSize,
  CanvasPosition,
  FramePrice,
  CanvasFrameSizeInfo,
  ResizeCmd,
  CroppedFrame,
} from 'src/interfaces/ToolInterface';
import { imgSizeChecker } from 'src/utils/imgSizeChecker';
import ToolSelectedFrame from './DividedToolSelectedFrame';
import { ImgToDataURL } from 'src/utils/ImgToDataURL';
import { replacePx } from 'src/utils/replacePx';
import { useProgress } from 'src/hooks/useProgress';
import ToolHeader from '../ToolHeader';
import DividedToolFactory from './DividedToolFactory';
import { HEADER_HEIGHT } from 'src/constants';
import ImageDropZone from 'src/components/common/ImageDropZone';
import BgPreview from 'public/bg1.jpg';
import { getOriginRatio } from 'src/utils/getOriginRatio';

const Tool = () => {
  const [changeVertical, setChangeVertical] = useState(false);

  const frameSize = useMemo<FrameSize[]>(
    () => [
      {
        name: 'S-1호',
        attribute: '정방',
        cm: '16cm X 16cm',
        size: {
          width: `${cmToPx(16)}px`,
          height: `${cmToPx(16)}px`,
        },
        price: 55000,
      },
      {
        name: 'S-2호',
        attribute: '정방',
        cm: '19cm X 19cm',
        size: {
          width: `${cmToPx(19)}px`,
          height: `${cmToPx(19)}px`,
        },
        price: 40000,
      },
      {
        name: 'S-4호',
        attribute: '정방',
        cm: '24cm X 24cm',
        size: {
          width: `${cmToPx(24)}px`,
          height: `${cmToPx(24)}px`,
        },
        price: 30000,
      },
      {
        name: 'P-2호',
        attribute: '풍경',
        cm: !changeVertical ? '16cm X 25.8cm' : '25.8cm X 16cm',
        size: {
          width: `${cmToPx(!changeVertical ? 16 : 25.8)}px`,
          height: `${cmToPx(!changeVertical ? 25.8 : 16)}px`,
        },
        price: 30000,
      },
      {
        name: 'P-4호',
        attribute: '풍경',
        cm: !changeVertical ? '21.2cm X 33.3cm' : '33.3cm X 21.2cm',
        size: {
          width: `${cmToPx(!changeVertical ? 21.2 : 33.3)}px`,
          height: `${cmToPx(!changeVertical ? 33.3 : 21.2)}px`,
        },
        price: 30000,
      },
      {
        name: 'F-2호',
        attribute: '인물',
        cm: !changeVertical ? '18cm X 25.8cm' : '25.8cm X 18cm',
        size: {
          width: `${cmToPx(!changeVertical ? 18 : 25.8)}px`,
          height: `${cmToPx(!changeVertical ? 25.8 : 18)}px`,
        },
        price: 40000,
      },
      {
        name: 'F-4호',
        attribute: '인물',
        cm: !changeVertical ? '24cm X 33.3cm' : '33.3cm X 24cm',
        size: {
          width: `${cmToPx(!changeVertical ? 24 : 33.3)}px`,
          height: `${cmToPx(!changeVertical ? 33.3 : 24)}px`,
        },
        price: 40000,
      },
      {
        name: 'M-4호',
        attribute: '해경',
        cm: !changeVertical ? '19cm X 33.3cm' : '33.3cm X 19cm',
        size: {
          width: `${cmToPx(!changeVertical ? 19 : 33.3)}px`,
          height: `${cmToPx(!changeVertical ? 33.3 : 19)}px`,
        },
        price: 30000,
      },
    ],
    [changeVertical],
  );

  const { getProgressGage, progressPercentage } = useProgress();

  const [isNoContent, setIsNoContent] = useGlobalState<boolean>('isNoContent', false);
  const [isDragDrop, setIsDragDrop] = useState(false);
  const [isSelectFrame, setIsSelectFrame] = useState(false); // 골랐는지 상태 여부
  const [selectedFrameInfo, setSelectedFrameInfo] = useState<FrameSize | null>(null); // 고른 액자의 정보 (스타일 + 이름)
  const [canvasPosition] = useGlobalState<CanvasPosition>('canvasPosition');
  const [canvasFrameSizeInfo] = useGlobalState<CanvasFrameSizeInfo>('canvasFrameSizeInfo');
  const [framePreviewMode, setFramePreviewMode] = useState<CanvasPosition | null>(null);
  const [scrollX, scrollY] = useGetScollPosition();

  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const imgNode = useRef<HTMLImageElement>(null);
  const previewBgRef = useRef<HTMLImageElement>(null);

  const [imgUploadUrl, setImgUploadUrl] = useGlobalState<string>('imgUploadUrl', '');
  const [imgUploadLoading, setImgUploadLoading] = useGlobalState<boolean>('imgUploadLoading', false);
  const [isSaveCanvas, setIsSaveCanvas] = useGlobalState('saveModal', false);

  const [, setOriginWidth] = useGlobalState<number>('originWidth', 0);
  const [, setOriginHeight] = useGlobalState<number>('originHeight', 0);
  const [resizeWidth, setResizeWidth] = useGlobalState<number>('resizeWidth', 0);
  const [resizeHeight, setResizeHeight] = useGlobalState<number>('resizeHeight', 0);

  const [croppedList, setCroppedList] = useState<CroppedFrame[]>([]);
  const [selectedFrameList, setSelectedFrameList] = useGlobalState<HTMLCanvasElement[]>('selectedFrameList', []);
  const [framePrice, setFramePrice] = useGlobalState<FramePrice[]>('framePrice', []);
  const [yourSelectedFrame, setYourSelectedFrame] = useState<CanvasFrameSizeInfo | null>(null);

  // 눈금 간격 라인 표시
  const [isGridGuideLine] = useGlobalState<boolean>('isGridGuideLine', false);
  const [gridGuideLine, setGridGuideLine] = useState<any[]>([]);
  const [gridWidth, setGridWidth] = useState(0);
  const [gridHeight, setGridHeight] = useState(0);

  // 액자 사이즈들 변경
  const [frameAttribute] = useGlobalState<'정방' | '해경' | '인물' | '풍경'>('frameAttribute', '정방');

  // 가운데 근접 컨트롤
  const [, setCenterX] = useGlobalState<number>('centerX', 0);
  const [, setCenterY] = useGlobalState<number>('centerY', 0);
  const [, setIsNearingX] = useGlobalState<boolean>('isNearingX');
  const [, setIsNearingY] = useGlobalState<boolean>('isNearingY');
  const [, setIsFitX] = useGlobalState<boolean>('isFitX');
  const [, setIsFitY] = useGlobalState<boolean>('isFitY');

  // 미리보기
  const [isPreview, setIsPreview] = useGlobalState<boolean>('isPreview', false);

  // 바뀌는 색상
  const [bgColor, setBgColor] = useGlobalState<string>('bgColor', theme.color.gray100);
  // const [frameBorderColor, setFrameBorderColor] = useState('#333');

  // 이미지 크기 조절
  const [isResizeMode, setIsResizeMode] = useGlobalState('isResizeMode', false);
  const [isResizeStart, setIsResizeStart] = useState(false);
  const [resizeCmd, setResizeCmd] = useState<ResizeCmd | null>(null);

  const handleChangeVertical = useCallback(() => {
    setChangeVertical((prev) => !prev);
  }, []);

  const positioningImageResize = useCallback(
    (resizeCmd: ResizeCmd | null, x: number, y: number) => {
      if (!imgNode.current) return;
      const { width, height, left, top, right } = imgNode.current.getBoundingClientRect();
      const absX = Math.abs(x - Math.ceil(left));
      const absY = Math.abs(height + Math.ceil(top - y));
      const absLeftX = Math.abs(x - Math.ceil(right));
      const absBottomY = Math.abs(y + height - (top + height)); // bottom - top <- 이거 풀어씀.

      let newWidth = width;
      let newHeight = height;

      const getNewHeight = (x: number) => {
        return (x * height) / width;
      };

      switch (resizeCmd) {
        case 'bottom-right':
          newHeight = getNewHeight(absX);
          newWidth = absX;
          break;
        case 'top-right':
          newHeight = getNewHeight(absX);
          newWidth = absX;
          break;
        case 'bottom-left':
          newHeight = getNewHeight(absLeftX);
          newWidth = absLeftX;
          break;
        case 'top-left':
          newHeight = getNewHeight(absLeftX);
          newWidth = absLeftX;
          break;
        case 'bottom-center':
          newHeight = absBottomY;
          break;
        case 'top-center':
          newHeight = absY;
          break;
        case 'right':
          newWidth = absX;
          break;
        case 'left':
          newWidth = absLeftX;
          break;
        default:
          break;
      }

      setResizeWidth(newWidth);
      setResizeHeight(newHeight);
      requestAnimationFrame(() => positioningImageResize);
    },
    [setResizeHeight, setResizeWidth],
  );

  const handleResizeModeStart = useCallback(
    (e) => {
      e.stopPropagation();
      const { component } = e.currentTarget.dataset;
      if (component === 'wrapper') {
        return setIsResizeMode(false);
      }

      setIsResizeMode(!isResizeMode);
    },
    [isResizeMode, setIsResizeMode],
  );

  const handleImgResize = useCallback(
    (e) => {
      if (!isResizeStart && !isResizeMode) return;
      if (imgNode.current) {
        e.preventDefault();
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

  const handleImgDropUpload = useCallback(
    async (acceptedFiles) => {
      if (!acceptedFiles[0].type.includes('image')) {
        return alert('이미지 파일이 아닌건 지원하지 않습니다.');
      }

      if (!imgSizeChecker(acceptedFiles[0])) return;

      setImgUploadLoading(true);
      try {
        if (imgWrapperRef.current) {
          const file = acceptedFiles[0];
          const fd = new FormData();
          fd.append('image', file);

          await axios
            .post('/canvas/img', fd, {
              onUploadProgress: getProgressGage,
            })
            .then((res) => {
              setImgUploadUrl(res.data || '');
            });
        }
      } catch (err) {
        alert('이미지 업로드 실패, 괜찮아 다시 시도 ㄱㄱ, 3번시도 부탁');
        console.error(err);
      } finally {
        setImgUploadLoading(false);
        setIsDragDrop(false);
      }
    },
    [getProgressGage, setImgUploadLoading, setImgUploadUrl],
  );

  const handleDropCancel = useCallback(() => {
    setIsDragDrop(false);
  }, []);

  const handleDropImage = useCallback(() => {
    setIsDragDrop(true);
  }, []);

  const handleDeleteCanvas = useCallback(
    (e) => {
      if (!croppedList || !framePrice || !selectedFrameList) return;
      setCroppedList(croppedList.filter((lst) => +lst.id !== +e.target.id));
      setFramePrice(framePrice.filter((lst) => lst.id !== +e.target.id));
      setSelectedFrameList(selectedFrameList.filter((lst) => +lst.id !== +e.target.id));
    },
    [croppedList, framePrice, selectedFrameList, setFramePrice, setSelectedFrameList],
  );

  // 이미지 저장을 위한 캔버스 생성 (스프라이트 기법으로 이미지 저장은 안되기 때문에 품질이 깨지더라도 이 방법 사용합니다.)
  const createCanvasForSave = useCallback(
    (id: number) => {
      if (!canvasFrameSizeInfo || !imgNode.current || !selectedFrameInfo || !canvasPosition || !bgColor) return;

      const { name } = selectedFrameInfo;
      const { width: frameWidth, height: frameHeight } = canvasFrameSizeInfo;
      const { left, top } = imgNode.current.getBoundingClientRect();
      const { left: canvasLeft, top: canvasTop } = canvasPosition;
      const image = imgNode.current;
      const oCanvas = document.createElement('canvas');
      oCanvas.id = id.toString();
      oCanvas.dataset.paper = name;
      oCanvas.dataset.bgColor = bgColor;
      const cropX = canvasLeft - left;
      const cropY = canvasTop - top;

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

      if (selectedFrameList) {
        setSelectedFrameList([...selectedFrameList, oCanvas]);
      } else {
        setSelectedFrameList([oCanvas]);
      }
    },
    [bgColor, canvasFrameSizeInfo, canvasPosition, selectedFrameInfo, selectedFrameList, setSelectedFrameList],
  );

  const createImageCanvas = useCallback(
    async (id: number) => {
      if (!isSelectFrame || !imgNode.current || !canvasPosition || !canvasFrameSizeInfo || !croppedList) return;
      const { width: frameWidth, height: frameHeight } = canvasFrameSizeInfo;
      const { left, top, width, height } = imgNode.current.getBoundingClientRect();
      const { left: canvasLeft, top: canvasTop } = canvasPosition;

      const cropped: CroppedFrame = {
        id: id.toString(),
        width: `${frameWidth}px`,
        height: `${frameHeight}px`,
        left: `${canvasLeft + scrollX}px`,
        top: `${canvasTop + scrollY}px`,
        dataset: { originleft: `${canvasLeft - left}`, origintop: `${canvasTop - top}` },
        imageCropStyle: {
          backgroundImage: `url(${await ImgToDataURL(imgUploadUrl || '')})`,
          backgroundColor: `${bgColor}`,
          backgroundRepeat: `no-repeat`,
          backgroundSize: `${width}px ${height}px`,
          backgroundPositionX: `${-canvasLeft + left}px`,
          backgroundPositionY: `${-canvasTop + top}px`,
          width: `${100}%`,
          height: `${100}%`,
          boxShadow: `0 0 7px #333 inset, 0 0 6px #ededed`,
        },
      };

      // 자른 액자 배열로 저장
      setCroppedList([...croppedList, cropped]);
    },
    [isSelectFrame, canvasPosition, canvasFrameSizeInfo, croppedList, scrollX, scrollY, imgUploadUrl, bgColor],
  );

  //   액자를 사진 속에 눌렀을떄 이미지 크롭
  const insertFrameToCanvas = useCallback(async () => {
    if (imgNode.current && selectedFrameInfo && framePrice) {
      //  액자의 가격을 price에 넣기
      const { name, price, cm } = selectedFrameInfo;
      const id = Date.now();
      setFramePrice([...framePrice, { name, price, id, cm }]);
      createImageCanvas(id);
      createCanvasForSave(id);
    }
  }, [selectedFrameInfo, framePrice, setFramePrice, createImageCanvas, createCanvasForSave]);

  //   따라다니는 액자를 재클릭하면 insert하고 사라짐.
  const handleFrameRelease = useCallback(() => {
    if (!isSelectFrame) return;
    insertFrameToCanvas();
    setIsNearingX(false);
    setIsNearingY(false);
    setIsFitX(false);
    setIsFitY(false);
    setIsSelectFrame(() => false);
    setSelectedFrameInfo(() => null);
    setYourSelectedFrame(() => null);
  }, [isSelectFrame, insertFrameToCanvas, setIsNearingX, setIsNearingY, setIsFitX, setIsFitY]);

  //   액자를 클릭하묜?
  const handleFrameSelect = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { value } = e.currentTarget.dataset;
      const el = imgNode.current;

      if (el) {
        const { width, height } = el.getBoundingClientRect();
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;

        const seletctedName = frameSize.filter((lst) => {
          if (lst.name === value) {
            setYourSelectedFrame({
              width: replacePx(lst.size.width),
              height: replacePx(lst.size.height),
            });
            return lst;
          }
        });
        setIsSelectFrame(() => true);
        setSelectedFrameInfo(seletctedName[0]);
      }
    },
    [frameSize],
  );

  const getImgWrapperSizeForParallel = useCallback(() => {
    const imgWrapper = imgWrapperRef.current;
    if (!imgWrapper) return;
    const { width, height } = imgWrapper.getBoundingClientRect();
    const centerX = width / 2;
    const centerY = height / 2;
    setCenterX(centerX);
    setCenterY(centerY);
    requestAnimationFrame(() => getImgWrapperSizeForParallel);
  }, [setCenterX, setCenterY]);

  // 리사이즈시에도 동일하게 움직일 수 있도록 설정
  const handleFramePositionRelative = useCallback(() => {
    if (window.innerWidth <= replacePx(theme.size.md)) {
      setIsNoContent(true);
    } else {
      setIsNoContent(false);
    }
    getImgWrapperSizeForParallel();

    if (imgNode.current) {
      const { left: imgLeft, top: imgTop } = imgNode.current.getBoundingClientRect();
      if (!croppedList.length) return;
      setCroppedList((prev) =>
        prev.map((lst) => ({
          ...lst,
          left: `${+lst.dataset.originleft + imgLeft + scrollX}px`,
          top: `${+lst.dataset.origintop + imgTop + scrollY}px`,
        })),
      );
      requestAnimationFrame(() => handleFramePositionRelative);
    }
    if (previewBgRef.current) {
      const { left } = previewBgRef.current.getBoundingClientRect();
      setFramePreviewMode({ ...framePreviewMode, top: 140, left: left + 75 });
    }
  }, [getImgWrapperSizeForParallel, setIsNoContent, croppedList, scrollX, scrollY, framePreviewMode]);

  // const handleFrameColorChange = useCallback((color: ColorResult) => {
  //   const { hex } = color;
  //   setFrameBorderColor(hex);
  // }, []);

  useEffect(() => {
    if (!imgNode.current) return;
    if (resizeWidth) {
      imgNode.current.style.width = `${resizeWidth}px`;
    }
    if (resizeHeight) {
      imgNode.current.style.height = `${filterOverMaxHeight(resizeHeight)}px`;
    }
  }, [resizeWidth, resizeHeight]);

  useEffect(() => {
    if (imgNode.current) {
      imgNode.current.style.visibility = isPreview ? 'hidden' : 'visible';
    }

    if (isPreview) {
      if (previewBgRef.current) {
        const { left } = previewBgRef.current.getBoundingClientRect();
        setFramePreviewMode({ ...framePreviewMode, top: 140, left: left + 75 });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPreview]);

  useEffect(() => {
    if (!imgUploadUrl) return;
    const el = imgNode.current;
    const img = new Image();
    if (img && el) {
      el.style.width = '';
      el.style.height = '';
      img.src = imgUploadUrl;
      img.onload = () => {
        const [w, h] = getOriginRatio(img.naturalWidth, img.naturalHeight, window.innerWidth, window.innerHeight - 170);
        setOriginWidth(w);
        setOriginHeight(h);
        setResizeWidth(w);
        setResizeHeight(h);
      };
    }
  }, [imgUploadUrl, setOriginHeight, setOriginWidth, setResizeHeight, setResizeWidth]);

  useEffect(() => {
    const imgWrapper = imgWrapperRef.current;
    if (!imgWrapper) return;
    if (isGridGuideLine) {
      // const { innerWidth: width, innerHeight: height } = window;
      const { width, height } = imgWrapper.getBoundingClientRect();
      setGridWidth(Math.floor(width / 48) % 2 === 0 ? Math.floor(width / 48) : Math.ceil(width / 48));
      setGridHeight(Math.floor(height / 54) % 2 === 0 ? Math.floor(height / 54) : Math.ceil(height / 54));
      setGridGuideLine(new Array(Math.floor((width / 48) * (height / 54))).fill(undefined).map((_, index) => index));
    }
  }, [isGridGuideLine]);

  useEffect(() => {
    if (window) {
      window.addEventListener('resize', handleFramePositionRelative);
    }
    return () => {
      window.removeEventListener('resize', handleFramePositionRelative);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [croppedList]);

  useEffect(() => {
    if (isSaveCanvas) {
      setIsSaveCanvas(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 정가운데값 구하기
  useEffect(() => {
    const imgWrapper = imgWrapperRef.current;
    if (!imgWrapper) return;
    const { innerWidth: width, innerHeight: height } = window;
    setCenterX(width / 2);
    setCenterY((height - HEADER_HEIGHT) / 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setImgUploadUrl('');
    return () => {
      setIsPreview(false);
      setFramePrice([]);
      setSelectedFrameList([]);
      setBgColor(theme.color.gray100);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {imgUploadUrl && isGridGuideLine && !isPreview && (
        <div
          style={{
            position: 'fixed',
            // top: `${HEADER_HEIGHT}px`,
            overflow: 'hidden',
            right: 0,
            width: '100%',
            height: '100vh',
            display: 'grid',
            zIndex: 1,
            gridTemplateRows: `repeat(${gridWidth}, 1fr)`,
            gridTemplateColumns: `repeat(${gridHeight}, 1fr)`,
          }}
        >
          {gridGuideLine.map(() => (
            <div style={{ border: `1px dashed ${theme.color.gray200}` }}></div>
          ))}
        </div>
      )}
      <ToolContainer>
        {imgUploadUrl && (
          <ToolFrameList
            frameSize={frameSize}
            attribute={frameAttribute || '정방'}
            onClick={handleFrameSelect}
            onChangeVertical={handleChangeVertical}
          ></ToolFrameList>
        )}

        {/* 사진 조절하는 툴바들 */}
        <ToolHeaderWrapper>
          <ToolHeader imgUrl={imgUploadUrl || ''} />
          <DividedToolFactory croppedList={croppedList} setCroppedList={setCroppedList} />
        </ToolHeaderWrapper>

        {isNoContent && (
          <div
            style={{
              position: 'fixed',
              marginTop: `${HEADER_HEIGHT}px`,
              width: '100%',
              height: '100vh',
              top: 0,
              zIndex: 999,
              backgroundColor: '#fff',
              color: 'black',
            }}
          >
            <Button style={{ position: 'relative', top: '30%', left: '50%', transform: 'translateX(-50%)' }}>
              최소한의 크기로 키워주세요.
            </Button>
          </div>
        )}

        {<Loading progressPercentage={progressPercentage} loading={imgUploadLoading || false} />}

        <ImageWrapper
          onDragOver={handleDropImage}
          isPreview={isPreview || false}
          imgUploadLoading={imgUploadLoading || false}
          id="img-box"
          data-component="wrapper"
          onClick={handleResizeModeStart}
          onMouseMove={handleImgResize}
          ref={imgWrapperRef}
          bgColor={bgColor || theme.color.white}
          onMouseUp={handleImgResizeEnd}
          onMouseLeave={isDragDrop ? handleDropCancel : handleImgResizeEnd}
          cmd={resizeCmd}
        >
          {isPreview && (
            <PreviewBg ref={previewBgRef}>
              <img src={BgPreview} alt="미리보기배경" />
            </PreviewBg>
          )}
          <CroppedWrapper isPreview={isPreview || false} top={framePreviewMode?.top} left={framePreviewMode?.left}>
            {croppedList?.map(({ dataset, id, imageCropStyle, ...style }) => (
              <div
                key={id}
                id={id}
                style={style}
                data-originleft={dataset.originleft}
                data-origintop={dataset.origintop}
                className="cropped-img"
              >
                <img style={imageCropStyle} />
                <div id={id} className="cropped-img-delete" onClick={handleDeleteCanvas}></div>
              </div>
            ))}
          </CroppedWrapper>
          {imgUploadUrl ? (
            <>
              {isSelectFrame && (
                <ToolSelectedFrame croppedList={croppedList} {...yourSelectedFrame} onClick={handleFrameRelease} />
              )}

              <ImgController
                isPreview={isPreview || false}
                data-layout="inner"
                isResizeStart={isResizeMode || false}
                cmd={resizeCmd}
              >
                <img
                  onMouseUp={handleImgResizeEnd}
                  ref={imgNode}
                  src={imgUploadUrl}
                  crossOrigin="anonymous"
                  alt="캔버스로 만들 이미지"
                />
                {isResizeMode ? (
                  <>
                    <div data-cmd="top-left" onMouseDown={handleImgResizeStart}></div>
                    <div data-cmd="top-center" onMouseDown={handleImgResizeStart}></div>
                    <div data-cmd="top-right" onMouseDown={handleImgResizeStart}></div>

                    <div data-cmd="right" onMouseDown={handleImgResizeStart}></div>

                    <div data-cmd="bottom-left" onMouseDown={handleImgResizeStart}></div>
                    <div data-cmd="bottom-center" onMouseDown={handleImgResizeStart}></div>
                    <div data-cmd="bottom-right" onMouseDown={handleImgResizeStart}></div>

                    <div data-cmd="left" onMouseDown={handleImgResizeStart}></div>
                  </>
                ) : (
                  <button type="button" onClick={handleResizeModeStart}></button>
                )}
              </ImgController>
            </>
          ) : (
            <>
              <ImageDropZone
                onDrop={handleImgDropUpload}
                width="90%"
                height="calc(100vh - 170px)"
                isDragDrop={isDragDrop}
              />
            </>
          )}
          {isDragDrop && imgUploadUrl && !isPreview && (
            <ImageDropZone
              onDrop={handleImgDropUpload}
              isDragDrop={isDragDrop}
              width="100%"
              height="calc(100vh - 105px)"
            />
          )}
        </ImageWrapper>
      </ToolContainer>
    </>
  );
};

export default Tool;
