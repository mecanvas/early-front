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
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '원본',
    dataIndex: 'originImgUrl',
    key: 'originImgUrl',
    render: (originImgUrl: string) => {
      return <Img src={originImgUrl} alt="원본 사진"></Img>;
    },
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
  const [defaultTab, handleTabKey, setDefaultTab] = useMoveTab('canvasorder');
  const [columns, setColumns] = useState<ColumnsType<any>>([]);
  const { queryStringify } = useGetQueryString();
  const { data } = useSWR(`/${defaultTab}/?${queryStringify() || `page=1&per_page=10`}` || null, adminGetFetcher);

  useEffect(() => {
    if (pathname === '/admin/canvasorder') {
      setDefaultTab('canvasorder');
      setColumns(() => canvasOrderColumns);
    }
  }, [pathname, setDefaultTab]);

  return (
    <Tabs defaultActiveKey={defaultTab} onTabClick={handleTabKey} activeKey={defaultTab}>
      <TabPane key="canvasorder" tab="주문 목록">
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
