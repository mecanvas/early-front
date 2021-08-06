import styled from '@emotion/styled';
import { Result, Tabs } from 'antd';
import router from 'next/router';
import { icons } from 'public/icons';
import React, { useEffect } from 'react';
import { useMoveTab } from 'src/hooks/useMoveTab';
import { useAppSelector } from 'src/hooks/useRedux';

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
  const { canvasOrder, isCanvasSaveDone } = useAppSelector((state) => state.canvas);
  const { selectedFrame } = useAppSelector((state) => state.frame);
  const { defaultTab, setDefaultTab } = useMoveTab('1');

  const handleTabKey = (key: string) => {
    setDefaultTab(key);
  };

  useEffect(() => {
    if (isCanvasSaveDone) {
      router.replace('/404');
      return;
    }
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
        <Tabs.TabPane key="1" tab="스마트스토어">
          <ul>
            <li>
              <div>여기는 사진을 넣장</div>
              <p>
                스마트스토어로 돌아가 저장한 정보와 일치하도록 선택해 주세요.
                <br />
                주문하신 정보는 다음과 같습니다.
              </p>
              <div>
                <span>{selectedFrame[0]?.name}</span>
                <span>
                  {selectedFrame[0]?.widthCm}cm x {selectedFrame[0]?.heightCm}cm
                </span>
              </div>
              <div>{canvasOrder.scaleType === 2 ? `옆면 확장` : '기본 옆면'}</div>
            </li>
            <li>
              <div>여기는 사진을 넣장</div>
              <p>추가 옵션엔 '에디터 주문'을 선택해 주세요.</p>
            </li>
          </ul>
        </Tabs.TabPane>
      </Tabs>
    </Container>
  );
};

export default Success;
