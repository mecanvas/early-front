import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { useAppSelector } from 'src/hooks/useRedux';
import { OptionType } from 'src/interfaces/ProductInterface';
import { Cart } from 'src/interfaces/User';
import Link from 'next/link';
import { Btn } from '../common/Button';
import { theme } from 'src/style/theme';
import { ProductOrder } from 'src/interfaces/OrderInterface';
import { useDispatch } from 'react-redux';
import { setProductOrder } from 'src/store/reducers/order';
import router from 'next/router';
import { NoneUserData, setCartQty, UserData } from 'src/store/reducers/user';

const CartEmpty = styled.div`
  width: 100%;
  min-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
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

const CartProductContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0.8em auto;
  display: flex;
  align-items: center;
  padding-bottom: 1em;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray300};
`;

const CartListContainer = styled.div`
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

const CartProductImg = styled.div`
  max-width: 100px;
  cursor: pointer;
  img {
    width: 100%;
  }
`;

const CartText = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
  padding-left: 0.8em;
  & > div {
    flex: 1;
  }
`;

const CartMultiCount = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  justify-content: flex-end;
  text-align: right;
  * {
    color: ${({ theme }) => theme.color.gray700};
  }
`;

const CartQtyCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  button {
    border: 1px solid ${({ theme }) => theme.color.gray300};
    padding: 0.2em 0.5em;
    &:nth-of-type(2) {
      margin-right: 0.7em;
    }
  }
  div {
    font-size: 0.85rem;
    margin: 0 0.5em;
  }
`;

const CartOptionAbbr = styled.div`
  font-size: 0.65rem;

  * {
    font-size: 0.65rem;
  }
`;

