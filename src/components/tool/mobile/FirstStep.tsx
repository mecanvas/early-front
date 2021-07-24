import { Tabs, Divider } from 'antd';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useOpacity } from 'src/hooks/useOpacity';
import { useAppSelector } from 'src/hooks/useRedux';
import FirstFrameListByTab from './first/FirstFrameListByTab';
import FirstSelectedList from './first/FirstSelectedList';
import { TabTitle, FirstGuideText } from './first/FirstStyle';

const FirstStep = () => {
  const { frameInfoList } = useAppSelector(({ frame }) => frame);
  const [isOpacityOn, setIsOpacityOn] = useState(false);
  const { OpacityComponent } = useOpacity(isOpacityOn);

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
    setIsOpacityOn(true);
  }, []);

  useEffect(() => {
    if (isOpacityOn) {
      setIsOpacityOn(false);
    }
  }, [isOpacityOn]);

  return (
    <Tabs defaultActiveKey={defaultTab} onTabClick={handleTabClick} activeKey={defaultTab}>
      <Tabs.TabPane key="0" tab={<TabTitle>추천액자</TabTitle>}>
        <OpacityComponent>
          <FirstGuideText>이런 액자는 어떠세요?</FirstGuideText>
        </OpacityComponent>
        <FirstFrameListByTab frameList={recommandList} />
        <Divider />
        <FirstSelectedList />
      </Tabs.TabPane>

      <Tabs.TabPane key="1" tab={<TabTitle>정사각형</TabTitle>}>
        <OpacityComponent>
          <FirstGuideText>정사각형 액자입니다. 탁상에 놓기 부담없는 사이즈에요!</FirstGuideText>
        </OpacityComponent>
        <FirstFrameListByTab frameList={squareList} />
        <Divider />
        <FirstSelectedList />
      </Tabs.TabPane>

      <Tabs.TabPane key="2" tab={<TabTitle>직사각형</TabTitle>}>
        <OpacityComponent>
          <FirstGuideText>직사각형 액자입니다. 회전으로 가로와 세로를 바꿔 보실 수 있어요!</FirstGuideText>
        </OpacityComponent>
        <FirstFrameListByTab frameList={rectangleList} />
        <Divider />
        <FirstSelectedList />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default FirstStep;
