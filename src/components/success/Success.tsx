import { Result, Button } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useCallback } from 'react';
import { useGlobalState } from 'src/hooks';

const Success = () => {
  const router = useRouter();
  const [isDone, setIsDone] = useGlobalState<boolean>('isDone');

  const handleRouterByKey = useCallback(
    (e) => {
      const { key } = e.currentTarget.dataset;
      router.push(key);
    },
    [router],
  );

  useEffect(() => {
    if (!isDone) {
      router.replace('/404');
      return;
    }
    setIsDone(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Result
      status="success"
      icon={
        <img
          src="https://mecanvas-assets.s3.ap-northeast-2.amazonaws.com/assets/12312412.webp"
          width={400}
          height={300}
        />
      }
      title="만드신 캔버스를 성공적으로 저장했어오!"
      subTitle="주문하신 캔버스는 곧 배송됩니다요~"
      extra={[
        <Button type="primary" data-key="/" onClick={handleRouterByKey}>
          메인 페이지로 가기
        </Button>,
        <Button data-key="/tool" onClick={handleRouterByKey}>
          나만의 캔버스 제작
        </Button>,
      ]}
    />
  );
};

export default Success;
