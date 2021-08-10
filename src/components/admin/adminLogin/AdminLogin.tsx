import { Form, Input, Button } from 'antd';
import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';

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
  const handleLogin = useCallback((values: { email: string; password: string }) => {
    console.log(values);
    (async () => {
      await axios.post('/auth/login', values).then((res) => res.data);
    })();
  }, []);

  return (
    <Container>
      <Form onFinish={handleLogin}>
        <Form.Item name="email" labelCol={{ span: 2 }} label="ID">
          <Input placeholder="관리자라면 알 ID" />
        </Form.Item>
        <Form.Item name="password" labelCol={{ span: 2 }} label="PW">
          <Input.Password placeholder="관리자라면 알 PW" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            화긴
          </Button>
        </Form.Item>
      </Form>
    </Container>
  );
};

export default AdminLogin;
