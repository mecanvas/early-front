import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Input, Form, Select, Divider } from 'antd';
import { useAppSelector } from 'src/hooks/useRedux';
import { useCarousel } from 'src/hooks/useCarousel';
import { Images } from 'public';
import Img from 'src/components/common/Img';
import { cmToPx } from 'src/utils/cmToPx';

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
  position: relative;
  width: 100%;

  canvas {
    filter: ${({ theme }) => theme.canvasShadowFilter};
  }
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
  }
`;

const CanvasSaleInfo = styled.div`
  span {
    line-height: 20px;
    font-size: 15px;
    margin-right: 0.3em;
  }
`;

const LastStep = () => {
  const { canvasSaveList } = useAppSelector((state) => state.canvas);
  const { selectedFrame } = useAppSelector((state) => state.frame);

  const [canvasUrl, setCanvasUrl] = useState('');
  const { AntdCarousel } = useCarousel();

  useEffect(() => {
    const canvas = canvasSaveList[0].saveCanvas;

    const url = canvas.toDataURL('image/png', 1.0);
    setCanvasUrl(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <a download="ekdns.png" href={canvasUrl}>
        샘플다운
      </a>
      <SaveForm>
        <PreivewCanvas>
          <AntdCarousel startIndex={0} lastIndex={1}>
            <div>
              <SliderItem>
                <Img src={canvasUrl} alt="액자사진" />
              </SliderItem>
            </div>
            <div>
              <SliderItem>
                <Img src={Images.div} alt="액자사진" />
              </SliderItem>
            </div>
          </AntdCarousel>
        </PreivewCanvas>
        <CanvasSaleInfo>
          <div>
            <span>
              {selectedFrame[0].widthCm}cm x {selectedFrame[0].heightCm}cm
            </span>
          </div>
          <div>{selectedFrame[0].price.toLocaleString()}원</div>
        </CanvasSaleInfo>

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
