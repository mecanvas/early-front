import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Input, Form } from 'antd';
import { useCanvasToServer, useGlobalState } from 'src/hooks';
import { useRouter } from 'next/router';
import Loading from '../common/Loading';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

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

interface Info {
  [key: string]: any;
  username: string;
  phoneNumber: string;
}

interface Props {
  yourPriceList: [string, any][];
  selectedFrameList: HTMLCanvasElement[];
}

const ToolSave = ({ yourPriceList, selectedFrameList }: Props) => {
  const [info, setInfo] = useState<Info | null>(null);
  const [userNameEmpty, setUserNameEmpty] = useState({ isRequired: false, extra: '' });
  const [phoneNumberEmpty, setPhoneNumberEmpty] = useState({ isRequired: false, extra: '' });
  const [isSaveCanvas, setIsSaveCanvas] = useGlobalState('saveModal');
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
      if (name === 'phoneNumber') {
        resetEmpty(setPhoneNumberEmpty);
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

  const handleSendToConfrim = useCallback(() => {
    if (!info) {
      setUserNameEmpty({ ...userNameEmpty, isRequired: true, extra: '이름을 입력해 주세요!' });
      setPhoneNumberEmpty({ ...phoneNumberEmpty, isRequired: true, extra: '연락처를 입력해 주세요!' });
      return;
    }
    if (!info.username) return setUserNameEmpty({ ...userNameEmpty, isRequired: true, extra: '이름을 입력해 주세요!' });
    if (!info.phoneNumber)
      return setPhoneNumberEmpty({ ...phoneNumberEmpty, isRequired: true, extra: '연락처를 입력해 주세요!' });

    canvasToImage(selectedFrameList, info.username);
  }, [canvasToImage, info, phoneNumberEmpty, selectedFrameList, userNameEmpty]);

  useEffect(() => {
    if (isDone) {
      router.push('/success');
    }
  }, [isDone, router]);

  return (
    <>
      <Loading loading={loading} />
      <Modal
        visible={isSaveCanvas}
        onOk={handleSendToConfrim}
        onCancel={handleVisible}
        confirmLoading={loading}
        title="저장하시나요?"
        okText="확인"
        cancelText="취소"
      >
        <form onChange={handleFormChange}>
          <Form.Item labelCol={{ span: 3 }} label="이름" extra={userNameEmpty.extra}>
            <AntdInput
              name="username"
              placeholder="이름을 입력해 주세요."
              isRequired={userNameEmpty.isRequired}
            ></AntdInput>
          </Form.Item>

          <Form.Item labelCol={{ span: 3 }} label="연락처" extra={phoneNumberEmpty.extra}>
            <AntdInput
              name="phoneNumber"
              placeholder="전화번호를 입력해 주세요."
              isRequired={phoneNumberEmpty.isRequired}
            ></AntdInput>
          </Form.Item>
        </form>
        <div>주문 하신 액자 맞으신가요?</div>
        {yourPriceList?.map(([key, value], index) => (
          <div key={index}>
            <div>{key}</div>
            <div>
              {value.price.toLocaleString()} x {value.quantity}개
            </div>
          </div>
        ))}
      </Modal>
    </>
  );
};

export default ToolSave;
