import styled from '@emotion/styled';
import React from 'react';
import { ProductOrder } from 'src/interfaces/OrderInterface';
import { OptionType } from 'src/interfaces/ProductInterface';

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1em;
  padding: 0.5em;
  width: 100%;

  h3 {
    margin-bottom: 2em;
  }

  div {
    display: flex;
    flex-direction: column;
    width: 100%;
    font-size: 1.25rem;
  }
`;

const ProductOrderList = styled.div`
  padding: 0.5em 0;
  width: 100%;

  div {
    display: flex;
  }
  img {
    width: 200px;
  }
`;

interface Props {
  productOrder: ProductOrder[];
}

const OrderProductList = ({ productOrder }: Props) => {
  return (
    <ProductOrderList>
      {productOrder.map((order, i) =>
        order.type === OptionType.MULTI && order.optionSelect ? (
          order.optionSelect.map((lst) => (
            <ProductOrderList key={lst.listId}>
              <img src={order.thumb} alt="상품 썸네일" />
              <ProductInfo>
                <h3>{lst.optionAbbr.name}</h3>
                <div>
                  <div>{lst.qty}개</div>
                  <div>{lst.price.toLocaleString()}원</div>
                </div>
              </ProductInfo>
            </ProductOrderList>
          ))
        ) : (
          <ProductOrderList key={i}>
            <img src={order.thumb} alt="상품 썸네일" />
            <ProductInfo>
              <h3>{order.productTitle}</h3>
              <div>
                <div>{order.qty}개</div>
                <div>{order.price?.toLocaleString()}원</div>
              </div>
            </ProductInfo>
          </ProductOrderList>
        ),
      )}
    </ProductOrderList>
  );
};

export default OrderProductList;
