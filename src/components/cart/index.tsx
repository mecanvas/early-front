import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { useAppSelector } from 'src/hooks/useRedux';
import { OptionType } from 'src/interfaces/ProductInterface';
import Link from 'next/link';
import { Btn } from '../common/Button';
import { theme } from 'src/style/theme';
import { useDispatch } from 'react-redux';
import { setProductOrder } from 'src/store/reducers/order';
import { NoneUserData, UserData } from 'src/store/reducers/user';
import CartMulti from './CartMulti';
import CartSingle from './CartSingle';

const CartEmpty = styled.div`
  width: 100%;
  min-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CartTotalPrice = styled.div`
  width: 100%;
  text-align: right;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 1em auto;
  padding: 1em;
  width: 95%;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray200};
`;

const CartSelectBtn = styled.div`
  margin-bottom: 3em;
`;

export const CartProductContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0.8em auto;
  display: flex;
  align-items: center;
  padding-bottom: 1em;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray300};
`;

export const CartListContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  position: relative;

  input[type='checkbox'] {
    cursor: pointer;
    width: 18px;
    height: 18px;
    margin-right: 1em;
    padding: 0.4em;
  }
`;

export const CartProductImg = styled.div`
  max-width: 100px;
  cursor: pointer;
  img {
    width: 100%;
  }
`;

export const CartText = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
  padding-left: 0.8em;
  flex: 1;
`;

export const CartOption = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 2em;
`;

export const CartMultiCount = styled.div`
  margin: 0.5em 0;
  flex: 1;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: flex-start;
  text-align: right;
  * {
    color: ${({ theme }) => theme.color.gray700};
    font-size: 0.85rem;
  }
`;

export const CartQtyCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  button {
    border: 1px solid ${({ theme }) => theme.color.gray300};
    &:nth-of-type(2) {
      margin-right: 0.7em;
    }
  }
  div {
    font-size: 0.85rem;
    margin: 0 0.5em;
  }
`;

export const CartOptionAbbr = styled.div`
  * {
    font-weight: 600;
    font-size: 0.85rem;
  }
`;

export const DeleteCartItem = styled.div`
  position: absolute;
  cursor: pointer;
  top: 5px;
  right: 0;
  padding: 0em 0.4em;
  border: 1px solid ${({ theme }) => theme.color.gray300};
  font-size: 0.85rem;
  &:hover {
    background: ${({ theme }) => theme.color.gray300};
    opacity: 0.6;
  }
`;

const CartProduct = () => {
  const { userData, noneUserData } = useAppSelector((state) => state.user);

  const userId = useMemo(() => {
    if (userData) {
      return userData.id;
    }
    return noneUserData.id;
  }, [userData, noneUserData]);

  const cartList = useMemo(() => {
    const getCartList = (user: UserData | NoneUserData) => {
      const { cart } = user;
      return cart || [];
    };

    return getCartList(userData || noneUserData);
  }, [noneUserData, userData]);

  const [allCheck, setAllCheck] = useState(true);
  const dispatch = useDispatch();

  const totalPrice = useMemo(() => {
    const p = cartList.map(({ product }) => {
      let total = 0;
      if (product.type === OptionType.SINGLE) {
        if (!product.qty || !product.price) return;
        total += product.qty * product.price;
      }

      if (product.type === OptionType.MULTI) {
        const price = product.optionSelect?.reduce((acc, cur) => {
          if (acc) {
            acc += cur.qty * cur.price;
            return acc;
          } else {
            acc = cur.qty * cur.price;
            return acc;
          }
        }, 0);
        total += price || 0;
      }
      return total;
    });

    console.log(p);

    const num = p.reduce((acc, cur) => {
      if (!cur) {
        return;
      }
      if (acc) {
        acc += +cur;
        return acc;
      } else {
        acc = +cur;
        return acc;
      }
    }, 0);

    return num;
  }, [cartList]);

  const handleAllCheck = useCallback(() => {
    setAllCheck(() => true);
    const order = cartList.map((lst) => lst.product);
    dispatch(setProductOrder(order));
  }, [cartList, dispatch]);

  const handleAllCheckRemove = useCallback(() => {
    setAllCheck(() => false);
    dispatch(setProductOrder([]));
  }, [dispatch]);

  useEffect(() => {
    const order = cartList.map((lst) => lst.product);
    dispatch(setProductOrder(order));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <h2>장바구니</h2>

      {cartList.length ? (
        <>
          <CartSelectBtn>
            <Btn
              width={80}
              padding={'0.1em'}
              margin={'0 0.8em 0 0'}
              color={theme.color.black}
              bg={theme.color.white}
              borderColor={theme.color.gray200}
              fontSize="small"
              type="button"
              onClick={handleAllCheck}
            >
              전체선택
            </Btn>
            <Btn width={80} padding={'0.1em'} fontSize="small" type="button" onClick={handleAllCheckRemove}>
              전체해제
            </Btn>
          </CartSelectBtn>

          {cartList.map(({ product, id }, i, cartList) =>
            product.type === OptionType.SINGLE ? (
              <CartSingle allCheck={allCheck} product={product} id={id} key={id + i} cartList={cartList} />
            ) : (
              <CartMulti allCheck={allCheck} product={product} id={id} key={id - i} />
            ),
          )}
          <CartTotalPrice>
            {totalPrice ? <h5>총 {totalPrice?.toLocaleString()}원</h5> : <h5>선택하신 상품이 없습니다.</h5>}
          </CartTotalPrice>

          <div>
            <Link href={`/product/order/${Date.now()}?user=${userId}`}>
              <Btn type="button">결제하기</Btn>
            </Link>
          </div>
        </>
      ) : (
        <CartEmpty>
          <h2>장바구니에 담긴 상품이 없습니다 :)</h2>
        </CartEmpty>
      )}
    </Container>
  );
};

export default CartProduct;
