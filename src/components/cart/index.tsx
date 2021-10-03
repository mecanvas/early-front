import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { useAppSelector } from 'src/hooks/useRedux';
import { OptionType } from 'src/interfaces/ProductInterface';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1em;
  width: 95%;
  display: flex;
  justify-content: center;
`;

const Cart = () => {
  const { userData, noneUserData } = useAppSelector((state) => state.user);
  const cartList = useMemo(() => {
    if (userData && userData.cart) {
      const { cart } = userData;
      return cart;
    }
    if (noneUserData && noneUserData.cart) {
      const { cart } = noneUserData;
      return cart;
    }
    return [];
  }, [noneUserData, userData]);

  return (
    <Container>
      {cartList.length ? (
        <div>
          {cartList.map(({ product, ...lst }) => (
            <div key={lst.id}>
              <div>{product.productTitle}</div>
              <div>
                <img src={product.thumb} alt="상품 썸네일" />
              </div>
              {product.type === OptionType.SINGLE ? (
                <div>
                  <div>{product.qty}개</div>
                  <div>{product.price?.toLocaleString()}원</div>
                </div>
              ) : (
                <div>
                  {product.optionSelect?.map((select) => (
                    <div key={select.listId}>
                      <div>{select.optionAbbr.fullName}</div>
                      <div>{select.qty}개</div>
                      <div>{select.price.toLocaleString()}원</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div></div>
      )}
    </Container>
  );
};

export default Cart;
