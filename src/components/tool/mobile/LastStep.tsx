import React, { useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Input, Form, Select, Divider } from 'antd';
import { useAppDispatch, useAppSelector } from 'src/hooks/useRedux';
import Img from 'src/components/common/Img';
import { useForm } from 'antd/lib/form/Form';
import { CanvasOrder, setCanvasOrder, setCanvasSaveList } from 'src/store/reducers/canvas';
import { createExpandCanvas } from 'src/utils/createExpandSave';

const Container = styled.div`
  margin: 1em 0;
  padding: 1em;

  h5 {
    margin-bottom: 2em;
  }
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    padding: 1em 0;
  }
`;

const SaveForm = styled(Form)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 0 2em;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    padding: 0 1em;
  }
`;

const PreivewCanvas = styled.div`
  position: relative;
  width: 100%;
`;

const SliderItem = styled.div`
  width: 70%;
  margin: 0 auto;
  padding: 0.6em;
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.color.white};
  img {
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
    filter: ${({ theme }) => theme.canvasShadowFilter};
    filter: none; /* IE 6-9 */
    -webkit-filter: ${({ theme }) => theme.canvasShadowFilter};
  }
`;

const CanvasSaleInfo = styled.div`
  text-align: center;
  span {
    line-height: 20px;
    font-size: 15px;

    &:nth-of-type(1) {
      margin-right: 0.5em;
    }
  }
`;

const CanvasPrice = styled.div`
  font-size: 20px;
`;

const LastStep = () => {
  const [form] = useForm();

  const dispatch = useAppDispatch();
  const { canvasSaveList, canvasOrder } = useAppSelector((state) => state.canvas);
  const { selectedFrame } = useAppSelector((state) => state.frame);
  const [orderForm, setOrderForm] = useState<CanvasOrder>({ username: '', phone: '', orderRoute: 1 });
  const [canvasUrl, setCanvasUrl] = useState('');
  const handleFormChange = useCallback((e) => {
    const { name, value } = e[0];
    setOrderForm((prev) => ({ ...prev, [name[0]]: value }));
  }, []);

  useEffect(() => {
    dispatch(setCanvasOrder(orderForm));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderForm]);

  useEffect(() => {
    const canvas = canvasSaveList[0].previewCanvas;
    const url = canvas?.toDataURL('image/png', 1.0);
    setCanvasUrl(url);
    const saveCanvas = createExpandCanvas(selectedFrame, canvasOrder.scaleType as 1 | 2 | 3);
    dispatch(setCanvasSaveList({ name: selectedFrame[0].name, saveCanvas }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <SaveForm form={form} name="form" onFieldsChange={handleFormChange}>
        <PreivewCanvas>
          {/* <AntdCarousel startIndex={0} lastIndex={1}> */}
          <div>
            <SliderItem>
              <Img src={canvasUrl} alt="액자사진" width={300} height={300} />
            </SliderItem>
          </div>

          {/* </AntdCarousel> */}
        </PreivewCanvas>
        <Divider />
        <CanvasSaleInfo>
          <div>
            <span>{selectedFrame[0].name}</span>
            <span>
              {selectedFrame[0].widthCm}cm x {selectedFrame[0].heightCm}cm
            </span>
          </div>
          <div>
            {(canvasOrder.scaleType === 1 && '옆면-흰색') ||
              (canvasOrder.scaleType === 2 && `옆면-배경색`) ||
              '옆면-좌우반전'}
          </div>
          <CanvasPrice>{selectedFrame[0].price.toLocaleString()}원</CanvasPrice>
        </CanvasSaleInfo>

        <Divider />

        <h5>주문을 위해 정보를 입력해 주세요.</h5>
        <Form.Item
          style={{ paddingBottom: '1em' }}
          initialValue={orderForm.username}
          name="username"
          labelAlign="left"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 18 }}
          label="이름"
          rules={[
            {
              required: true,
              message: '성함을 입력해 주세요!',
            },
          ]}
        >
          <Input placeholder="성함을 입력해 주세요." />
        </Form.Item>
        <Form.Item
          style={{ paddingBottom: '1em' }}
          initialValue={orderForm.phone}
          name="phone"
          labelAlign="left"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 18 }}
          label="연락처"
          rules={[
            {
              required: true,
              pattern: /(^02.{0}|^01.{1})([0-9]{3})([0-9]+)([0-9]{4})/g,
              message: '-가 없는 올바른 번호를 입력하세요.',
            },
          ]}
        >
          <Input placeholder="-없이 입력해 주세요." />
        </Form.Item>
        <Form.Item
          style={{ paddingBottom: '1em' }}
          initialValue={orderForm.orderRoute}
          name="orderRoute"
          labelAlign="left"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 18 }}
          label="주문 경로"
          rules={[{ required: true, message: '주문 경로를 선택해 주세요.' }]}
        >
          <Select defaultValue={canvasOrder.orderRoute} placeholder="주문하시는 경로를 선택해 주세요.">
            <Select.Option value={1} label="네이버">
              네이버
            </Select.Option>
          </Select>
        </Form.Item>
      </SaveForm>
    </Container>
  );
};

export default LastStep;
