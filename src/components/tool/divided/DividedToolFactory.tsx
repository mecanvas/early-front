import { Button, Upload, Popover } from 'antd';
import { RcFile } from 'antd/lib/upload';
import React, { useCallback } from 'react';
import { ColorResult } from 'react-color';
import { useGlobalState } from 'src/hooks';
import { useProgress } from 'src/hooks/useProgress';
import { CroppedFrame, FramePrice } from 'src/interfaces/ToolInterface';
import { getOriginRatio } from 'src/utils/getOriginRatio';
import { imgSizeChecker } from 'src/utils/imgSizeChecker';
import ToolImageResizerModal from './DividedToolImageResizerModal';
import ToolColorPalette from './DividedToolColorPalette';
import { FactoryTool, FrameTool } from './DividedToolStyle';
import { icons } from 'public/icons';
import { mockPostImageUpload } from 'src/utils';

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
  const [frameAttribute, setFrameAttribute] = useGlobalState<'정방' | '인물' | '풍경'>('frameAttribute', '정방');
  const [isGridGuideLine, setIsGridGuideLine] = useGlobalState<boolean>('isGridGuideLine');
  const [, setBgColor] = useGlobalState<string>('bgColor');
  const [imgUploadUrl, setImgUploadUrl] = useGlobalState<string>('imgUploadUrl');
  const [, setImgUploadLoading] = useGlobalState<boolean>('imgUploadLoading');
  const [framePrice, setFramePrice] = useGlobalState<FramePrice[]>('framePrice');

  const { getProgressGage } = useProgress();

  const handleImgGoBack = useCallback(() => {
    if (!croppedList?.length || !framePrice?.length) return;
    setCroppedList(croppedList.slice(0, -1));
    setFramePrice(framePrice.slice(0, -1));
  }, [croppedList, framePrice, setCroppedList, setFramePrice]);

  // 이미지 업로드
  const handleImgReUpload = useCallback(
    async (file: RcFile) => {
      if (!imgSizeChecker(file)) return;
      setImgUploadLoading(true);
      try {
        const fd = new FormData();
        fd.append('image', file);
        await mockPostImageUpload(file, getProgressGage).then((res) => {
          setImgUploadUrl(res || '');
        });
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
          <Upload accept="image/*" beforeUpload={handleImgReUpload} showUploadList={false}>
            <Button type="text">
              <img src={icons.imgUpload} style={{ width: '22px' }} />
            </Button>
          </Upload>
          {isResizeMode && resizeWidth && resizeHeight && <ToolImageResizerModal />}
          <Button type="text" style={{ opacity: croppedList?.length ? 1 : 0.4 }} onClick={handleImgGoBack}>
            <img src={icons.undo} />
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

          <Button type="text" onClick={handleShowGridGuideLine}>
            <img src={icons.grid} />
          </Button>

          <Button type="text" onClick={handleImgRatioSetting}>
            <img src={icons.ratioFrame} style={{ width: '24px' }} />
          </Button>
        </div>
        {imgUploadUrl && (
          <FrameTool>
            <Button
              type={frameAttribute === '정방' ? 'primary' : 'text'}
              onClick={handleGetFrameAttribute}
              value="정방"
            >
              정방
            </Button>
            <Button
              type={frameAttribute === '인물' ? 'primary' : 'text'}
              onClick={handleGetFrameAttribute}
              value="인물"
            >
              인물
            </Button>
            <Button
              type={frameAttribute === '풍경' ? 'primary' : 'text'}
              onClick={handleGetFrameAttribute}
              value="풍경"
            >
              풍경
            </Button>
          </FrameTool>
        )}
      </FactoryTool>
    </>
  );
};

export default ToolFactory;
