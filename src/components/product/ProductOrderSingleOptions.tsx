import { Divider } from 'antd';
import React, { useState } from 'react';
import { DeliveryOption } from 'src/interfaces/ProductInterface';
import ProductOrderDeliver from './ProductOrderDeliver';
import { SelectItemQty, TotalPrice } from './ProductOrderMutiOptions';

const ProductOrderSingleOptions = ({ deliveryOption, price }: { deliveryOption: DeliveryOption; price: number }) => {
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
