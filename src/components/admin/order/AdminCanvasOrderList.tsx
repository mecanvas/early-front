import React, { useEffect, useState } from 'react';
import AppTable from 'src/components/antd/AppTable';
import { Tabs } from 'antd';
import { useMoveTab } from 'src/hooks/useMoveTab';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { adminOrderListFetcher } from 'src/fetcher';
import { ColumnsType } from 'antd/lib/table';
import { useGetQueryString } from 'src/hooks/useGetQueryString';
import { dateFormat } from 'src/utils/dateFormat';
import { CanvasOrderList } from 'src/interfaces/admin/CanvasOrderInterface';
import { canvasDividedOrderColumns, CanvasSingleOrderColumns } from '../columns/order';

const { TabPane } = Tabs;

const AdminOrderList = () => {
  const { pathname } = useRouter();
  const { defaultTab, handleTabKey, setDefaultTab } = useMoveTab('order/divided');
  const [columns, setColumns] = useState<ColumnsType<any>>([]);
  const { queryStringify } = useGetQueryString();
  const { data } = useSWR(`/${defaultTab}/?${queryStringify() || `page=1&per_page=10`}` || null, adminOrderListFetcher);

  useEffect(() => {
    if (pathname === '/admin/order/divided') {
      setDefaultTab('order/divided');
      setColumns(() => canvasDividedOrderColumns);
    }
    if (pathname === '/admin/order/single') {
      setDefaultTab('order/single');
      setColumns(() => CanvasSingleOrderColumns);
    }
  }, [pathname, setDefaultTab]);

  return (
    <Tabs defaultActiveKey={defaultTab} onTabClick={handleTabKey} activeKey={defaultTab}>
      <TabPane key="order/divided" tab="분할 주문">
        <AppTable
          loading={!data}
          total={data?.total}
          dataSource={data?.results.map((res: CanvasOrderList) => ({
            ...res,
            paperNames: res.paperNames.reduce((acc: { [key: string]: number }, cur) => {
              if (acc[cur]) {
                acc[cur] += 1;
              }
              acc[cur] = 1;
              return acc;
            }, {}),
            createdAt: dateFormat(res.createdAt),
            key: res.id,
          }))}
          isRecord
          columns={columns}
        />
      </TabPane>

      <TabPane key="order/single" tab="단일 주문">
        <AppTable
          loading={!data}
          total={data?.total}
          dataSource={data?.results.map((res: CanvasOrderList) => ({
            ...res,
            paperNames: res.paperNames.reduce((acc: { [key: string]: number }, cur) => {
              if (acc[cur]) {
                acc[cur] += 1;
              }
              acc[cur] = 1;
              return acc;
            }, {}),
            createdAt: dateFormat(res.createdAt),
            key: res.id,
          }))}
          isRecord
          columns={columns}
        />
      </TabPane>
    </Tabs>
  );
};

export default AdminOrderList;
