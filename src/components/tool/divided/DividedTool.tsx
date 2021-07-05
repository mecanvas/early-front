import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGetScollPosition, useGlobalState } from 'src/hooks';
import axios from 'axios';
import ToolColorPalette from './DividedToolColorPalette';
import {
  ToolContainer,
  ImageWrapper,
  BillTotal,
  BillInfomation,
  DropZone,
  CanvasInfomationWrapper,
  DropZoneDiv,
  ImgController,
  FactoryHeader,
  FactoryTool,
  FrameTool,
  ImageShowingWidthHeight,
  FactoryUtills,
  Bill,
  CroppedWrapper,
  PreviewBg,
} from './DividedToolStyle';
import { ColorResult } from 'react-color';
import { useDropzone } from 'react-dropzone';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Popover, Upload, Checkbox, Input } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { theme } from 'src/style/theme';
import { useRouter } from 'next/router';
import Loading from '../../common/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSquare } from '@fortawesome/free-regular-svg-icons';
import { faPaintRoller, faUndo, faImage, faCompress, faRulerHorizontal } from '@fortawesome/free-solid-svg-icons';
import ToolSave from './DividedToolSave';
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
import { getOriginRatio } from 'src/utils/getOriginRatio';
import { getS3 } from 'src/utils/getS3';
import { ImgToDataURL } from 'src/utils/ImgToDataURL';
import { replacePx } from 'src/utils/replacePx';
import { useProgress } from 'src/hooks/useProgress';
import Logo from 'src/components/layouts/Logo';

