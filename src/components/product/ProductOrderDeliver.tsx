import styled from '@emotion/styled';
import React from 'react';
import { DeliveryOption } from 'src/interfaces/ProductInterface';

const OrderDeliveryInfo = styled.div`
  padding: 0.5em;
  background-color: ${({ theme }) => theme.color.gray100};
  border-radius: 4px;
  margin: 2em 0;
  text-align: center;

  div {
    color: ${({ theme }) => theme.color.gray700};
    font-weight: 700;
  }
`;

const ProductOrderDeliver = ({ deliveryOption }: { deliveryOption: DeliveryOption }) => {
  return (
    <OrderDeliveryInfo>
      <div>
        <div>
          <small>배송비</small>
        </div>
        {deliveryOption.deliveryPrice.toLocaleString()}원{' '}
        {deliveryOption.limit && `(${deliveryOption.limit.toLocaleString()}원 이상 구매시 무료 배송)`}
      </div>
      <div>도서산간 지역의 경우 {deliveryOption.additionalPrice.toLocaleString()}원 추가</div>
    </OrderDeliveryInfo>
  );
};

export default ProductOrderDeliver;
