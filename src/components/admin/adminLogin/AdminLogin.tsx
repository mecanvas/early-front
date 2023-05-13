import { Form, Input, Button } from 'antd';
import React, { useCallback, useEffect } from 'react';
import styled from '@emotion/styled';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import router from 'next/router';
import Loading from 'src/components/common/Loading';
import { postUserLogin } from 'src/store/api/user/user';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 40vh;

  form {
    max-width: 500px;
    width: 100%;
    padding: 0 1em;
  }

  button {
    margin: 0 auto;
    width: 150px;
  }
`;

const AdminLogin = () => {
  const dispatch = useAppDispatch();
  const { isUserLoad, userData } = useAppSelector((state) => state.user);
  const handleLogin = useCallback(
    (values: { email: string; password: string }) => {
      dispatch(postUserLogin(values));
      router.push('/admin');
    },
    [dispatch],
  );

  useEffect(() => {
    if (userData) {
      if (userData?.role !== 1) {
        alert('당신은 관리자가 아닙니다.');
        router.push('/');
      }
    }
  }, [userData, userData?.role]);

  return (
    <Container>
      <Loading loading={isUserLoad} />
      <Form onFinish={handleLogin}>
        <Form.Item name="email" labelCol={{ span: 2 }} label="ID">
          <Input placeholder="관리자라면 알 ID" />
        </Form.Item>
        <Form.Item name="password" labelCol={{ span: 2 }} label="PW">
          <Input.Password placeholder="관리자라면 알 PW" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            확인
          </Button>
        </Form.Item>
      </Form>
    </Container>
  );
};

export default AdminLogin;
