import React, { useEffect, useState } from 'react';
import AppTable from 'src/components/antd/AppTable';
import { Tabs } from 'antd';
import { useMoveTab } from 'src/hooks/useMoveTab';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { getFetcher } from 'src/fetcher';
import { ColumnsType } from 'antd/lib/table';
import { useGetQueryString } from 'src/hooks/useGetQueryString';

const { TabPane } = Tabs;

const canvasOrderColumns = [
  {
    title: '주문번호',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '이름',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '이메일',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '원본',
    dataIndex: 'originImgUrl',
    key: 'originImgUrl',
  },
  {
    title: '주문일자',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
];

const AdminOrderList = () => {
  const { pathname } = useRouter();
  const [defaultTab, handleTabKey, setDefaultTab] = useMoveTab('canvasorder');
  const [columns, setColumns] = useState<ColumnsType<any>>([]);
  const { queryStringify } = useGetQueryString();
  const { data } = useSWR(`/${defaultTab}/?${queryStringify() || `page=1&per_page=10`}` || null, getFetcher);

  useEffect(() => {
    if (pathname === '/admin/canvasorder') {
      setDefaultTab('canvasorder');
      setColumns(() => canvasOrderColumns);
    }
  }, [pathname, setDefaultTab]);

  return (
    <Tabs defaultActiveKey={defaultTab} onTabClick={handleTabKey} activeKey={defaultTab}>
      <TabPane key="canvasorder" tab="주문 목록">
        <AppTable loading={!data} total={data?.total * 20} dataSource={data?.results} isRecord columns={columns} />
      </TabPane>
    </Tabs>
  );
};

export default AdminOrderList;
