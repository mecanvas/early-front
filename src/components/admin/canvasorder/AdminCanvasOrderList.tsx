import React, { useEffect, useState } from 'react';
import AppTable from 'src/components/antd/AppTable';
import { Tabs, Tag } from 'antd';
import { useMoveTab } from 'src/hooks/useMoveTab';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { adminGetFetcher } from 'src/fetcher';
import { ColumnsType } from 'antd/lib/table';
import { useGetQueryString } from 'src/hooks/useGetQueryString';
import { dateFormat } from 'src/utils/dateFormat';
import Img from 'src/components/common/Img';
import { CanvasOrderList } from 'src/interfaces/admin/CanvasOrderInterface';

const { TabPane } = Tabs;

const canvasOrderColumns = [
  {
    title: '주문번호',
    dataIndex: 'orderNo',
    key: 'orderNo',
  },
  {
    title: '원본',
    dataIndex: 'originImgUrl',
    key: 'originImgUrl',
    render: (originImgUrl: string) => {
      return <Img src={originImgUrl} alt="원본 사진" maxHeight={150}></Img>;
    },
  },
  {
    title: '이름',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '연락처',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '주문 호 x 장',
    dataIndex: 'paperNames',
    key: 'paperNames',
    render: (paperNames: { [key: string]: number }) => {
      const names = Object.entries(paperNames);
      return (
        <>
          {names.map(([key, value], index) => (
            <Tag
              key={index}
              color="blue"
              style={{
                padding: '5px',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                marginBottom: '3px',
                width: 'fit-content',
              }}
            >
              {key} X {value}장
            </Tag>
          ))}
        </>
      );
    },
  },
  {
    title: '주문일자',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
];

const AdminOrderList = () => {
  const { pathname } = useRouter();
  const [defaultTab, handleTabKey, setDefaultTab] = useMoveTab('order/divided');
  const [columns, setColumns] = useState<ColumnsType<any>>([]);
  const { queryStringify } = useGetQueryString();
  const { data } = useSWR(`/${defaultTab}/?${queryStringify() || `page=1&per_page=10`}` || null, adminGetFetcher);

  useEffect(() => {
    if (pathname === '/admin/order/divided') {
      setDefaultTab('order/divided');
      setColumns(() => canvasOrderColumns);
    }
    if (pathname === '/admin/order/single') {
      setDefaultTab('order/single');
      setColumns(() => canvasOrderColumns);
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