const Tool = () => {
  const router = useRouter();
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
  const [isSelectFrame, setIsSelectFrame] = useState(false); // 골랐는지 상태 여부
  const [selectedFrameInfo, setSelectedFrameInfo] = useState<FrameSize | null>(null); // 고른 액자의 정보 (스타일 + 이름)
  const [canvasPosition] = useGlobalState<CanvasPosition>('canvasPosition');
  const [canvasFrameSizeInfo] = useGlobalState<CanvasFrameSizeInfo>('canvasFrameSizeInfo');
  const [croppedList, setCroppedList] = useState<CroppedFrame[]>([]);
  const [framePreviewMode, setFramePreviewMode] = useState<CanvasPosition | null>(null);
  const [scrollX, scrollY] = useGetScollPosition();

  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const imgNode = useRef<HTMLImageElement>(null);
  const previewBgRef = useRef<HTMLImageElement>(null);

  const [imgUploadUrl, setImgUploadUrl] = useGlobalState('imgUploadUrl', '');
  const [imgUploadLoading, setImgUploadLoading] = useState(false);

  const [originWidth, setOriginWidth] = useState(0);
  const [originHeight, setOriginHeight] = useState(0);
  const [resizeWidth, setResizeWidth] = useState(0);
  const [resizeHeight, setResizeHeight] = useState(0);
  const [ratioPersist, setRatioPersist] = useState(true);
  const [imgModalResizeOpen, setImgModalResizeOpen] = useState(false);

  const [selectedFrameList, setSelectedFrameList] = useState<HTMLCanvasElement[]>([]);
  const [yourSelectedFrame, setYourSelectedFrame] = useState<CanvasFrameSizeInfo | null>(null);

  const [framePrice, setFramePrice] = useState<FramePrice[]>([]);

  // 눈금 간격 라인 표시
  const [isGridGuideLine, setIsGridGuideLine] = useState(false);
  const [gridGuideLine, setGridGuideLine] = useState<any[]>([]);
  const [gridWidth, setGridWidth] = useState(0);
  const [gridHeight, setGridHeight] = useState(0);

  const [isSaveCanvas, setIsSaveCanvas] = useGlobalState('saveModal', false);

  // 액자 사이즈들 변경
  const [frameAttribute, setFrameAttribute] = useState<'정방' | '해경' | '인물' | '풍경'>('정방');

  // 가운데 근접 컨트롤
  const [, setCenterX] = useGlobalState<number>('centerX', 0);
  const [, setCenterY] = useGlobalState<number>('centerY', 0);
  const [isNearingX, setIsNearingX] = useGlobalState<boolean>('isNearingX');
  const [isNearingY, setIsNearingY] = useGlobalState<boolean>('isNearingY');
  const [isFitX, setIsFitX] = useGlobalState<boolean>('isFitX');
  const [isFitY, setIsFitY] = useGlobalState<boolean>('isFitY');

  // 미리보기
  const [isPreview, setIsPreview] = useGlobalState<boolean>('isPreview', false);

  const handleShowGridGuideLine = useCallback(() => {
    setIsGridGuideLine((prev) => !prev);
  }, []);

  const handleChangeVertical = useCallback(() => {
    setChangeVertical((prev) => !prev);
  }, []);

  const handleGetFrameAttribute = useCallback((e) => {
    const { value } = e.currentTarget;
    setFrameAttribute(value);
  }, []);

  // 고른 액자의 이름과 수량
  const yourPriceList = useMemo(() => {
    return Object.entries(
      framePrice.reduce((acc: { [key: string]: any }, cur) => {
        const name = cur.name;
        if (!acc[name]) {
          acc[name] = { quantity: 1, price: cur.price, cm: cur.cm };
          return acc;
        }
        acc[name].quantity++;
        return acc;
      }, {}),
    );
  }, [framePrice]);

  const handlePushMainPage = useCallback(() => {
    router.push('/');
  }, [router]);

  // 바뀌는 색상
  const [bgColor, setBgColor] = useState(theme.color.white);
  // const [frameBorderColor, setFrameBorderColor] = useState('#333');

  const [isResizeStart, setIsResizeStart] = useState(false);
  const [resizeCmd, setResizeCmd] = useState<ResizeCmd | null>(null);
  const [isResizeMode, setIsResizeMode] = useState(false);

  const positioningImageResize = useCallback((resizeCmd: ResizeCmd | null, x: number, y: number) => {
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
  }, []);

  const handleImgRatioSetting = useCallback(() => {
    const [w, h] = getOriginRatio(originWidth, originHeight);
    const newWidth = w * resizeHeight;
    const newHeight = h * newWidth;

    // 너비가 벗어나는 상황에선 너비에 맞춰 높이 비율을 맞춤
    if (newWidth > window.innerWidth) {
      const newHeight = h * resizeWidth;
      const newWidth = w * newHeight;
      setResizeWidth(+newWidth.toFixed());
      setResizeHeight(+newHeight.toFixed());
      return;
    }

    setResizeWidth(+newWidth.toFixed());
    setResizeHeight(+newHeight.toFixed());
  }, [originHeight, originWidth, resizeHeight, resizeWidth]);

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
      if (!imgSizeChecker(file)) return;
      setImgUploadLoading(true);
      try {
        if (imgWrapperRef.current) {
          const fd = new FormData();
          fd.append('image', file);
          await axios
            .post('/canvas/img', fd, {
              onUploadProgress: getProgressGage,
            })
            .then((res) => setImgUploadUrl(res.data || ''));
        }
      } catch (err) {
        alert('이미지 업로드 실패, 괜찮아 다시 시도 ㄱㄱ, 3번시도 부탁');
        console.error(err);
      } finally {
        setImgUploadLoading(false);
      }
      return false;
    },
    [getProgressGage, setImgUploadUrl],
  );

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
              console.log(res);
              setImgUploadUrl(res.data || '');
            });
        }
      } catch (err) {
        alert('이미지 업로드 실패, 괜찮아 다시 시도 ㄱㄱ, 3번시도 부탁');
        console.error(err);
      } finally {
        setImgUploadLoading(false);
      }
    },
    [getProgressGage, setImgUploadUrl],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleImgDropUpload });

  const handleDeleteCanvas = useCallback(
    (e) => {
      if (croppedList) {
        setCroppedList((prev) => prev.filter((lst) => +lst.id !== +e.target.id));
        setFramePrice((prev) => prev.filter((lst) => lst.id !== +e.target.id));
        setSelectedFrameList((prev) => prev.filter((lst) => +lst.id !== +e.target.id));
      }
    },
    [croppedList],
  );

  const handleImgGoBack = useCallback(() => {
    setCroppedList((prev) => prev.slice(0, -1));
    setFramePrice((prev) => prev.slice(0, -1));
    setSelectedFrameList((prev) => prev.slice(0, -1));
  }, []);

  // 이미지 저장을 위한 캔버스 생성 (스프라이트 기법으로 이미지 저장은 안되기 때문에 품질이 깨지더라도 이 방법 사용합니다.)
  const createCanvasForSave = useCallback(
    (id: number) => {
      if (!canvasFrameSizeInfo || !imgNode.current || !selectedFrameInfo || !canvasPosition) return;

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

      setSelectedFrameList([...selectedFrameList, oCanvas]);
    },
    [bgColor, canvasFrameSizeInfo, canvasPosition, selectedFrameInfo, selectedFrameList],
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
    if (imgNode.current && selectedFrameInfo) {
      //  액자의 가격을 price에 넣기
      const { name, price, cm } = selectedFrameInfo;
      const id = Date.now();
      setFramePrice([...framePrice, { name, price, id, cm }]);
      createImageCanvas(id);
      createCanvasForSave(id);
    }
  }, [selectedFrameInfo, framePrice, createImageCanvas, createCanvasForSave]);

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
    setImgModalResizeOpen((prev) => !prev);
  }, []);

  const handleImgPreview = useCallback(() => {
    if (!imgUploadUrl) return;
    setIsPreview(!isPreview);
  }, [imgUploadUrl, isPreview, setIsPreview]);

  const getImgWrapperSizeForParallel = useCallback(() => {
    const imgWrapper = imgWrapperRef.current;
    if (!imgWrapper) return;
    const { width, height } = imgWrapper.getBoundingClientRect();
    const centerX = width / 2;
    const centerY = height / 2;
    setCenterX(centerX);
    setCenterY(centerY);
    requestAnimationFrame(getImgWrapperSizeForParallel);
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
  }, [getImgWrapperSizeForParallel, setIsNoContent, scrollX, scrollY, framePreviewMode]);

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
    if (el) {
      el.style.width = '';
      el.style.height = '';
      el.src = imgUploadUrl;
      el.onload = () => {
        setOriginWidth(el.naturalWidth < 1000 ? el.naturalWidth : el.width);
        setOriginHeight(el.naturalHeight < 700 ? el.naturalHeight : el.height);
        setResizeWidth(el.width);
        setResizeHeight(el.height);
      };
    }
  }, [imgUploadUrl]);

  useEffect(() => {
    const imgWrapper = imgWrapperRef.current;
    if (!imgWrapper) return;
    if (isGridGuideLine) {
      const { width, height } = imgWrapper.getBoundingClientRect();

      setGridWidth(Math.floor(width / 48));
      setGridHeight(Math.floor(height / 36));
      setGridGuideLine(new Array(Math.floor((width / 48) * (height / 36))).fill(undefined).map((_, index) => index));
    }
  }, [isGridGuideLine]);

  useEffect(() => {
    if (window) {
      window.addEventListener('resize', handleFramePositionRelative);
      requestAnimationFrame(handleFramePositionRelative);
    }
    return () => {
      window.removeEventListener('resize', handleFramePositionRelative);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    const { width, height } = imgWrapper.getBoundingClientRect();
    setCenterX(width / 2);
    setCenterY(height / 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setImgUploadUrl('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {imgUploadUrl && isGridGuideLine && !isPreview && (
        <div
          style={{
            position: 'fixed',
            top: '105px',
            overflow: 'hidden',
            right: 0,
            width: '100%',
            height: '100vh',
            display: 'grid',
            zIndex: 1,
            gridTemplateColumns: `repeat(${gridWidth}, 1fr)`,
            gridTemplateRows: `repeat(${gridHeight}, 1fr)`,
          }}
        >
          {gridGuideLine.map(() => (
            <div style={{ border: '1px dashed #dbdbdb' }}></div>
          ))}
        </div>
      )}
      <ToolContainer>
        {imgUploadUrl && (
          <ToolFrameList
            frameSize={frameSize}
            attribute={frameAttribute}
            onClick={handleFrameSelect}
            onChangeVertical={handleChangeVertical}
          ></ToolFrameList>
        )}

        {/* 사진 조절하는 툴바들 */}
        <FactoryHeader>
          <FactoryUtills>
            <div onClick={handlePushMainPage}>
              <Logo />
            </div>
            <div>
              <Popover
                style={{ padding: 0 }}
                content={
                  yourPriceList.length ? (
                    <CanvasInfomationWrapper>
                      {/* 사용한 액자 x 수량 */}
                      <BillInfomation>
                        <Bill>
                          {yourPriceList.map(([key, value], index) => (
                            <div key={index}>
                              <div>{key}</div>
                              <div>
                                {value.price.toLocaleString()} x {value.quantity}개
                              </div>
                            </div>
                          ))}
                        </Bill>
                        <BillTotal>
                          {framePrice.reduce((acc, cur) => (acc += cur.price), 0).toLocaleString()}원
                        </BillTotal>
                      </BillInfomation>
                    </CanvasInfomationWrapper>
                  ) : (
                    '제작하신 액자가 없습니다.'
                  )
                }
              >
                <Button type="text">예상가격</Button>
              </Popover>
              <Button onClick={handleImgPreview} type={!isPreview ? 'default' : 'primary'}>
                {!isPreview ? '미리보기' : '이미지로'}
              </Button>
              <Button type="text" onClick={handleSaveCanvas}>
                저장
              </Button>
              {isSaveCanvas && (
                <ToolSave
                  totalPrice={framePrice.reduce((acc, cur) => (acc += cur.price), 0)}
                  yourPriceList={yourPriceList}
                  selectedFrameList={selectedFrameList}
                />
              )}
            </div>
          </FactoryUtills>
          <FactoryTool>
            <div>
              {isResizeMode && (
                <>
                  <ImageShowingWidthHeight>
                    {`${resizeWidth.toFixed()}px X ${resizeHeight.toFixed()}px`}
                    <span onClick={handleModalResize}>
                      <FontAwesomeIcon icon={faEdit} />
                    </span>
                  </ImageShowingWidthHeight>
                </>
              )}
              <Button type="text" style={{ opacity: selectedFrameList.length ? 1 : 0.4 }} onClick={handleImgGoBack}>
                <FontAwesomeIcon icon={faUndo} />
                <small>실행취소</small>
              </Button>
              <Upload accept="image/*" beforeUpload={handleImgReUpload} showUploadList={false}>
                <Button type="text">
                  <FontAwesomeIcon icon={faImage} />
                  <small>변경</small>
                </Button>
              </Upload>
              <Popover
                style={{ padding: 0 }}
                trigger="click"
                placement="bottom"
                content={<ToolColorPalette type="bg" onChange={handleColorChange} />}
              >
                <Button type="text">
                  <FontAwesomeIcon icon={faPaintRoller} />
                  <small>배경</small>
                </Button>
              </Popover>

              <Button type="text" onClick={handleShowGridGuideLine}>
                <FontAwesomeIcon icon={faRulerHorizontal} />
                <small>눈금자</small>
              </Button>

              <Button type="text" onClick={handleImgRatioSetting}>
                <FontAwesomeIcon icon={faCompress} />
                <small>비율 맞추기</small>
              </Button>
            </div>
            <FrameTool>
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
            </FrameTool>
          </FactoryTool>
        </FactoryHeader>

        {isNoContent && (
          <div
            style={{
              position: 'fixed',
              marginTop: '105px',
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

        {<Loading progressPercentage={progressPercentage} loading={imgUploadLoading} />}
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
              <Button onClick={handleResizeReset}>이미지 초기 사이즈로 되돌립니다.</Button>
            </div>
          </div>
        </Modal>

        <ImageWrapper
          isPreview={isPreview || false}
          imgUploadLoading={imgUploadLoading}
          id="img-box"
          data-component="wrapper"
          onClick={handleResizeMode}
          onMouseMove={handleImgResize}
          ref={imgWrapperRef}
          bgColor={bgColor}
          isNearingX={isNearingX || false}
          isNearingY={isNearingY || false}
          isFitX={isFitX || false}
          isFitY={isFitY || false}
          onMouseUp={handleImgResizeEnd}
          onMouseLeave={handleImgResizeEnd}
          cmd={resizeCmd}
        >
          {isPreview && (
            <PreviewBg ref={previewBgRef}>
              <img src={getS3('bg1.jpg')} alt="미리보기배경" />
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

              {isPreview || (
                <ImgController data-layout="inner" isResizeStart={isResizeMode} cmd={resizeCmd}>
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
                    <button type="button" onClick={handleResizeMode}></button>
                  )}
                </ImgController>
              )}
            </>
          ) : (
            <>
              <DropZone {...getRootProps()}>
                <input {...getInputProps()} accept="image/*" />
                <DropZoneDiv isDragActive={isDragActive}>
                  <PlusOutlined />
                  <p>이미지를 드롭하거나 첨부하세요!</p>
                </DropZoneDiv>
              </DropZone>
            </>
          )}
        </ImageWrapper>
      </ToolContainer>
    </>
  );
};

export default Tool;
