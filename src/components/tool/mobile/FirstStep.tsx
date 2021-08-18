import { Tabs } from 'antd';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetQueryString } from 'src/hooks/useGetQueryString';
import { useOpacity } from 'src/hooks/useOpacity';
import { useAppSelector } from 'src/hooks/useRedux';
import { setRedirect } from 'src/store/reducers/redirects';
import FirstFrameListByTab from './first/FirstFrameListByTab';
import { TabTitle, FirstGuideText } from './first/FirstStyle';

const FirstStep = () => {
  const { frameInfoList } = useAppSelector(({ frame }) => frame);
  const { queryStringify } = useGetQueryString();
  const dispatch = useDispatch();
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

  useEffect(() => {
    const query = queryStringify();
    if (!query) return;
    dispatch(setRedirect({ name: 'naver', value: query }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryStringify]);

  return (
    <Tabs defaultActiveKey={defaultTab} onTabClick={handleTabClick} activeKey={defaultTab}>
      <Tabs.TabPane key="0" tab={<TabTitle>추천액자</TabTitle>}>
        <OpacityComponent>
          <FirstGuideText>이런 액자는 어떠세요?</FirstGuideText>
        </OpacityComponent>
        <FirstFrameListByTab frameList={recommandList} />
        {/* <FirstSelectedList /> */}
      </Tabs.TabPane>

      <Tabs.TabPane key="1" tab={<TabTitle>정사각형</TabTitle>}>
        <OpacityComponent>
          <FirstGuideText>탁상에 놓기 부담없는 사이즈에요!</FirstGuideText>
        </OpacityComponent>
        <FirstFrameListByTab frameList={frameList} />
        {/* <FirstSelectedList /> */}
      </Tabs.TabPane>

      <Tabs.TabPane key="2" tab={<TabTitle>직사각형</TabTitle>}>
        <OpacityComponent>
          <FirstGuideText>벽에 걸기 적합한 사이즈에요!</FirstGuideText>
        </OpacityComponent>
        <FirstFrameListByTab frameList={frameList} />
        {/* <FirstSelectedList /> */}
      </Tabs.TabPane>
    </Tabs>
  );
};

export default FirstStep;
