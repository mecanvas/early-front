import styled from '@emotion/styled';
import React from 'react';
import { ProductOrder } from 'src/interfaces/OrderInterface';
import { OptionType } from 'src/interfaces/ProductInterface';

const ProductOrderContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductOrderList = styled.div`
  margin-bottom: 1em;
  padding: 0.5em;
  width: 100%;
  border-bottom: 1px solid #dbdbdb;
  display: flex;
`;

const ProductThumb = styled.div`
  display: flex;
  align-items: flex-start;

  img {
    max-width: 125px;
    width: 100%;
    object-fit: contain;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1em;
  padding: 0.5em;
  width: 100%;
`;

const ProductInfoQty = styled.div`
  margin: 0.2em 0;
  display: flex;
  div {
    font-size: 0.95rem;
    color: ${({ theme }) => theme.color.gray700};
    margin-right: 0.3em;
  }
`;

interface Props {
  productOrder: ProductOrder[];
}

const OrderProductList = ({ productOrder }: Props) => {
  return (
    <ProductOrderContainer>
      {productOrder.map((order, i) => (
        <ProductOrderList key={i}>
          <ProductThumb>
            <img src={order.thumb} alt="상품 썸네일" />
          </ProductThumb>
          <ProductInfo>
            <div>
              <h5>{order.productTitle}</h5>
            </div>
            {order.type === OptionType.MULTI && order.optionSelect ? (
              order.optionSelect.map((lst) => (
                <ProductInfoQty>
                  <div>{lst.optionAbbr.fullName} -</div>
                  <div>{lst.qty}개</div>
                  <div>{(lst.qty * lst.price).toLocaleString()}원</div>
                </ProductInfoQty>
              ))
            ) : (
              <ProductInfoQty>
                <div>{order.qty}개</div>
                <div>{((order.qty || 0) * (order.price || 0))?.toLocaleString()}원</div>
              </ProductInfoQty>
            )}
          </ProductInfo>
        </ProductOrderList>
      ))}
    </ProductOrderContainer>
  );
};

export default OrderProductList;
