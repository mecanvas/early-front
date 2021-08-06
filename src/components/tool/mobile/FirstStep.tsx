import { Tabs, Divider } from 'antd';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useOpacity } from 'src/hooks/useOpacity';
import { useAppSelector } from 'src/hooks/useRedux';
import FirstFrameListByTab from './first/FirstFrameListByTab';
import { TabTitle, FirstGuideText } from './first/FirstStyle';

const FirstStep = () => {
  const { frameInfoList } = useAppSelector(({ frame }) => frame);
  const [isOpacityOn, setIsOpacityOn] = useState(false);
  const { OpacityComponent } = useOpacity(isOpacityOn);
  const [defaultTab, setDefaultTab] = useState('0');

  const recommandList = useMemo(() => {
    return frameInfoList.filter((lst) => lst.recommand);
  }, [frameInfoList]);

  const frameList = useMemo(() => {
    if (defaultTab === '0') return frameInfoList;
    return frameInfoList.filter((lst) => lst.type === +defaultTab);
  }, [defaultTab, frameInfoList]);

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
        {/* <FirstSelectedList /> */}
      </Tabs.TabPane>

      <Tabs.TabPane key="1" tab={<TabTitle>탁상형</TabTitle>}>
        <OpacityComponent>
          <FirstGuideText>탁상에 놓기 부담없는 사이즈에요!</FirstGuideText>
        </OpacityComponent>
        <FirstFrameListByTab frameList={frameList} />
        <Divider />
        {/* <FirstSelectedList /> */}
      </Tabs.TabPane>

      <Tabs.TabPane key="2" tab={<TabTitle>벽걸이형</TabTitle>}>
        <OpacityComponent>
          <FirstGuideText>벽에 걸기 적합한 사이즈에요!</FirstGuideText>
        </OpacityComponent>
        <FirstFrameListByTab frameList={frameList} />
        <Divider />
        {/* <FirstSelectedList /> */}
      </Tabs.TabPane>
    </Tabs>
  );
};

export default FirstStep;
