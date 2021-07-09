import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from '@emotion/styled';
import ToolHeader from '../ToolHeader';
import { Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { imgSizeChecker } from 'src/utils/imgSizeChecker';
import axios from 'axios';
import { useProgress } from 'src/hooks/useProgress';
import Loading from 'src/components/common/Loading';
import Upload, { RcFile } from 'antd/lib/upload';
import { faCompress, faUpload } from '@fortawesome/free-solid-svg-icons';
import { css } from '@emotion/react';
import SingleImgSizeController from 'src/components/common/SingleImgSizeController';
import { useGlobalState } from 'src/hooks';
import { ResizeCmd } from 'src/interfaces/ToolInterface';
import { getOriginRatio } from 'src/utils/getOriginRatio';
import { theme } from 'src/style/theme';
import { filterOverMaxHeight } from 'src/utils/filterOverMaxHeight';
import { frameSize } from 'src/constants';
import { FrameSizeName } from '../divided/DividedToolStyle';
import { replacePx } from 'src/utils/replacePx';

const SingleToolFactory = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #dbdbdb;
`;

const SingleCanvasFrameWrapper = styled.div<{ clicked: boolean; cmd: ResizeCmd | null }>`
  min-height: calc(100vh - 105px);
  max-height: calc(100vh - 105px);
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ clicked }) =>
    clicked
      ? css`
          cursor: pointer;
        `
      : css`
          cursor: default;
        `}

  ${({ cmd }) => {
    if (!cmd) return;
    if (cmd === 'top-left' || cmd === 'bottom-right') {
      return css`
        cursor: nwse-resize;
      `;
    }
    return css`
      cursor: nesw-resize;
    `;
  }}
`;

const SingleCanvasFrame = styled.canvas<{ isImgUploadUrl: boolean }>`
  position: absolute;
  z-index: 1;
  ${({ isImgUploadUrl }) =>
    isImgUploadUrl ||
    css`
      cursor: default !important;
    `}
`;

const SingleImageCanvas = styled.div<{ clicked: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(98vh - 105px);

  canvas {
    max-height: calc(98vh - 105px);
    cursor: pointer;
    ${({ clicked }) =>
      clicked
        ? css`
            opacity: 0.5;
          `
        : css`
            opacity: 1;
          `};
  }
`;

const SingleFrameListWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  right: 0;
  top: 64px;
`;

const SingleFrameListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid #dbdbdb;
  justify-content: center;
  align-items: center;
  padding: 0.6em;
`;

const SingleFrameList = styled.div<{ width: string; height: string }>`
  position: relative;
  cursor: pointer;
  margin: 0 auto;
  margin-top: 0.4em;
  width: ${({ width }) => `${replacePx(width) / 4}px`};
  height: ${({ height }) => `${replacePx(height) / 4}px`};
  border: 1px solid ${({ theme }) => theme.color.gray300};
`;

