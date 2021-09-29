import styled from '@emotion/styled';
import { Divider } from 'antd';
import router from 'next/router';
import React, { useEffect, useMemo } from 'react';
import { APP_HEADER_HEIGHT } from 'src/constants';
import { useAppSelector } from 'src/hooks/useRedux';
import { TotalPrice } from '../product/ProductOrderMutiOptions';

const Container = styled.div`
  background-color: ${({ theme }) => theme.color.gray000};
  padding-top: ${APP_HEADER_HEIGHT}px;
  min-height: 100vh;
  padding-bottom: 2em;
`;

const OrderTable = styled.div`
  box-shadow: 0 0px 2px ${({ theme }) => theme.color.gray300};
  width: 100%;
  max-width: 800px;
  padding: 2em;
  margin: 2em auto;
  background-color: ${({ theme }) => theme.color.white};
  min-height: 100vh;
`;

const ProductOrder = styled.div`
  padding: 0.5em 0;

  h3 {
    color: ${({ theme }) => theme.color.gray700};
  }
`;

const ProductInfo = styled.div`
  display: flex;
  justify-content: flex-end;

  div {
    margin: 0 0.5em;
    font-size: 1.25rem;
  }
`;

const OrderSheets = () => {
  const { productOrder, deliveryOption } = useAppSelector((state) => state.order);
  const { userData } = useAppSelector((state) => state.user);

  const deliveryPrice = useMemo(() => {
    return deliveryOption.deliveryPrice;
  });

  const totalQty = useMemo(() => {
    return productOrder.reduce((acc, cur) => {
      if (acc) {
        acc += cur.qty;
        return acc;
      }
      return cur.qty;
    }, 0);
  }, [productOrder]);

  const totalPrice = useMemo(() => {
    return productOrder.reduce((acc, cur) => {
      if (acc) {
        acc += cur.price;
        return acc;
      }
      return +cur.price;
    }, 0);
  }, [productOrder]);

  useEffect(() => {
    if (!productOrder.length) {
      router.back();
    }
  }, []);

  return (
    <Container>
      <OrderTable>
        <h2>주문 내역</h2>
        <Divider />
        <ProductOrder>
          {productOrder.map((lst) => (
            <div key={lst.value}>
              <h3>{lst.value}</h3>
              <ProductInfo>
                <div>{lst.qty}개</div>
                <div>{lst.price.toLocaleString()}원</div>
              </ProductInfo>
            </div>
          ))}
        </ProductOrder>

        <Divider />

        <TotalPrice>
          <span>
            총 상품 개수 <span>{totalQty}</span>개
          </span>
          <span>|</span>
          <span>{totalPrice.toLocaleString()}원</span>
        </TotalPrice>

        <div>
          <h3>배송 정보 입력</h3>
          <div>
            <div>수령인</div>
            <div>주소 찾기</div>
            <div>연락처 1</div>
            <div>연락처 2</div>
            <div>배송 메모</div>
            <div></div>
          </div>
        </div>

        <div>
          <h3>결제 진행</h3>
          <div>총 {(totalPrice + deliveryPrice).toLocaleString()}원 결제를 진행합니다.</div>
          <small>배송비 {deliveryPrice.toLocaleString()}원</small>
          <button type="button">결제</button>
        </div>
      </OrderTable>
    </Container>
  );
};

export default OrderSheets;
