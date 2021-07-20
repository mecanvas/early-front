import { Result } from 'antd';
import { icons } from 'public/icons';
import React, { useEffect } from 'react';
import { useGlobalState } from 'src/hooks';

const Success = () => {
  const [isDone, setIsDone] = useGlobalState<boolean>('isDone');

  // const handleRouterByKey = useCallback(
  //   (e) => {
  //     const { key } = e.currentTarget.dataset;
  //     router.push(key);
  //   },
  //   [router],
  // );

  useEffect(() => {
    if (!isDone) {
      // router.replace('/404');
      return;
    }
    setIsDone(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Result
      status="success"
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100vh',
      }}
      icon={<img src={icons.man} width={250} height={250} />}
      title="구매 페이지로 돌아가 결제를 진행해 주세요."
      subTitle="만드신 캔버스는 성공적으로 저장됐습니다!"
      extra={
        [
          // <Button type="primary" data-key="/" onClick={handleRouterByKey}>
          //   메인 페이지로 가기
          // </Button>,
          // <Button data-key="/tool" onClick={handleRouterByKey}>
          //   나만의 캔버스 제작
          // </Button>,
        ]
      }
    />
  );
};

export default Success;
