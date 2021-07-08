import React, { useCallback, useEffect, useRef, useState } from 'react';
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

const SingleToolFactory = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #dbdbdb;
`;

const SingleCanvasFrameWrapper = styled.div<{ clicked: boolean; cmd: ResizeCmd | null }>`
  min-height: calc(100vh - 105px);
  max-height: calc(100vh - 105px);
  width: 98%;
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
  height: calc(100vh - 105px);

  img {
    max-height: calc(100vh - 105px);
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

const SingleTool = () => {
  const singleCanvasFrameWrapperRef = useRef<HTMLDivElement>(null);
  const singleCanvasFrameRef = useRef<HTMLCanvasElement>(null);
  const singleImgRef = useRef<HTMLImageElement>(null);
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const [wrapperHeight, setWrapperHeight] = useState(0);
  const [resizeCmd] = useGlobalState<ResizeCmd>('resizeCmd');

  const { getProgressGage, progressPercentage } = useProgress();
  const [singleImgUploadUrl, setSingleimgUploadUrl] = useState('');
  const [isImgUploadLoading, setImgUploadLoading] = useState(false);
  const [isMovingImage, setIsMovingImage] = useState(false);

  const [singleFrameWidth, setSingleFrameWidth] = useState(0);
  const [singleFrameHeight, setSingleFrameHeight] = useState(0);

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
    [createCanvasInImage, getProgressGage],
  );

  const handleMoveSingleImage = useCallback((e) => {
    e.preventDefault();
    setIsMovingImage(true);
  }, []);

  const handleMoveCancelSingleImage = useCallback(() => {
    setIsMovingImage(false);
  }, []);

  const handleImgRatioSetting = useCallback(() => {
    if (!singleImgRef.current) return;
    const imgNode = singleImgRef.current;
    const { width: currentWidth, height: currentHeight } = imgNode.getBoundingClientRect();
    const originWidth = imgNode.naturalWidth;
    const originHeight = imgNode.naturalHeight;
    const [w, h] = getOriginRatio(originWidth, originHeight, currentWidth, currentHeight);

    singleImgRef.current.style.width = `${w}px`;
    singleImgRef.current.style.height = `${h}px`;
  }, []);

  // 어떤 액자를 할지 클릭하면 그 액자에 맞는 사이즈로 canvas 액자 출력
  useEffect(() => {
    const sCanvas = singleCanvasFrameRef.current;
    if (!sCanvas || !wrapperWidth || !wrapperHeight || !singleFrameWidth || !singleFrameHeight) return;
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
  }, [
    singleCanvasFrameRef,
    singleCanvasFrameWrapperRef,
    singleFrameHeight,
    singleFrameWidth,
    wrapperHeight,
    wrapperWidth,
  ]);

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

      {/* 사진이 들어갈 액자  */}
      <SingleCanvasFrameWrapper
        cmd={resizeCmd ?? null}
        ref={singleCanvasFrameWrapperRef}
        clicked={isMovingImage}
        data-component="wrapper"
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
            <SingleImgSizeController imgRef={singleImgRef} wrapperRef={singleCanvasFrameWrapperRef}>
              <>
                <img
                  ref={singleImgRef}
                  src={singleImgUploadUrl}
                  alt="캔버스로 만들 이미지"
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
