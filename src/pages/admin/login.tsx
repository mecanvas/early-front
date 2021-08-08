import React from 'react';
import { Button, Form, Input } from 'antd';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

const Login = () => {
  return (
    <div>
      <Form>
        <Form.Item>
          <Input placeholder="관리자라면 알 ID" />
        </Form.Item>
        <Form.Item>
          <Input placeholder="관리자라면 알 PW" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            화긴
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = (ctx: GetServerSidePropsContext) => {};
