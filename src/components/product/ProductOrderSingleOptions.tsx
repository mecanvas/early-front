import { Divider } from 'antd';
import React, { useState } from 'react';
import { DeliveryOption } from 'src/interfaces/ProductInterface';

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
      <div>
        <button onClick={handleCount} data-type="-">
          -
        </button>
        <div>{count}</div>
        <button onClick={handleCount} data-type="+">
          +
        </button>
      </div>

      <div>
        <div>
          {deliveryOption.deliveryPrice.toLocaleString()}원{' '}
          {deliveryOption.limit && `(${deliveryOption.limit.toLocaleString()}원 이상 구매시 무료 배송)`}
        </div>
        <div>도서산간 지역의 경우 {deliveryOption.additionalPrice.toLocaleString()}원 추가</div>
      </div>

      <Divider />

      {count && (
        <div>
          <span>총 상품 개수 {count}개</span>
          <span>|</span>
          <span>{(count * price).toLocaleString()}원</span>
        </div>
      )}
    </div>
  );
};

export default ProductOrderSingleOptions;