const DeleteCartItem = styled.div`
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

interface CartSingleProps extends Cart {
  allCheck: boolean;
}

interface CartMultiProps {
  product: ProductOrder;
  allCheck: boolean;
}

const CartSingle = ({ product, id, allCheck }: CartSingleProps) => {
  const [values, setValues] = useState<number[]>([]);
  const dispatch = useDispatch();

  const handleGoToProduct = useCallback((e) => {
    const { productid: productId } = e.currentTarget.dataset;
    if (productId) {
      router.push(`/product/${productId}`);
    }
  }, []);

  const handleChecked = useCallback((e) => {
    const { value } = e.target;
    setValues((prev) => {
      if (!prev.length) {
        return [+value];
      }
      if (prev.find((lst) => lst === +value)) {
        return prev.filter((lst) => lst !== +value);
      } else {
        return [...prev, +value];
      }
    });
  }, []);

  const handleQtyCount = useCallback(
    (e) => {
      const { value } = e.target;
      const { productid: productId } = e.currentTarget.dataset;

      if (productId && value) {
        dispatch(setCartQty({ productId: +productId, type: value as '-' | '+' }));
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (!allCheck) {
      setValues([]);
    } else {
      setValues([id]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCheck]);

  return (
    <CartListContainer>
      <div>
        <input type="checkbox" value={id} onChange={handleChecked} checked={values.includes(id)} />
      </div>
      <CartProductContainer>
        <CartProductImg data-productid={product.productId} onClick={handleGoToProduct}>
          <img src={product.thumb} alt="상품 썸네일" />
        </CartProductImg>

        <CartText data-productid={product.productId} onClick={handleGoToProduct}>
          <div>
            <h5>{product.productTitle}</h5>
          </div>
        </CartText>
        <CartMultiCount>
          <CartQtyCount>
            <button type="button" value="-" data-productid={product.productId} onClick={handleQtyCount}>
              -
            </button>
            <div>{product.qty}개</div>
            <button type="button" value="+" data-productid={product.productId} onClick={handleQtyCount}>
              +
            </button>
          </CartQtyCount>
          <div>{product.price?.toLocaleString()}원</div>
        </CartMultiCount>
      </CartProductContainer>
      <DeleteCartItem>X</DeleteCartItem>
    </CartListContainer>
  );
};

const CartMulti = ({ product, allCheck }: CartMultiProps) => {
  const [values, setValues] = useState<number[]>([]);
  const dispatch = useDispatch();

  const handleGoToProduct = useCallback((e) => {
    const { productid: productId } = e.currentTarget.dataset;
    if (productId) {
      router.push(`/product/${productId}`);
    }
  }, []);

  const handleQtyCount = useCallback(
    (e) => {
      const { value } = e.target;
      const { productid: productId, listid: listId } = e.currentTarget.dataset;

      if (productId && listId && value) {
        dispatch(setCartQty({ productId: +productId, listId: +listId, type: value as '-' | '+' }));
      }
    },
    [dispatch],
  );

  const handleChecked = useCallback((e) => {
    const { value } = e.target;
    setValues((prev) => {
      if (!prev.length) {
        return [+value];
      }
      if (prev.find((lst) => lst === +value)) {
        return prev.filter((lst) => lst !== +value);
      } else {
        return [...prev, +value];
      }
    });
  }, []);

  useEffect(() => {
    if (!allCheck) {
      setValues([]);
    } else {
      setValues(product.optionSelect?.map((select) => select.listId) || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCheck]);

  return (
    <>
      {product.optionSelect?.map((select, index) => (
        <CartListContainer key={select.listId}>
          <div>
            <input
              type="checkbox"
              data-index={select.listId}
              onChange={handleChecked}
              value={select.listId}
              checked={values.includes(select.listId)}
            />
          </div>
          <CartProductContainer>
            <CartProductImg data-productid={product.productId} onClick={handleGoToProduct}>
              <img src={product.thumb} alt="상품 썸네일" />
            </CartProductImg>

            <CartText data-productid={product.productId} onClick={handleGoToProduct}>
              <div>
                <h5>{product.productTitle}</h5>
                <CartOptionAbbr>
                  <div key={index}>{select.optionAbbr.fullName}</div>
                </CartOptionAbbr>
              </div>
            </CartText>
            <CartMultiCount>
              <>
                <CartQtyCount>
                  <button
                    type="button"
                    value="-"
                    data-productid={product.productId}
                    data-listid={select.listId}
                    onClick={handleQtyCount}
                  >
                    -
                  </button>
                  <div>{select.qty}개</div>
                  <button
                    type="button"
                    value="+"
                    data-productid={product.productId}
                    data-listid={select.listId}
                    onClick={handleQtyCount}
                  >
                    +
                  </button>
                </CartQtyCount>
                <div>{select.price.toLocaleString()}원</div>
              </>
            </CartMultiCount>
          </CartProductContainer>
          <DeleteCartItem>X</DeleteCartItem>
        </CartListContainer>
      ))}
    </>
  );
};

const CartProduct = () => {
  const { userData, noneUserData } = useAppSelector((state) => state.user);
  const cartList = useMemo(() => {
    const getCartList = (user: UserData | NoneUserData) => {
      const { cart } = user;
      return cart || [];
    };

    return getCartList(userData || noneUserData);
  }, [noneUserData, userData]);

  const [allCheck, setAllCheck] = useState(false);
  const dispatch = useDispatch();

  const totalPrice = useMemo(() => {
    const p = cartList.map(({ product }) => {
      let total = 0;
      if (product.type === OptionType.SINGLE) {
        if (!product.qty || !product.price) return;
        total += product.price;
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

          {cartList.map(({ product, id }, i) =>
            product.type === OptionType.SINGLE ? (
              <CartSingle allCheck={allCheck} product={product} id={id} key={id + i} />
            ) : (
              <CartMulti allCheck={allCheck} product={product} key={id - i} />
            ),
          )}
          <div>
            <h5>총 {totalPrice?.toLocaleString()}</h5>
          </div>

          <div>
            <Link href={`/product/order/${Date.now()}`}>
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
