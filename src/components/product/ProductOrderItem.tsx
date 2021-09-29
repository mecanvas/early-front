import styled from '@emotion/styled';
import { Divider } from 'antd';
import React, { useCallback } from 'react';
import { DeliveryOption, ProductOption } from 'src/interfaces/ProductInterface';
import { Uploader } from 'src/interfaces/User';
import ProductOrderMutiOptions from './ProductOrderMutiOptions';
import ProductOrderSingleOptions from './ProductOrderSingleOptions';

const Container = styled.div`
  max-width: 500px;
  width: 40%;
  @media all and (max-width: ${({ theme }) => theme.size.md}) {
    width: 100%;
    max-width: 90%;
    margin: 0 auto;
  }
`;

const HostInfomation = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ProductBasicInfo = styled.div`
  h1 {
    margin-top: 0.5em;
    margin-bottom: 0.3em;
    font-size: 1.8rem;
  }
  small {
    padding-left: 2px;
    color: ${({ theme }) => theme.color.gray700};
  }
  margin-bottom: 1em;
`;

const ProductPrice = styled.div`
  text-align: right;
  font-size: 1.55rem;
`;

const ProductOrderBtn = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;

  button {
    flex: 1;
    width: 100%;
    padding: 0.8em 0;
    margin: 0 0.4em;
    font-weight: bold;

    &:nth-of-type(1) {
      border: 1px solid ${({ theme }) => theme.color.gray700};
      color: ${({ theme }) => theme.color.black};
      background: ${({ theme }) => theme.color.white};
    }

    &:nth-of-type(2) {
      &:disabled {
        background: ${({ theme }) => theme.color.gray600};
      }
      border: 1px solid ${({ theme }) => theme.color.gray100};
      color: ${({ theme }) => theme.color.white};
      background: ${({ theme }) => theme.color.black};
    }
  }
`;

interface Props {
  title: string;
  meta: string;
  uploader: Uploader;
  price: number;
  status: 1 | 2;
  productOption: ProductOption;
  deliveryOption: DeliveryOption;
}

const ProductOrderItem = ({ title, meta, uploader, price, status, productOption, deliveryOption }: Props) => {
  const handleOrder = useCallback(() => {}, []);
  return (
    <Container>
      <HostInfomation>
        <div>
          <div>{uploader.username}</div>
        </div>
        <div>1:1문의</div>
      </HostInfomation>

      <ProductBasicInfo>
        <h1>{title}</h1>
        <small>{meta}</small>
      </ProductBasicInfo>

      <ProductPrice>{price.toLocaleString()}원</ProductPrice>

      <Divider />

      {productOption.type === 1 && (
        <ProductOrderSingleOptions title={title} price={price} deliveryOption={deliveryOption} />
      )}
      {productOption.type === 2 && (
        <ProductOrderMutiOptions productOption={productOption} price={price} deliveryOption={deliveryOption} />
      )}

      <ProductOrderBtn>
        <button>장바구니</button>
        {status === 1 ? <button onClick={handleOrder}>바로구매</button> : <button disabled>임시품절</button>}
      </ProductOrderBtn>
    </Container>
  );
};

export default ProductOrderItem;
