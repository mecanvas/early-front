import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1em;
  width: 95%;
  display: flex;
  justify-content: center;
`;

const Cart = () => {
  const productOrder = {
    optionId: 1,
    productId: 1,
    thumb: 'https://shop-phinf.pstatic.net/20210729_267/1627557958996mnAfE_PNG/003.png?type=w860',
    value: '모네',
    qty: 1,
    price: 3000,
  };
  return (
    <Container>
      <div>
        <div>
          <img src={productOrder.thumb} />
        </div>
        <div>{productOrder.value}</div>
        <button>
          <div>{productOrder.qty}개</div>
        </button>
      </div>
    </Container>
  );
};

export default Cart;
