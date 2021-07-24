import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Tabs, List } from 'antd';
import { icons } from 'public/icons';
import React, { useCallback, useMemo, useState } from 'react';
import { useAppSelector } from 'src/hooks/useRedux';
import { FrameInfoList } from 'src/store/reducers/frame';

const TabTitle = styled.span`
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    font-size: 13px;
  }
`;

const FirstContent = styled.div`
  display: grid;
  gap: 1em;
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    justify-content: space-between;
  }
`;

const FirstGuideText = styled.h5``;

const FirstListItems = styled(List.Item)`
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.color.gray000};
  }
`;

const FirstFrameWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.color.gray100};
  border-radius: 8px;
  padding: 3em 0;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    margin-top: 1em;
  }
`;

const FirstFramePreview = styled.div<{ width: number; height: number }>`
  position: relative;
  ${({ width, height, theme }) =>
    width &&
    height &&
    css`
      background-color: ${theme.color.white};
      width: ${width / 2}px;
      height: ${height / 2}px;
      border: 1px solid ${theme.color.gray400};
    `}

  img {
    cursor: pointer;
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
  }
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
  }
`;

const FirstFrameListByTab = ({ frameList }: { frameList: FrameInfoList[] }) => {
  const [showingIndex, setShowingIndex] = useState(0);

  const showingSize = useMemo(() => {
    const frame = frameList[showingIndex];
    if (frame) {
      return frame.size;
    }
    return frameList[0].size;
  }, [frameList, showingIndex]);

  const handleShowingFrameByHover = useCallback((e) => {
    const { index } = e.currentTarget.dataset;
    setShowingIndex(+index);
  }, []);

  return (
    <FirstContent>
      <List
        bordered
        dataSource={frameList}
        renderItem={(item: FrameInfoList, index) => (
          <FirstListItems onMouseOver={handleShowingFrameByHover} data-index={index}>
            <div>
              <div>{item.name}</div>
              <div>
                <small>{item.widthCm}cm</small> <small>X</small> <small>{item.heightCm}cm</small>
              </div>
            </div>
          </FirstListItems>
        )}
      />
      <FirstFrameWrapper>
        <FirstFramePreview {...showingSize}>
          <img src={icons.rotate} />
        </FirstFramePreview>
      </FirstFrameWrapper>
    </FirstContent>
  );
};

const FirstStep = () => {
  const { frameInfoList } = useAppSelector(({ frame }) => frame);

  const squareList = useMemo(() => {
    return frameInfoList.filter((lst) => lst.type === 1);
  }, [frameInfoList]);

  const rectangleList = useMemo(() => {
    return frameInfoList.filter((lst) => lst.type === 2);
  }, [frameInfoList]);

  const [defaultTab, setDefaultTab] = useState('0');

  const handleTabClick = useCallback((key: string) => {
    setDefaultTab(key);
  }, []);

  return (
    <Tabs defaultActiveKey={defaultTab} onTabClick={handleTabClick} activeKey={defaultTab}>
      <Tabs.TabPane key="0" tab={<TabTitle>추천액자</TabTitle>}>
        <FirstGuideText>이런 액자는 어떠세요?</FirstGuideText>
        <FirstFrameListByTab frameList={squareList} />
      </Tabs.TabPane>

      <Tabs.TabPane key="1" tab={<TabTitle>정사각형</TabTitle>}>
        <FirstGuideText>정사각형 액자입니다. 탁상에 놓기 부담없는 사이즈에요!</FirstGuideText>
        <FirstFrameListByTab frameList={squareList} />
      </Tabs.TabPane>

      <Tabs.TabPane key="2" tab={<TabTitle>직사각형</TabTitle>}>
        <FirstGuideText>직사각형 액자입니다. 회전으로 가로와 세로를 바꿀 수 있어요!</FirstGuideText>
        <FirstFrameListByTab frameList={rectangleList} />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default FirstStep;
