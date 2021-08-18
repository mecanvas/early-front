import { Result, Button } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const Error404 = () => {
  const router = useRouter();
  const [count, setCount] = useState(5);
  const handleGoToMainPage = () => {
    router.push('/tool');
  };

  useEffect(() => {
    if (count === 0) {
      router.replace('/tool');
    }
  }, [count, router]);

  useEffect(() => {
    setInterval(() => {
      setCount(count - 1);
    }, 1000);
  }, [count]);

  return (
    <Result
      status="404"
      title="유효하지 않은 페이지입니다."
      subTitle={
        <>
          <span style={{ fontSize: '16px' }}>{count}초 뒤에 메인페이지로 자동 이동합니다.</span>
        </>
      }
      extra={
        <Button type="primary" onClick={handleGoToMainPage}>
          메인 페이지로
        </Button>
      }
    />
  );
};

export default Error404;
