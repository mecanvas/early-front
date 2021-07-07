import {
  faEdit,
  faUndo,
  faImage,
  faPaintRoller,
  faRulerHorizontal,
  faCompress,
  faSquare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Upload, Popover, Modal, Checkbox, Input } from 'antd';
import { RcFile } from 'antd/lib/upload';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { ColorResult } from 'react-color';
import { useGlobalState } from 'src/hooks';
import { useProgress } from 'src/hooks/useProgress';
import { CroppedFrame, FramePrice } from 'src/interfaces/ToolInterface';
import { getOriginRatio } from 'src/utils/getOriginRatio';
import { imgSizeChecker } from 'src/utils/imgSizeChecker';
import ToolColorPalette from './divided/DividedToolColorPalette';
import { FactoryTool, FrameTool, ImageShowingWidthHeight } from './divided/DividedToolStyle';

const ToolFactory = () => {
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
  const [croppedList, setCroppedList] = useGlobalState<CroppedFrame[]>('croppedList');

  const { getProgressGage } = useProgress();
  const [ratioPersist, setRatioPersist] = useState(true);
  const [imgModalResizeOpen, setImgModalResizeOpen] = useState(false);

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
  }, [originHeight, originWidth, resizeHeight, resizeWidth, setResizeHeight, setResizeWidth]);

  const handleResizeReset = useCallback(() => {
    if (!originWidth || !originHeight) return;
    setResizeWidth(originWidth);
    setResizeHeight(originHeight);
  }, [setResizeWidth, originWidth, setResizeHeight, originHeight]);

  const handleRatioPersist = useCallback(() => {
    setRatioPersist((prev) => !prev);
  }, []);

  // 이미지 사이즈를 변경 입력
  const handleChangeImgSize = useCallback(
    (e) => {
      if (!originHeight || !originWidth) return;

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
    [originHeight, originWidth, ratioPersist, setResizeHeight, setResizeWidth],
  );

  const handleModalResize = useCallback(() => {
    setImgModalResizeOpen((prev) => !prev);
  }, []);

  const handleModalResizeOk = useCallback(() => {
    setImgModalResizeOpen((prev) => !prev);
  }, []);

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
          {isResizeMode && resizeWidth && resizeHeight && (
            <>
              <ImageShowingWidthHeight>
                {`${resizeWidth?.toFixed()}px X ${resizeHeight?.toFixed()}px`}
                <span onClick={handleModalResize}>
                  <FontAwesomeIcon icon={faEdit} />
                </span>
              </ImageShowingWidthHeight>
            </>
          )}
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
    </>
  );
};

export default ToolFactory;
