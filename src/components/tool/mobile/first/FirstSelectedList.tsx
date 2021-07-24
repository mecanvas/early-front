import { List } from 'antd';
import React from 'react';
import { useAppSelector } from 'src/hooks/useRedux';
import { FrameInfoList } from 'src/store/reducers/frame';
import { FirstListItems, FirstSelectedFrameList } from './FirstStyle';

const FirstSelectedList = () => {
  const selectedFrame = useAppSelector(({ frame }) => frame.selectedFrame);

  return (
    <FirstSelectedFrameList>
      <h5>이렇게 선택하셨네요!</h5>
      <List
        bordered
        dataSource={selectedFrame}
        locale={{ emptyText: <div>선택하신 액자가 없어요!</div> }}
        renderItem={(item: FrameInfoList) => (
          <FirstListItems>
            <div>
              <div>{item.name}</div>
              <small>{item.widthCm}cm</small> <small>X</small> <small>{item.heightCm}cm</small>
            </div>
          </FirstListItems>
        )}
      />
    </FirstSelectedFrameList>
  );
};

export default FirstSelectedList;
