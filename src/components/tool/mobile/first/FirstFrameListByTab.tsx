import { CheckCircleFilled } from '@ant-design/icons';
import { List } from 'antd';
import { icons } from 'public/icons';
import React, { useState, useMemo, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from 'src/hooks/useRedux';
import { FrameInfoList, selectedFrame } from 'src/store/reducers/frame';
import { FirstContent, FirstListItems, FirstFrameWrapper, FirstFramePreview } from './FirstStyle';

const FirstFrameListByTab = ({ frameList }: { frameList: FrameInfoList[] }) => {
  const selectedFrameList = useAppSelector(({ frame }) => frame.selectedFrame);
  const dispatch = useAppDispatch();
  const [showingIndex, setShowingIndex] = useState(0);
  const [isRotate, setisRotate] = useState(false);

  const showingFrame = useMemo(() => {
    const frame = frameList[showingIndex];
    if (frame) {
      return frame;
    }
    return frameList[0];
  }, [frameList, showingIndex]);

  const handleShowingFrameByHover = useCallback((e) => {
    const { index } = e.currentTarget.dataset;
    setShowingIndex(+index);
  }, []);

  const handleRotate = useCallback(() => {
    setisRotate((prev) => !prev);
  }, []);

  const handleSelectFrame = useCallback(
    (e) => {
      const { index } = e.currentTarget.dataset;
      if (!index) return;
      const selectedFrameInfo = frameList[+index];
      dispatch(selectedFrame(selectedFrameInfo));
    },
    [dispatch, frameList],
  );

  return (
    <FirstContent>
      <List
        bordered
        dataSource={frameList}
        renderItem={(item: FrameInfoList, index) => (
          <FirstListItems
            onMouseOver={handleShowingFrameByHover}
            selected={selectedFrameList.some((lst) => lst.type === item.type && lst.name === item.name)}
            data-index={index}
            onClick={handleSelectFrame}
          >
            <div>
              <div>{item.name}</div>
              <div>
                <small>{item.widthCm}cm</small> <small>X</small> <small>{item.heightCm}cm</small>
              </div>
            </div>
            {selectedFrameList.some((lst) => lst.type === item.type && lst.name === item.name) ? (
              <span>
                <CheckCircleFilled />
              </span>
            ) : null}
          </FirstListItems>
        )}
      />
      <FirstFrameWrapper>
        <FirstFramePreview {...showingFrame.size} isRotate={isRotate}>
          <img
            src={
              'https://early-canvas.s3.ap-northeast-2.amazonaws.com/single/upload/%E1%84%92%E1%85%A6%E1%86%AB%E1%84%85%E1%85%B5.png'
            }
          />
          <img src={icons.rotate} onClick={handleRotate} />
        </FirstFramePreview>
        <span>
          <h5>{showingFrame.name}</h5>
        </span>
      </FirstFrameWrapper>
    </FirstContent>
  );
};

export default FirstFrameListByTab;
