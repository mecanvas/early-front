import { useRouter } from 'next/router';
import React from 'react';
import { Descriptions } from 'antd';

const AdminOrderDetail = () => {
  const router = useRouter();
  console.log(router);
  return (
    <div>
      <Descriptions>
        <Descriptions.Item>kgk</Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default AdminOrderDetail;
