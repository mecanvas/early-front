import styled from '@emotion/styled';
import { Collapse, Divider } from 'antd';
import router from 'next/router';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { useAppSelector } from 'src/hooks/useRedux';
import OrderProductList from '../order/OrderProductList';
import { OptionType } from 'src/interfaces/ProductInterface';

const Container = styled.div`
  padding: 2.5em 0;
  background: ${({ theme }) => theme.color.gray000};
`;

const ProductOrderListContainer = styled.div`
  background: ${({ theme }) => theme.color.white};
  margin: 2em 0;
  max-width: 800px;
  width: 100%;
  padding: 1em;
  margin: 0 auto;
`;

const ProductOrderListInfo = styled(Collapse.Panel)`
  img {
    max-width: 130px;
    width: 100%;
    object-fit: contain;
  }
`;

const OrderInfo = styled.div`
  margin-bottom: 2em;
`;

const LabelAndText = styled.div`
  padding: 0.3em;
  padding-left: 0;
  margin-bottom: 5px;
`;

const Label = styled.span`
  font-size: 1.2rem;
  margin-bottom: 5px;
`;

const Text = styled.div`
  font-size: 14px;

  div {
    font-size: 1.15rem;
    font-weight: bold;
  }
`;

const MoreBtn = styled.div`
  display: flex;
  justify-content: center;
  button {
    margin: 2em auto;
    font-weight: bold;
    font-size: 1.15rem;
    padding: 0.5em 1.5em;
    background-color: ${({ theme }) => theme.color.black};
    color: ${({ theme }) => theme.color.white};
  }
`;

const Pay = () => {
  const { productOrderInfo, deliveryOption } = useAppSelector((state) => state.order);

  const totalPrice = useMemo(() => {
    return productOrderInfo.productOrder.map((lst) =>
      lst.type === OptionType.MULTI
        ? lst.optionSelect?.reduce((acc, cur) => {
            if (acc) {
              acc += cur.price;
              return acc;
            }
            return cur.price;
          }, 0)
        : productOrderInfo.productOrder.reduce((acc, cur) => {
            if (acc && cur.price) {
              acc += cur.price;
              return acc;
            }
            return cur.price || 0;
          }, 0),
    )[0];
  }, [productOrderInfo.productOrder]);

  const status = useMemo(() => {
    if (process.browser) {
      const s = router.query.status as string;
      return +s;
    }
    return 0;
  }, []);

  const OrderList = ({ data }: { data: any[] }) => {
    return <OrderProductList productOrder={data} />;
  };

  return (
    <Container>
      {status === 1 ? (
        <ProductOrderListContainer>
          <h2>주문 완료</h2>
          <p>주문해 주셔서 감사합니다. 곧 찾아 뵐게요 :)</p>

          <Divider />

          <OrderInfo>
            <h3>주문 정보</h3>
            <LabelAndText>
              <Label>수령인</Label>
              <Text>{productOrderInfo.receiver}</Text>
            </LabelAndText>
            <LabelAndText>
              <Label>주소</Label>
              <Text>
                {productOrderInfo.address.address} {productOrderInfo.address.addressDetail}
              </Text>
            </LabelAndText>
            <div>
              <LabelAndText>
                <Label>연락처</Label>
                <Text>{productOrderInfo.phone}</Text>
              </LabelAndText>
            </div>
            <LabelAndText style={{ marginBottom: '2.5em' }}>
              <Label>배송메모</Label>
              <Text>{productOrderInfo.memo}</Text>
            </LabelAndText>

            <LabelAndText>
              <Label>결제금액</Label>
              <Text>
                <div>{((totalPrice || 0) + deliveryOption.deliveryPrice).toLocaleString()}원</div>
                {deliveryOption.deliveryPrice ? (
                  <small>(배송비{deliveryOption.deliveryPrice.toLocaleString()}원 포함)</small>
                ) : null}
              </Text>
            </LabelAndText>
          </OrderInfo>

          {productOrderInfo.productOrder.length ? (
            <Collapse defaultActiveKey={['1']}>
              <ProductOrderListInfo header="주문 상세 내역" key="1">
                <OrderList data={productOrderInfo.productOrder} />
              </ProductOrderListInfo>
            </Collapse>
          ) : null}

          <br />

          <Divider />

          <MoreBtn>
            <Link href="/">
              <button type="button">상품 더 보기</button>
            </Link>
          </MoreBtn>
        </ProductOrderListContainer>
      ) : null}
    </Container>
  );
};

export default Pay;
