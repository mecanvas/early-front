import styled from '@emotion/styled';
import { Result, Tabs } from 'antd';
import { useRouter } from 'next/router';
import { icons } from 'public/icons';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useMoveTab } from 'src/hooks/useMoveTab';
import { resetCanvasState } from 'src/store/reducers/canvas';
import { resetFrameState } from 'src/store/reducers/frame';
import DividedNaverDesc from './DividedNaverDesc';
import SingleNaverDesc from './SingleNaverDesc';

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;

  h3 {
    margin-bottom: 1em;
  }

  h4 {
    font-weight: 500;
  }
`;

export const DescContent = styled.div`
  padding: 2em 0;
`;

export const DescOrder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  img {
    margin: 0 auto;
    max-width: 400px;
    max-height: 400px;
  }
  p {
    margin: 2em 0;
  }
`;

export const DescOrderInformation = styled.div`
  padding-bottom: 1em;
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.color.gray400};
  max-width: 200px;
  padding: 1em;
  width: 100%;
  margin: 0 auto;
`;

export const ImgLinker = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  max-height: 400px;
  margin: 0 auto;
  img {
    width: 100%;
    height: 100%;
  }
  p {
    width: 100%;
    height: 50px;
    line-height: 50px;
    border: 1px solid ${({ theme }) => theme.color.gray400};
    color: ${({ theme }) => theme.color.gray700};
  }

  &:hover {
    opacity: 0.8;
    transition: all 200ms;
  }

  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    p {
      font-size: 13px;
    }
  }
`;

const Success = () => {
  const { defaultTab, setDefaultTab } = useMoveTab('1');
  const dispatch = useDispatch();
  const { query } = useRouter();

  const handleTabKey = (key: string) => {
    setDefaultTab(key);
  };

  useEffect(() => {
    // if (isCanvasSaveDone) {
    //   router.replace('/404');
    // }
    return () => {
      dispatch(resetCanvasState());
      dispatch(resetFrameState());
    };
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

      <h4>주문이 완료되었습니다! 밑의 안내에 따라 진행해 주세요!</h4>
      <Tabs
        style={{ maxWidth: '1000px', width: '100%', padding: '0 5px' }}
        defaultActiveKey={defaultTab}
        onTabClick={handleTabKey}
        activeKey={defaultTab}
      >
        <Tabs.TabPane key="1" tab="스마트스토어">
          {query.divided ? <DividedNaverDesc /> : <SingleNaverDesc />}
        </Tabs.TabPane>
      </Tabs>
    </Container>
  );
};

export default Success;
