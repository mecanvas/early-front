import { Divider } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DeliveryOption } from 'src/interfaces/ProductInterface';
import { setProductDeliveryOption, setProductOrder } from 'src/store/reducers/order';
import ProductOrderDeliver from './ProductOrderDeliver';
import { SelectItemQty, TotalPrice } from './ProductOrderMutiOptions';

const ProductOrderSingleOptions = ({
  title,
  deliveryOption,
  price,
}: {
  title: string;
  deliveryOption: DeliveryOption;
  price: number;
}) => {
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);

  const handleCount = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { type } = e.currentTarget.dataset;

    if (type === '-') {
      setCount((prev) => {
        if (prev > 1) {
          return prev - 1;
        }
        return prev;
      });
    }
    if (type === '+') {
      setCount((prev) => prev + 1);
    }
  };

  useEffect(() => {
    dispatch(setProductOrder([{ id: 1, value: title, qty: count, price: count * price }]));
    dispatch(setProductDeliveryOption(deliveryOption));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <div>
      <SelectItemQty>
        <button onClick={handleCount} data-type="-">
          -
        </button>
        <div>{count}</div>
        <button onClick={handleCount} data-type="+">
          +
        </button>
      </SelectItemQty>

      <ProductOrderDeliver deliveryOption={deliveryOption} />

      <Divider />

      {count && (
        <TotalPrice>
          <span>총 상품 개수 {count}개</span>
          <span>|</span>
          <span>{(count * price).toLocaleString()}원</span>
        </TotalPrice>
      )}
    </div>
  );
};

export default ProductOrderSingleOptions;
