import router from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from 'src/hooks/useRedux';
import { Cart } from 'src/interfaces/User';
import { setProductOrder } from 'src/store/reducers/order';
import { setCartQty } from 'src/store/reducers/user';
import {
  CartListContainer,
  CartProductImg,
  CartText,
  CartMultiCount,
  CartQtyCount,
  DeleteCartItem,
  CartProductContainer,
} from '.';

interface CartSingleProps extends Cart {
  allCheck: boolean;
  cartList: Cart[];
}

const CartSingle = ({ product, id, allCheck }: CartSingleProps) => {
  const { productOrder } = useAppSelector((state) => state.order);
  const dispatch = useDispatch();
  const [values, setValues] = useState<number[]>([]);

  const handleGoToProduct = useCallback((e) => {
    const { productid: productId } = e.currentTarget.dataset;
    if (productId) {
      router.push(`/product/${productId}`);
    }
  }, []);

  const handleChecked = useCallback(
    (e) => {
      const { value: productId } = e.target;
      setValues((prev) => {
        if (!prev.length) {
          const newOrder = [...productOrder, product];
          dispatch(setProductOrder(newOrder));
          return [+productId];
        }
        if (prev.find((lst) => lst === +productId)) {
          const newOrder = productOrder.filter((lst) => lst.productId !== +productId);
          dispatch(setProductOrder(newOrder));
          return prev.filter((lst) => lst !== +productId);
        } else {
          const newOrder = [...productOrder, product];
          dispatch(setProductOrder(newOrder));
          return [...prev, +productId];
        }
      });
    },
    [dispatch, product, productOrder],
  );

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
          <div>{((product?.qty || 1) * (product.price || 1))?.toLocaleString()}원</div>
        </CartMultiCount>
      </CartProductContainer>
      <DeleteCartItem>X</DeleteCartItem>
    </CartListContainer>
  );
};

export default CartSingle;
