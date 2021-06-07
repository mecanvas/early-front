import { Result, Button } from 'antd';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

const Success = () => {
  const router = useRouter();

  const handleRouterByKey = useCallback(
    (e) => {
      const { key } = e.currentTarget.dataset;
      router.push(key);
    },
    [router],
  );

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
