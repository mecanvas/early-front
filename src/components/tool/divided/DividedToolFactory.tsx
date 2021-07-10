import {
  faUndo,
  faImage,
  faPaintRoller,
  faRulerHorizontal,
  faCompress,
  faSquare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Upload, Popover } from 'antd';
import { RcFile } from 'antd/lib/upload';
import axios from 'axios';
import React, { useCallback } from 'react';
import { ColorResult } from 'react-color';
import { useGlobalState } from 'src/hooks';
import { useProgress } from 'src/hooks/useProgress';
import { CroppedFrame, FramePrice } from 'src/interfaces/ToolInterface';
import { getOriginRatio } from 'src/utils/getOriginRatio';
import { imgSizeChecker } from 'src/utils/imgSizeChecker';
import ToolImageResizerModal from '../ToolImageResizerModal';
import ToolColorPalette from './DividedToolColorPalette';
import { FactoryTool, FrameTool } from './DividedToolStyle';

interface Props {
  croppedList: CroppedFrame[];
  setCroppedList: React.Dispatch<React.SetStateAction<CroppedFrame[]>>;
}

const ToolFactory = ({ croppedList, setCroppedList }: Props) => {
  const [originWidth] = useGlobalState<number>('originWidth');
  const [originHeight] = useGlobalState<number>('originHeight');
  const [resizeWidth, setResizeWidth] = useGlobalState<number>('resizeWidth');
  const [resizeHeight, setResizeHeight] = useGlobalState<number>('resizeHeight');
  const [isResizeMode] = useGlobalState<boolean>('isResizeMode');
  const [, setFrameAttribute] = useGlobalState<'정방' | '해경' | '인물' | '풍경'>('frameAttribute');
  const [isGridGuideLine, setIsGridGuideLine] = useGlobalState<boolean>('isGridGuideLine');
  const [, setBgColor] = useGlobalState<string>('bgColor');
  const [, setImgUploadUrl] = useGlobalState<string>('imgUploadUrl');
  const [, setImgUploadLoading] = useGlobalState<boolean>('imgUploadLoading');
  const [selectedFrameList, setSelectedFrameList] = useGlobalState<HTMLCanvasElement[]>('selectedFrameList');
  const [framePrice, setFramePrice] = useGlobalState<FramePrice[]>('framePrice');

  const { getProgressGage } = useProgress();

  const handleImgGoBack = useCallback(() => {
    if (!croppedList?.length || !framePrice?.length || !selectedFrameList?.length) return;
    setCroppedList(croppedList.slice(0, -1));
    setFramePrice(framePrice.slice(0, -1));
    setSelectedFrameList(selectedFrameList.slice(0, -1));
  }, [croppedList, framePrice, selectedFrameList, setCroppedList, setFramePrice, setSelectedFrameList]);

  // 이미지 업로드
  const handleImgReUpload = useCallback(
    async (file: RcFile) => {
      if (!imgSizeChecker(file)) return;
      setImgUploadLoading(true);
      try {
        const fd = new FormData();
        fd.append('image', file);
        await axios
          .post('/canvas/img', fd, {
            onUploadProgress: getProgressGage,
          })
          .then((res) => setImgUploadUrl(res.data || ''));
      } catch (err) {
        alert('이미지 업로드 실패, 괜찮아 다시 시도 ㄱㄱ, 3번시도 부탁');
        console.error(err);
      } finally {
        setImgUploadLoading(false);
      }
      return false;
    },
    [getProgressGage, setImgUploadLoading, setImgUploadUrl],
  );

  const handleImgRatioSetting = useCallback(() => {
    if (!originWidth || !originHeight || !resizeWidth || !resizeHeight) return;
    const [w, h] = getOriginRatio(originWidth, originHeight, resizeWidth, resizeHeight);

    setResizeWidth(+w.toFixed());
    setResizeHeight(+h.toFixed());
  }, [originHeight, originWidth, resizeHeight, resizeWidth, setResizeHeight, setResizeWidth]);

  const handleColorChange = useCallback(
    (color: ColorResult) => {
      const { hex } = color;
      setBgColor(hex);
    },
    [setBgColor],
  );

  const handleShowGridGuideLine = useCallback(() => {
    setIsGridGuideLine(!isGridGuideLine);
  }, [isGridGuideLine, setIsGridGuideLine]);

  const handleGetFrameAttribute = useCallback(
    (e) => {
      const { value } = e.currentTarget;
      setFrameAttribute(value);
    },
    [setFrameAttribute],
  );

  return (
    <>
      <FactoryTool>
        <div>
          {isResizeMode && resizeWidth && resizeHeight && <ToolImageResizerModal />}
          <Button type="text" style={{ opacity: selectedFrameList?.length ? 1 : 0.4 }} onClick={handleImgGoBack}>
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
    </>
  );
};

export default ToolFactory;
