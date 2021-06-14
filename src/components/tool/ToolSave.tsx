import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Input, Form, Select } from 'antd';
import { useCanvasToServer, useGlobalState } from 'src/hooks';
import { useRouter } from 'next/router';
import Loading from '../common/Loading';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import AppTable from '../antd/AppTable';

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

interface Info {
  [key: string]: any;
  username: string;
  email: string;
}

interface Props {
  yourPriceList: [string, any][];
  selectedFrameList: HTMLCanvasElement[];
}

const ToolSave = ({ yourPriceList, selectedFrameList }: Props) => {
  const [info, setInfo] = useState<Info | null>(null);
  const [userNameEmpty, setUserNameEmpty] = useState({ isRequired: false, extra: '' });
  const [emailEmpty, setEmailEmpty] = useState({ isRequired: false, extra: '' });
  const [orderRouteEmpty, setOrderRouteEmpty] = useState({ isRequired: false, extra: '' });
  const [isSaveCanvas, setIsSaveCanvas] = useGlobalState<boolean>('saveModal');
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

  const handleFormChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      if (name === 'username') {
        resetEmpty(setUserNameEmpty);
      }
      if (name === 'email') {
        resetEmpty(setEmailEmpty);
      }

      if (info) {
        setInfo({ ...info, [name]: value });
      } else {
        const newInfo = { [name]: value } as Info;
        setInfo(newInfo);
      }
    },
    [info, resetEmpty],
  );

  const handleSendToConfirm = useCallback(() => {
    if (!info) {
      setUserNameEmpty({ ...userNameEmpty, isRequired: true, extra: '이름을 입력해 주세요!' });
      setEmailEmpty({ ...emailEmpty, isRequired: true, extra: '이메일을 입력해 주세요!' });
      setOrderRouteEmpty({ ...orderRouteEmpty, isRequired: true, extra: '주문 경로를 선택해 주세요!' });
      return;
    }
    if (!info.username) return setUserNameEmpty({ ...userNameEmpty, isRequired: true, extra: '이름을 입력해 주세요!' });
    if (!info.email) return setEmailEmpty({ ...emailEmpty, isRequired: true, extra: '이메일을 입력해 주세요!' });
    if (!info.email)
      return setOrderRouteEmpty({ ...orderRouteEmpty, isRequired: true, extra: '주문 경로를 선택해 주세요!' });
    if (!info.email.includes('@') || !info.email.includes('.'))
      return setEmailEmpty({ ...emailEmpty, isRequired: true, extra: '올바른 이메일을 적어주세요.' });
    canvasToImage(selectedFrameList, info.username, info.email);
  }, [info, userNameEmpty, emailEmpty, orderRouteEmpty, canvasToImage, selectedFrameList]);

  useEffect(() => {
    if (isDone) {
      router.push('/success');
    }
  }, [isDone, router]);

  console.log(yourPriceList);

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
        <Loading loading={loading} />
        <form onChange={handleFormChange}>
          <Form.Item labelCol={{ span: 4 }} label="이름" extra={userNameEmpty.extra}>
            <AntdInput
              allowClear
              name="username"
              placeholder="이름을 입력해 주세요."
              isRequired={userNameEmpty.isRequired}
            ></AntdInput>
          </Form.Item>

          <Form.Item labelCol={{ span: 4 }} label="이메일" extra={emailEmpty.extra}>
            <AntdInput
              allowClear
              name="email"
              placeholder="연락 가능한 이메일을 입력해 주세요."
              isRequired={emailEmpty.isRequired}
            ></AntdInput>
          </Form.Item>

          {/* 자사 유저면 없게끔.  TODO: 근데 넣을지 안넣을진 모르겠다? */}
          <Form.Item labelCol={{ span: 4 }} label="주문 경로" extra={orderRouteEmpty.extra}>
            <AntdSelect placeholder="주문 경로를 선택해 주세요." isRequired={orderRouteEmpty.isRequired} allowClear>
              <Select.Option value="coupang" label="쿠팡">
                쿠팡
              </Select.Option>
              <Select.Option value="naver" label="네이버">
                네이버
              </Select.Option>
              <Select.Option value="ideaus" label="아이디어스">
                아이디어스
              </Select.Option>
            </AntdSelect>
          </Form.Item>
        </form>
        {selectedFrameList.length ? (
          <AppTable
            dataSource={yourPriceList.map(([key, value]) => {
              return { name: key, ...value };
            })}
            columns={SaveModalOrderColumns}
            pagination={false}
          />
        ) : (
          <div style={{ textAlign: 'center' }}>생성하신 액자가 없으시네요! 액자를 만들어 주셔야 진행됩니다.</div>
        )}
      </Modal>
    </>
  );
};

export default ToolSave;
