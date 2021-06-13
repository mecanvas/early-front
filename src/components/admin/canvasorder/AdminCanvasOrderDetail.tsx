import { useRouter } from 'next/router';
import React from 'react';
import { Descriptions } from 'antd';
import useSWR from 'swr';
import { adminGetFetcher } from 'src/fetcher';
import { CanvasOrderDetail } from 'src/interfaces/admin/CanvasOrderInterface';

const AdminOrderDetail = () => {
  const router = useRouter();
  const {
    query: { canvasOrderId },
  } = router;

  const { data } = useSWR<CanvasOrderDetail>(canvasOrderId ? `/canvasorder/${canvasOrderId}` : null, adminGetFetcher);

  return (
    <div>
      <Descriptions>
        <Descriptions.Item>kgk</Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default AdminOrderDetail;
