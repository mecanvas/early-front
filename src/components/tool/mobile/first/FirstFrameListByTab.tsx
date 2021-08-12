import { CheckCircleFilled } from '@ant-design/icons';
import { List } from 'antd';
import { icons } from 'public/icons';
import React, { useState, useMemo, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from 'src/hooks/useRedux';
import { FrameInfoList, rotateSelectedFrameList, selectedFrame } from 'src/store/reducers/frame';
import { FirstContent, FirstListItems, FirstFrameWrapper, FirstFramePreview } from './FirstStyle';

const FirstFrameListByTab = ({ frameList }: { frameList: FrameInfoList[] }) => {
  const selectedFrameList = useAppSelector(({ frame }) => frame.selectedFrame);
  const dispatch = useAppDispatch();
  const [showingIndex, setShowingIndex] = useState(0);

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

  const handleLeave = useCallback(() => {
    if (!selectedFrameList[0]) return;
    const selectedId = selectedFrameList[0].id;
    const selectedType = selectedFrameList[0].type;
    const showingIndex = frameList.findIndex((lst) => lst.type === selectedType && lst.id === selectedId);
    setShowingIndex(showingIndex);
  }, [frameList, selectedFrameList]);

  const handleSelectFrame = useCallback(
    (e) => {
      const { index } = e.currentTarget.dataset;
      if (!index) return;
      const selectedFrameInfo = frameList[+index];
      dispatch(selectedFrame(selectedFrameInfo));
    },
    [dispatch, frameList],
  );

  const handleFrameRotate = useCallback(
    (e) => {
      const { type, id } = e.currentTarget.dataset;

      if (!type || !id) return;

      dispatch(rotateSelectedFrameList({ type: +type, id: +id }));
    },
    [dispatch],
  );

  return (
    <FirstContent>
      <List
        bordered
        dataSource={frameList}
        renderItem={(item: FrameInfoList, index) => (
          <FirstListItems
            onMouseLeave={handleLeave}
            onMouseOver={handleShowingFrameByHover}
            selected={selectedFrameList.some((lst) => lst.type === item.type && lst.name === item.name)}
            data-index={index}
            onClick={handleSelectFrame}
          >
            <div>
              <span>{item.widthCm}cm</span> <span>X</span> <span>{item.heightCm}cm</span>
              <div>
                <small>{item.name}</small>
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
        <FirstFramePreview>
          {selectedFrameList[0] ? (
            <>
              <img
                src={`https://early21-assets.s3.ap-northeast-2.amazonaws.com/img/example/${selectedFrameList[0]?.name
                  .replace('-', '')
                  .replace('호', '')}${
                  selectedFrameList[0]?.type !== 1 && selectedFrameList[0]?.isRotate ? '-rotate' : ''
                }.png`}
                alt="액자 샘플 사진"
              />
            </>
          ) : (
            <>
              <img
                src={`https://early21-assets.s3.ap-northeast-2.amazonaws.com/img/example/${showingFrame?.name
                  .replace('-', '')
                  .replace('호', '')}.png`}
                alt="액자 샘플 사진"
              />
            </>
          )}
        </FirstFramePreview>
        <span>
          <h5>{showingFrame.name}</h5>
          <img
            src={icons.rotate}
            alt="액자 회전 아이콘"
            onClick={handleFrameRotate}
            data-type={selectedFrameList[0]?.type}
            data-id={selectedFrameList[0]?.id}
          />
        </span>
      </FirstFrameWrapper>
    </FirstContent>
  );
};

export default FirstFrameListByTab;
