import { Tag } from 'antd';
import React from 'react';
import Img from 'src/components/common/Img';

const TYPE = new Map();
TYPE.set(1, '네이버');
TYPE.set(2, '쿠팡');
TYPE.set(3, '아이디어스');

export const canvasDividedOrderColumns = [
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
    title: '주문경로',
    dataIndex: 'orderRoute',
    key: 'orderRoute',
    render: (orderRoute: number) => TYPE.get(orderRoute),
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

export const CanvasSingleOrderColumns = [
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
    title: '주문경로',
    dataIndex: 'orderRoute',
    key: 'orderRoute',
    render: (orderRoute: number) => TYPE.get(orderRoute),
  },
  {
    title: '주문 호',
    dataIndex: 'paperNames',
    key: 'paperNames',
    render: (paperNames: { [key: string]: number }) => {
      const names = Object.entries(paperNames);
      return (
        <>
          {names.map(([key], index) => (
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
              {key}
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
