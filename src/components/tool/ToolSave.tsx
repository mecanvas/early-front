import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Input, Form, Select } from 'antd';
import { useCanvasToServer, useGlobalState } from 'src/hooks';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { BillTotal } from './divided/DividedToolStyle';
import AppTable from 'src/components/antd/AppTable';

// Global
// framePrice
// isSavaCanvas
// selectedFrameList

const AntdInput = styled(Input)<{ isRequired: boolean }>`
  ${({ isRequired, theme }) =>
    isRequired
      ? css`
          border: 1px solid ${theme.color.red};
        `
      : css`
          border: 1px solid inherit;
        `}
`;

const AntdSelect = styled(Select)<{ isRequired: boolean }>`
  ${({ isRequired, theme }) =>
    isRequired
      ? css`
          border: 1px solid ${theme.color.red};
        `
      : css`
          border: 1px solid inherit;
        `}
`;

const SaveModalOrderColumns = [
  { title: '호수', dataIndex: 'name', key: 'name' },
  { title: '실측', dataIndex: 'cm', key: 'cm' },
  { title: '개수', dataIndex: 'quantity', key: 'quantity' },
  { title: '가격', dataIndex: 'price', key: 'price', render: (price: number) => price.toLocaleString() },
];

export interface OrderInfo {
  [key: string]: any;
  username: string;
  phone: string;
  orderRoute: string;
}

interface Props {
  yourPriceList?: [string, any][];
  totalPrice?: number;
}

const ToolSave = ({ yourPriceList, totalPrice }: Props) => {
  const [info, setInfo] = useState<OrderInfo | null>(null);
  const [userNameEmpty, setUserNameEmpty] = useState({ isRequired: false, extra: '' });
  const [phoneEmpty, setPhoneEmpty] = useState({ isRequired: false, extra: '' });
  const [orderRouteEmpty, setOrderRouteEmpty] = useState({ isRequired: false, extra: '' });
  const [isSaveCanvas, setIsSaveCanvas] = useGlobalState<boolean>('saveModal');
  const [selectedFrameList] = useGlobalState<HTMLCanvasElement[]>('selectedFrameList');
  const { canvasToImage, loading, isDone } = useCanvasToServer();
  const router = useRouter();

  const handleVisible = useCallback(() => {
    setIsSaveCanvas(false);
  }, [setIsSaveCanvas]);

  const resetEmpty = useCallback(
    (
      setState: React.Dispatch<
        React.SetStateAction<{
          isRequired: boolean;
          extra: string;
        }>
      >,
    ) => {
      setState({ isRequired: false, extra: '' });
    },
    [],
  );

  const handleSelectOrderRoute = useCallback(
    (value) => {
      if (value) {
        resetEmpty(setOrderRouteEmpty);
      }
      if (info && value) {
        setInfo({ ...info, orderRoute: value });
      } else {
        const newInfo = { orderRoute: value } as OrderInfo;
        setInfo(newInfo);
      }
    },
    [info, resetEmpty],
  );

  const handleFormChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      if (name === 'username') {
        resetEmpty(setUserNameEmpty);
      }
      if (name === 'phone') {
        const confirmValue = value.match(/(^02.{0}|^01.{1})([0-9]{3})([0-9]+)([0-9]{4})/g);
        if (!confirmValue) {
          setPhoneEmpty({ ...phoneEmpty, isRequired: true, extra: '-없는 올바른 번호로 입력해 주세요!' });
        } else {
          resetEmpty(setPhoneEmpty);
        }
      }

      if (info) {
        setInfo({ ...info, [name]: value });
      } else {
        const newInfo = { [name]: value } as OrderInfo;
        setInfo(newInfo);
      }
    },
    [info, phoneEmpty, resetEmpty],
  );

  const handleSendToConfirm = useCallback(() => {
    if (!selectedFrameList) return;
    if (!info) {
      setUserNameEmpty({ ...userNameEmpty, isRequired: true, extra: '이름을 입력해 주세요!' });
      setPhoneEmpty({ ...phoneEmpty, isRequired: true, extra: '핸드폰 번호를 입력해 주세요!' });
      setOrderRouteEmpty({ ...orderRouteEmpty, isRequired: true, extra: '주문 경로를 선택해 주세요!' });
      return;
    }
    if (!info.username) return setUserNameEmpty({ ...userNameEmpty, isRequired: true, extra: '이름을 입력해 주세요!' });
    if (!info.phone) return setPhoneEmpty({ ...phoneEmpty, isRequired: true, extra: '핸드폰 번호를 입력해 주세요!' });
    // if (!info.orderRoute)
    //   return setOrderRouteEmpty({ ...orderRouteEmpty, isRequired: true, extra: '주문 경로를 선택해 주세요!' });

    canvasToImage(selectedFrameList, { ...info, orderRoute: '1' });
  }, [selectedFrameList, info, userNameEmpty, phoneEmpty, canvasToImage, orderRouteEmpty]);

  useEffect(() => {
    if (isDone) {
      router.push('/success?divided=true');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDone]);

  return (
    <>
      <Modal
        visible={isSaveCanvas || false}
        onOk={handleSendToConfirm}
        onCancel={handleVisible}
        confirmLoading={loading}
        title="저장하시나요?"
        okText="확인"
        cancelText="취소"
      >
        <form onChange={handleFormChange}>
          <Form.Item labelCol={{ span: 4 }} label="이름" extra={userNameEmpty.extra}>
            <AntdInput
              name="username"
              placeholder="이름을 입력해 주세요."
              isRequired={userNameEmpty.isRequired}
            ></AntdInput>
          </Form.Item>

          <Form.Item labelCol={{ span: 4 }} label="핸드폰" extra={phoneEmpty.extra}>
            <AntdInput name="phone" placeholder="- 없이 입력해 주세요." isRequired={phoneEmpty.isRequired}></AntdInput>
          </Form.Item>

          {/* 자사 유저면 없게끔.  TODO: 근데 넣을지 안넣을진 모르겠다? */}
          <Form.Item labelCol={{ span: 4 }} label="주문 경로" extra={orderRouteEmpty.extra}>
            <AntdSelect
              onChange={handleSelectOrderRoute}
              placeholder="주문 경로를 선택해 주세요."
              defaultValue={'1'}
              isRequired={orderRouteEmpty.isRequired}
            >
              <Select.Option value="1" label="네이버">
                네이버
              </Select.Option>
            </AntdSelect>
          </Form.Item>
        </form>
        {selectedFrameList?.length ? (
          <>
            <AppTable
              dataSource={yourPriceList?.map(([key, value], index) => {
                return { name: key, ...value, key: index };
              })}
              columns={SaveModalOrderColumns}
              pagination={false}
            />
            <BillTotal>총 {totalPrice?.toLocaleString()}원</BillTotal>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>생성하신 액자가 없으시네요! 액자를 만들어 주셔야 진행됩니다.</div>
        )}
      </Modal>
    </>
  );
};

export default ToolSave;
