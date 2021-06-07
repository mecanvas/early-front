import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Input, Form } from 'antd';
import { useCanvasToServer, useGlobalState } from 'src/hooks';
import { useRouter } from 'next/router';

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
  const [isSaveCanvas, setIsSaveCanvas] = useGlobalState('saveModal');
  const { canvasToImage, loading, isDone } = useCanvasToServer();
  const router = useRouter();

  const handleVisible = useCallback(() => {
    setIsSaveCanvas(false);
  }, [setIsSaveCanvas]);
  console.log(loading);

  const handleFormChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      if (info) {
        setInfo({ ...info, [name]: value });
      } else {
        const newInfo = { [name]: value } as Info;
        setInfo(newInfo);
      }
    },
    [info],
  );

  const handleSendToConfrim = useCallback(() => {
    if (info) {
      canvasToImage(selectedFrameList, info.username);
    }
  }, [canvasToImage, info, selectedFrameList]);

  useEffect(() => {
    if (isDone) {
      router.push('/');
    }
  }, [isDone, router]);

  return (
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
        <Form.Item labelCol={{ span: 3 }} label="이름">
          <Input name="username" placeholder="이름을 입력해 주세요."></Input>
        </Form.Item>

        <Form.Item labelCol={{ span: 3 }} label="연락처">
          <Input name="phoneNumber" placeholder="전화번호를 입력해 주세요."></Input>
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
  );
};

export default ToolSave;
