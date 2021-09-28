import styled from '@emotion/styled';
import React from 'react';
import { DeliveryOption, ProductOption } from 'src/interfaces/ProductInterface';
import { User } from 'src/interfaces/User';
import ProductOrderMutiOptions from './ProductOrderMutiOptions';
import ProductOrderSingleOptions from './ProductOrderSingleOptions';

const Container = styled.div``;

interface Props {
  title: string;
  meta: string;
  uploader: User;
  price: number;
  status: 1 | 2;
  productOption: ProductOption;
  deliveryOption: DeliveryOption;
}

const ProductOrderItem = ({ title, meta, uploader, price, status, productOption, deliveryOption }: Props) => {
  return (
    <Container>
      <div>{uploader.username}</div>
      <div>문의하기</div>
      <div>{status === 1 ? '판매 중' : '품절'}</div>
      <div>{title}</div>
      <div>{meta}</div>
      <div>{price}원</div>

      {productOption.type === 1 && <ProductOrderSingleOptions price={price} deliveryOption={deliveryOption} />}
      {productOption.type === 2 && (
        <ProductOrderMutiOptions productOption={productOption} price={price} deliveryOption={deliveryOption} />
      )}
      <div>
        <button>장바구니</button>
        <button>바로구매</button>
      </div>
    </Container>
  );
};

export default ProductOrderItem;