const SingleTool = () => {
  const singleCanvasFrameWrapperRef = useRef<HTMLDivElement>(null);
  const singleCanvasFrameRef = useRef<HTMLCanvasElement>(null);
  const ImageCanvasRef = useRef<HTMLCanvasElement>(null);
  const [controllerNode, setControllerNode] = useState<HTMLDivElement | null>(null);
  const controllerRef = useCallback((node) => {
    setControllerNode(node);
  }, []);
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const [wrapperHeight, setWrapperHeight] = useState(0);
  const [originWidth, setOriginWidth] = useState(0);
  const [originHeight, setOriginHeight] = useState(0);
  const [resizeCmd] = useGlobalState<ResizeCmd>('resizeCmd');

  const { getProgressGage, progressPercentage } = useProgress();
  const [singleImgUploadUrl, setSingleimgUploadUrl] = useState('');
  const [isImgUploadLoading, setImgUploadLoading] = useState(false);
  const [isMovingImage, setIsMovingImage] = useState(false);

  const [singleFrameWidth, setSingleFrameWidth] = useState(0);
  const [singleFrameHeight, setSingleFrameHeight] = useState(0);

  const [frameAttributes, setFrameAttributes] = useState<any>('정방');
  const frameList = useMemo(() => frameSize().filter((lst) => lst.attribute === frameAttributes), [frameAttributes]);

  // const [cursorX, cursorY] = useGetCursorPosition(isMovingImage);
  const [emptyX] = useGlobalState<number>('emptyX');
  const [emptyY] = useGlobalState<number>('emptyY');

  const getPosition = useCallback((event: MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;
    return [x, y];
  }, []);

  const handleSelectFrame = useCallback((e) => {}, []);

  const handleGetFrameAttribute = useCallback((e) => {
    const { value } = e.currentTarget;
    console.log(value);
    if (value) {
      setFrameAttributes(value);
    }
  }, []);

  const handleToImageInWrapper = useCallback(
    (e) => {
      if (!isMovingImage || !controllerNode || !ImageCanvasRef.current || !emptyX || !emptyY) return;
      const [cursorX, cursorY] = getPosition(e);
      const { width, height } = controllerNode.getBoundingClientRect();
      const g = cursorX - width / 2 - emptyX;
      const h = cursorY - height / 2 - emptyY;

      controllerNode.style.transform = `translate(${g}px, ${h}px)`;
      // controllerNode.style.position = 'relative';
      // controllerNode.style.left = `${g}px`;
      // controllerNode.style.top = `${h}px`;
    },
    [controllerNode, emptyX, emptyY, getPosition, isMovingImage],
  );

  const handleCreateSingleFrame = useCallback(() => {
    setSingleFrameWidth(500);
    setSingleFrameHeight(500);
  }, []);

  const handleSingleImgUpload = useCallback(
    async (file: RcFile) => {
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
    [getProgressGage],
  );

  const handleMoveSingleImage = useCallback((e) => {
    e.preventDefault();
    setIsMovingImage(true);
  }, []);

  const handleMoveCancelSingleImage = useCallback(() => {
    setIsMovingImage(false);
  }, []);

  const handleImgRatioSetting = useCallback(() => {
    if (!ImageCanvasRef.current) return;
    const canvas = ImageCanvasRef.current;
    const {
      width,
      height,
      dataset: { url },
    } = canvas;
    const [w, h] = getOriginRatio(originWidth, originHeight, width, height);

    const imgCtx = canvas.getContext('2d');

    if (imgCtx && url) {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        imgCtx.imageSmoothingQuality = 'high';
        imgCtx.clearRect(0, 0, width, height);
        canvas.width = w;
        canvas.height = h;
        imgCtx.drawImage(img, 0, 0, w, h);
      };
    }
  }, [originHeight, originWidth]);

  const drawingImage = useCallback(
    (resizeWidth?: number, resizeHeight?: number) => {
      const imgCanvas = ImageCanvasRef.current;
      if (!imgCanvas || !wrapperWidth || !wrapperHeight) return;

      const imgCtx = imgCanvas.getContext('2d');
      if (imgCtx) {
        const img = new Image();
        img.src = singleImgUploadUrl;
        img.onload = () => {
          const { naturalWidth, naturalHeight } = img;
          setOriginWidth(naturalWidth);
          setOriginHeight(naturalHeight);
          const [w, h] = getOriginRatio(
            naturalWidth,
            naturalHeight,
            resizeWidth || wrapperWidth,
            resizeHeight || wrapperHeight,
          );
          imgCtx.imageSmoothingQuality = 'high';
          imgCanvas.width = w;
          imgCanvas.height = filterOverMaxHeight(h);
          imgCtx.drawImage(img, 0, 0, w, filterOverMaxHeight(h));
        };
      }
    },
    [singleImgUploadUrl, wrapperHeight, wrapperWidth],
  );

  useEffect(() => {
    if (!isMovingImage) return;
  }, [isMovingImage]);

  // 어떤 액자를 할지 클릭하면 그 액자에 맞는 사이즈로 canvas 액자 출력
  useEffect(() => {
    const sCanvas = singleCanvasFrameRef.current;
    if (!sCanvas || !singleFrameWidth || !singleFrameHeight) return;
    sCanvas.width = singleFrameWidth;
    sCanvas.height = singleFrameHeight;
    const sCtx = sCanvas.getContext('2d');
    sCanvas.style.cursor = 'pointer';
    sCanvas.style.zIndex = '10';
    if (sCtx) {
      sCtx.strokeStyle = theme.color.primary;
      sCtx.lineWidth = 6;
      sCtx.strokeRect(0, 0, singleFrameWidth, singleFrameHeight);
    }
  }, [singleCanvasFrameRef, singleCanvasFrameWrapperRef, singleFrameHeight, singleFrameWidth]);

  useEffect(() => {
    drawingImage();
  }, [singleImgUploadUrl, wrapperWidth, wrapperHeight, drawingImage]);

  useEffect(() => {
    const sCanvasWrapper = singleCanvasFrameWrapperRef.current;
    if (!sCanvasWrapper) return;

    const { width, height } = sCanvasWrapper.getBoundingClientRect();
    setWrapperWidth(width);
    setWrapperHeight(height);
  }, []);

  return (
    <>
      <Loading loading={isImgUploadLoading} progressPercentage={progressPercentage} />
      <ToolHeader />
      <SingleToolFactory>
        <Button type="text" onClick={handleCreateSingleFrame}>
          <FontAwesomeIcon icon={faSquare} />
          <small>첨부하기</small>
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
      <SingleFrameListWrapper>
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
        <SingleFrameListGrid>
          {frameList.map((lst, index) => (
            <SingleFrameList
              key={index}
              data-value={lst.name}
              data-attribute={lst.attribute}
              {...lst.size}
              onClick={handleSelectFrame}
            >
              <FrameSizeName>{lst.name}</FrameSizeName>
            </SingleFrameList>
          ))}
        </SingleFrameListGrid>
      </SingleFrameListWrapper>

      {/* 사진이 들어갈 액자  */}
      <SingleCanvasFrameWrapper
        cmd={resizeCmd ?? null}
        ref={singleCanvasFrameWrapperRef}
        clicked={isMovingImage}
        onMouseMove={isMovingImage ? handleToImageInWrapper : undefined}
        onMouseUp={handleMoveCancelSingleImage}
      >
        <SingleCanvasFrame
          isImgUploadUrl={singleImgUploadUrl ? true : false}
          ref={singleCanvasFrameRef}
          onMouseDown={handleMoveSingleImage}
          onMouseUp={handleMoveCancelSingleImage}
        ></SingleCanvasFrame>

        {singleImgUploadUrl && (
          <SingleImageCanvas clicked={isMovingImage}>
            <SingleImgSizeController
              controllerRef={(node) => controllerRef(node)}
              isMovingImage={isMovingImage}
              imgRef={ImageCanvasRef}
              wrapperRef={singleCanvasFrameWrapperRef}
            >
              <>
                <canvas
                  data-url={singleImgUploadUrl}
                  ref={ImageCanvasRef}
                  onMouseDown={handleMoveSingleImage}
                  onMouseUp={handleMoveCancelSingleImage}
                />
              </>
            </SingleImgSizeController>
          </SingleImageCanvas>
        )}
      </SingleCanvasFrameWrapper>
    </>
  );
};

export default SingleTool;
