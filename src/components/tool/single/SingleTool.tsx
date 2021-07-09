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
import SingleImgSizeController from 'src/components/tool/single/SingleImgSizeController';
import { useGlobalState } from 'src/hooks';
import { ResizeCmd } from 'src/interfaces/ToolInterface';
import { getOriginRatio } from 'src/utils/getOriginRatio';
import { filterOverMaxHeight } from 'src/utils/filterOverMaxHeight';
import { frameSize } from 'src/constants';
import { FrameSizeName } from '../divided/DividedToolStyle';
import { replacePx } from 'src/utils/replacePx';
import { cmToPx } from 'src/utils/cmToPx';
import { FullscreenOutlined } from '@ant-design/icons';

const SingleToolContainer = styled.div`
  background-color: ${({ theme }) => theme.color.gray100};
`;

const SingleToolFactory = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #dbdbdb;
  background-color: ${({ theme }) => theme.color.white};
`;

const SingleCanvasField = styled.div`
  min-height: calc(100vh - 105px);
  max-height: calc(100vh - 105px);
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.color.white};
`;

const SingleWrapper = styled.div<{ clicked: boolean; cmd: ResizeCmd | null }>`
  width: 100%;
  min-height: calc(100vh - 105px);
  max-height: calc(100vh - 105px);
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

const SingleSelectedFrame = styled.div<{ isImgUploadUrl: boolean; width: number; height: number }>`
  position: absolute;
  ${({ width, height }) =>
    width &&
    height &&
    css`
      width: ${width}px;
      height: ${height}px;
    `}
  ${({ isImgUploadUrl }) =>
    isImgUploadUrl ||
    css`
      cursor: default !important;
    `}

/* top */
    span:nth-of-type(1) {
    z-index: 15;
    position: absolute;
    top: 0;
    width: 100%;
    height: 1px;
    border-top: 4px dashed ${({ theme }) => theme.color.primary};
  }
  /* right */
  span:nth-of-type(2) {
    z-index: 15;
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    border-right: 4px dashed ${({ theme }) => theme.color.primary};
  }
  /* bottom */
  span:nth-of-type(3) {
    z-index: 15;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1px;
    border-bottom: 4px dashed ${({ theme }) => theme.color.primary};
  }
  /* left */
  span:nth-of-type(4) {
    z-index: 15;
    position: absolute;
    left: 0;
    top: 0;
    width: 1px;
    height: 100%;
    border-left: 4px dashed ${({ theme }) => theme.color.primary};
  }
`;

const SingleImageWrapper = styled.div<{ clicked: boolean }>`
  overflow: hidden;
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

const SingleFrameListHeader = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  right: 0;
  background-color: ${({ theme }) => theme.color.white};
  top: 54px;
`;

const SingleFrameListGrid = styled.div`
  display: flex;
  border: 1px solid #dbdbdb;
  justify-content: center;
  align-items: center;
  padding: 0.6em;

  div {
    flex: 1;
    text-align: center;
    small {
      font-size: 9px;
    }
  }
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
  const singleWrapperRef = useRef<HTMLDivElement>(null);
  const singleSelectedFrameRef = useRef<HTMLDivElement>(null);
  const ImageCanvasRef = useRef<HTMLCanvasElement>(null);
  const [controllerNode, setControllerNode] = useState<HTMLDivElement | null>(null);

  const controllerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
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

  const getPosition = useCallback((event: MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;
    return [x, y];
  }, []);

  const createInitFrame = useCallback(() => {
    // 정방 s-1호로 초기 생성
    setSingleFrameWidth(cmToPx(16) * 1.5);
    setSingleFrameHeight(cmToPx(16) * 1.5);
  }, []);

  const handleSelectFrame = useCallback((e) => {
    const { width, height } = e.currentTarget.dataset;
    setSingleFrameWidth(replacePx(width) * 1.5);
    setSingleFrameHeight(replacePx(height) * 1.5);
  }, []);

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
      const { width, height } = singleWrapperRef.current.getBoundingClientRect();

      const x = cursorX - width + 60;
      const y = cursorY - height / 2 - 95;

      controllerNode.style.position = 'relative';
      controllerNode.style.left = `${x}px`;
      controllerNode.style.top = `${y}px`;
    },
    [controllerNode, getPosition],
  );

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
          imgCtx.clearRect(0, 0, wrapperWidth, wrapperHeight);
          imgCtx.imageSmoothingQuality = 'high';
          imgCtx.drawImage(img, 0, 0, w, filterOverMaxHeight(h));
        };
      }
    },
    [singleFrameHeight, singleFrameWidth, singleImgUploadUrl, wrapperHeight, wrapperWidth],
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
    drawingImage();
    if (controllerNode) {
      controllerNode.style.position = 'relative';
      controllerNode.style.left = `${0}px`;
      controllerNode.style.top = `${0}px`;
    }
  }, [singleImgUploadUrl, wrapperWidth, wrapperHeight, drawingImage, controllerNode]);

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
      <ToolHeader />
      <SingleToolFactory>
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
        <SingleFrameListGrid>
          {frameList.map((lst, index) => (
            <div key={index} data-width={lst.size.width} data-height={lst.size.height} onClick={handleSelectFrame}>
              <SingleFrameList {...lst.size}>
                <FrameSizeName>{lst.name}</FrameSizeName>
              </SingleFrameList>
              <small>{lst.cm}</small>
            </div>
          ))}
        </SingleFrameListGrid>
      </SingleFrameListHeader>

      {/* 본격적인 툴  */}
      <SingleCanvasField>
        <SingleWrapper
          cmd={resizeCmd ?? null}
          ref={singleWrapperRef}
          clicked={isMovingImage}
          onMouseMove={isMovingImage ? handleToImageInWrapper : undefined}
          onMouseUp={handleMoveCancelSingleImage}
          onMouseLeave={handleMoveCancelSingleImage}
        >
          {/* 선택한 액자 렌더링  */}
          <SingleSelectedFrame
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
