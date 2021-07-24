import { Tabs, Divider } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { useAppSelector } from 'src/hooks/useRedux';
import FirstFrameListByTab from './first/FirstFrameListByTab';
import FirstSelectedList from './first/FirstSelectedList';
import { TabTitle, FirstGuideText } from './first/FirstStyle';

const FirstStep = () => {
  const { frameInfoList } = useAppSelector(({ frame }) => frame);

  const recommandList = useMemo(() => {
    return frameInfoList.filter((lst) => lst.recommand);
  }, [frameInfoList]);

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
        <FirstFrameListByTab frameList={recommandList} />
        <Divider />
        <FirstSelectedList />
      </Tabs.TabPane>

      <Tabs.TabPane key="1" tab={<TabTitle>정사각형</TabTitle>}>
        <FirstGuideText>정사각형 액자입니다. 탁상에 놓기 부담없는 사이즈에요!</FirstGuideText>
        <FirstFrameListByTab frameList={squareList} />
        <Divider />
        <FirstSelectedList />
      </Tabs.TabPane>

      <Tabs.TabPane key="2" tab={<TabTitle>직사각형</TabTitle>}>
        <FirstGuideText>직사각형 액자입니다. 회전으로 가로와 세로를 바꿀 수 있어요!</FirstGuideText>
        <FirstFrameListByTab frameList={rectangleList} />
        <Divider />
        <FirstSelectedList />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default FirstStep;
