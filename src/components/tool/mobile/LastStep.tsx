import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Input, Form, Select, Divider } from 'antd';
import { useAppSelector } from 'src/hooks/useRedux';

const Container = styled.div`
  margin: 1em 0;
  padding: 1em;
`;

const SaveForm = styled(Form)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 0 2em;
`;

const PreivewCanvas = styled.div`
  display: flex;
  margin-bottom: 3em;
  width: 100%;
  /* border-radius: 8px; */
  /* border: 1px solid ${({ theme }) => theme.color.gray100}; */
  /* background-color: ${({ theme }) => theme.color.gray100}; */

  canvas {
    filter: ${({ theme }) => theme.canvasShadowFilter};
  }
`;

const CanvasSaleInfo = styled.div`
  padding: 0 1em;
  margin-left: 1em;
  width: 300px;

  h3 {
    color: ${({ theme }) => theme.color.primary};
  }

  span {
    line-height: 20px;
    font-size: 15px;
    margin-right: 0.3em;
  }
`;

const LastStep = () => {
  const { canvasSaveList } = useAppSelector((state) => state.canvas);
  const { selectedFrame } = useAppSelector((state) => state.frame);
  const previewRef = useRef<HTMLDivElement>(null);
  const [canvasUrl, setCanvasUrl] = useState('');

  useEffect(() => {
    const wrapper = previewRef.current;
    if (wrapper) {
      const canvas = canvasSaveList[0].canvas;
      const url = canvas.toDataURL('image/png', 1.0);
      setCanvasUrl(url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <SaveForm>
        <PreivewCanvas>
          <div ref={previewRef}>
            <img src={canvasUrl} alt="액자사진" />
          </div>
          <CanvasSaleInfo>
            <h3>Infomation</h3>
            <div>
              <span>
                {selectedFrame[0].widthCm}cm x {selectedFrame[0].heightCm}cm
              </span>
            </div>
            <div>{selectedFrame[0].price.toLocaleString()}원</div>
          </CanvasSaleInfo>
        </PreivewCanvas>

        <Divider />

        <Form.Item labelAlign="left" labelCol={{ span: 2 }} wrapperCol={{ span: 18 }} label="이름">
          <Input />
        </Form.Item>
        <Form.Item labelAlign="left" labelCol={{ span: 2 }} wrapperCol={{ span: 18 }} label="연락처">
          <Input />
        </Form.Item>
        <Form.Item labelAlign="left" labelCol={{ span: 2 }} wrapperCol={{ span: 18 }} label="주문 경로">
          <Select placeholder="주문 경로를 선택해 주세요." defaultValue={'1'}>
            <Select.Option value="1" label="네이버">
              네이버
            </Select.Option>
          </Select>
        </Form.Item>
      </SaveForm>
    </Container>
  );
};

export default LastStep;
