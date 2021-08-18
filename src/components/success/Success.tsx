import styled from '@emotion/styled';
import { Divider, Result, Tabs } from 'antd';
import { icons } from 'public/icons';
import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { S3_URL } from 'src/constants';
import { useMoveTab } from 'src/hooks/useMoveTab';
import { useAppSelector } from 'src/hooks/useRedux';
import { resetCanvasState } from 'src/store/reducers/canvas';
import { resetFrameState } from 'src/store/reducers/frame';

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

const DescContent = styled.div`
  padding: 2em 0;
`;

const DescOrder = styled.div`
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

const DescOrderInformation = styled.div`
  padding-bottom: 1em;
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.color.gray400};
  max-width: 200px;
  padding: 1em;
  width: 100%;
  margin: 0 auto;
`;

const ImgLinker = styled.a`
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
  const { canvasOrder } = useAppSelector((state) => state.canvas);
  const { selectedFrame } = useAppSelector((state) => state.frame);
  const { redirect } = useAppSelector((state) => state.redirects);
  const { defaultTab, setDefaultTab } = useMoveTab('1');
  const dispatch = useDispatch();

  const frame = useMemo(() => selectedFrame[0], [selectedFrame]);

  const url = useMemo(() => {
    if (redirect.naver) {
      return redirect.naver;
    }
  }, [redirect.naver]);

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
          <div style={{ textAlign: 'center' }}>
            <DescContent>
              <h3>- 1 -</h3>
              <p>먼저 아래의 링크로 얼리21 스마트스토어에 들어가 주세요.</p>
              {redirect.naver && url ? (
                <ImgLinker target="_blank" href={`https://smartstore.naver.com/early21/${url.replace('=', '/')}`}>
                  <img
                    src="https://shop-phinf.pstatic.net/20210818_251/16292744909008aQoM_PNG/30410318680101258_485478705.png?type=o640"
                    alt="스마트스토어링크이미지"
                  />
                  <p>클릭해 얼리21 스마트스토어로 이동</p>
                </ImgLinker>
              ) : (
                <ImgLinker target="_blank" href={`https://smartstore.naver.com/early21/products/5798217286}`}>
                  <img
                    src="https://shop-phinf.pstatic.net/20210818_251/16292744909008aQoM_PNG/30410318680101258_485478705.png?type=o640"
                    alt="스마트스토어링크이미지"
                  />
                  <p>클릭해 얼리21 스마트스토어로 이동</p>
                </ImgLinker>
              )}
            </DescContent>
            <Divider />
            <DescContent>
              <h3>- 2 -</h3>
              <p>스마트스토어로 돌아가 주문하신 정보와 일치하도록 선택해 주세요.</p>
              {frame && (
                <>
                  <p>주문하신 정보는 다음과 같습니다.</p>
                  <DescOrderInformation>
                    <span>{frame.name}</span>
                    <span>
                      {frame.widthCm}cm x {frame.heightCm}cm
                    </span>
                    <div>{canvasOrder.scaleType === 2 ? `옆면 확장` : '기본 옆면'}</div>
                  </DescOrderInformation>
                </>
              )}
              <DescOrder>
                <div>
                  <img src={`${S3_URL}/img/guide/editor-order.png`} alt="에디터주문 선택" />
                  <p>
                    <b>주문방식</b>에서 <b>에디터주문</b>을 선택해 주세요.
                  </p>
                </div>
                <div>
                  <img src={`${S3_URL}/img/guide/size-select.png`} alt="액자 선택" />
                  <p>
                    <b>액자 사이즈</b>에서 <b>주문하신 액자와 같은 액자를</b> 선택해 주세요.
                  </p>
                </div>
                <div>
                  <img src={`${S3_URL}/img/guide/expand.png`} alt="액자 옆면 선택" />
                  <p>
                    <b>옆면 확장 여부</b> 역시 <b>주문하신 액자의 옆면 설정</b>과 같게 선택해 주세요.
                  </p>
                </div>
                <div>
                  <img src={`${S3_URL}/img/guide/quy.png`} alt="액자 개수 선택" />
                  <p>
                    만일 같은 디자인의 캔버스를 <b>2개 이상을 주문하신다면, 개수를 조절</b>해 주세요.
                  </p>
                </div>
              </DescOrder>
            </DescContent>
            <Divider />
            <DescContent>
              <h3>- 3 -</h3>
              <div>
                <b>주문하신 분의 성함 및 정보</b>는 <b>저장 시 입력한 성함으로 입력</b>해 주세요.
              </div>
            </DescContent>
            <Divider />
          </div>
        </Tabs.TabPane>
      </Tabs>
    </Container>
  );
};

export default Success;
