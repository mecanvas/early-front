import { Form, Input, Button } from 'antd';
import React from 'react';
import styled from '@emotion/styled';

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
  return (
    <Container>
      <Form>
        <Form.Item labelCol={{ span: 2 }} label="ID">
          <Input placeholder="관리자라면 알 ID" />
        </Form.Item>
        <Form.Item labelCol={{ span: 2 }} label="PW">
          <Input placeholder="관리자라면 알 PW" />
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
