import router from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from 'src/hooks/useRedux';
import { Cart } from 'src/interfaces/User';
import { setProductOrder } from 'src/store/reducers/order';
import { setCartQty } from 'src/store/reducers/user';
import {
  CartListContainer,
  CartProductContainer,
  CartProductImg,
  CartText,
  CartOption,
  CartOptionAbbr,
  CartMultiCount,
  CartQtyCount,
  DeleteCartItem,
} from '.';

interface CartMultiProps extends Cart {
  allCheck: boolean;
}

const CartMulti = ({ product, allCheck }: CartMultiProps) => {
  const dispatch = useDispatch();
  const { productOrder } = useAppSelector((state) => state.order);
  const [values, setValues] = useState<number[]>([]);

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

  useEffect(() => {
    if (!allCheck) {
      setValues([]);
    } else {
      setValues([product.productId] || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCheck]);

  return (
    <>
      <CartListContainer key={product.productId}>
        <div>
          <input
            type="checkbox"
            onChange={handleChecked}
            value={product.productId}
            checked={values.includes(product.productId)}
          />
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

          <CartOption>
            {product.optionSelect?.map((select, index) => (
              <div key={select.listId}>
                <CartOptionAbbr>
                  <div key={index}>{select.optionAbbr.fullName}</div>
                </CartOptionAbbr>
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
                    <div>{(select.qty * select.price).toLocaleString()}원</div>
                  </>
                </CartMultiCount>
              </div>
            ))}
          </CartOption>
        </CartProductContainer>
        <DeleteCartItem>X</DeleteCartItem>
      </CartListContainer>
    </>
  );
};

export default CartMulti;
