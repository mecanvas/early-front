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

      <Tabs.TabPane key="1" tab={<TabTitle>정방형</TabTitle>}>
        <OpacityComponent>
          <FirstGuideText>정사각형 액자입니다. 탁상에 놓기 부담없는 사이즈에요!</FirstGuideText>
        </OpacityComponent>
        <FirstFrameListByTab frameList={frameList} />
        <Divider />
        {/* <FirstSelectedList /> */}
      </Tabs.TabPane>

      <Tabs.TabPane key="2" tab={<TabTitle>세로형</TabTitle>}>
        <OpacityComponent>
          <FirstGuideText>세로가 긴 형태의 직사각형 액자입니다.</FirstGuideText>
        </OpacityComponent>
        <FirstFrameListByTab frameList={frameList} />
        <Divider />
        {/* <FirstSelectedList /> */}
      </Tabs.TabPane>

      <Tabs.TabPane key="3" tab={<TabTitle>가로형</TabTitle>}>
        <OpacityComponent>
          <FirstGuideText>가로가 긴 형태의 직사각형 액자입니다. </FirstGuideText>
        </OpacityComponent>
        <FirstFrameListByTab frameList={frameList} />
        <Divider />
        {/* <FirstSelectedList /> */}
      </Tabs.TabPane>
    </Tabs>
  );
};

export default FirstStep;
