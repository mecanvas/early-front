import { List } from 'antd';
import React, { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import { deleteSelectedFrame, FrameInfoList } from 'src/store/reducers/frame';
import { FirstListItems, FirstSelectedFrameList } from './FirstStyle';

const FirstSelectedList = () => {
  const dispatch = useAppDispatch();
  const selectedFrame = useAppSelector(({ frame }) => frame.selectedFrame);

  const handleDeleteItem = useCallback(
    (e) => {
      const { name } = e.currentTarget.dataset;
      dispatch(deleteSelectedFrame(name));
    },
    [dispatch],
  );

  return (
    <FirstSelectedFrameList>
      {selectedFrame.length ? <h5>이렇게 선택하셨네요!</h5> : null}
      <List
        bordered
        dataSource={selectedFrame}
        locale={{ emptyText: <div>선택하신 액자가 없어요!</div> }}
        renderItem={(item: FrameInfoList) => (
          <FirstListItems onClick={handleDeleteItem} data-name={item.name}>
            <div>
              <div>{item.name}</div>
              <small>{item.widthCm}cm</small> <small>X</small> <small>{item.heightCm}cm</small>
            </div>
            <span>X</span>
          </FirstListItems>
        )}
      />
    </FirstSelectedFrameList>
  );
};

export default FirstSelectedList;
