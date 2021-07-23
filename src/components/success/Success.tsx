import styled from '@emotion/styled';
import { Result, Tabs } from 'antd';
import { icons } from 'public/icons';
import React, { useEffect } from 'react';
import { useGlobalState } from 'src/hooks';
import { useMoveTab } from 'src/hooks/useMoveTab';

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100vh;

  h4 {
    font-weight: 500;
  }
`;

const Success = () => {
  const [isDone, setIsDone] = useGlobalState<boolean>('isDone');
  const { defaultTab, setDefaultTab } = useMoveTab('1');

  const handleTabKey = (key: string) => {
    setDefaultTab(key);
  };

  useEffect(() => {
    if (!isDone) {
      // router.replace('/404');
      return;
    }
    setIsDone(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Result
        status="success"
        icon={<img src={icons.man} width={250} height={250} />}
        title="구매 페이지로 돌아가 결제를 진행해 주세요."
        subTitle="만드신 캔버스는 성공적으로 저장됐습니다!"
      />
      <h4>어떻게 진행하는지 모르시겠다면?</h4>
      <Tabs
        style={{ maxWidth: '1000px', width: '100%', padding: '0 5px' }}
        defaultActiveKey={defaultTab}
        onTabClick={handleTabKey}
        activeKey={defaultTab}
      >
        <Tabs.TabPane key="1" tab="스마트스토어 구매">
          네이붜
        </Tabs.TabPane>
      </Tabs>
    </Container>
  );
};

export default Success;
