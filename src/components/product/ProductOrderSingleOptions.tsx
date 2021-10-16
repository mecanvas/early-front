import { Divider } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DeliveryOption, OptionType } from 'src/interfaces/ProductInterface';
import { setProductDeliveryOption, setProductOrder } from 'src/store/reducers/order';
import SoldOut from '../common/SoldOut';
import ProductOrderDeliver from './ProductOrderDeliver';
import { SelectItemQty, TotalPrice } from './ProductOrderMutiOptions';

const ProductOrderSingleOptions = ({
  title,
  deliveryOption,
  price,
  productId,
  thumb,
  status,
}: {
  title: string;
  deliveryOption: DeliveryOption;
  productId: number;
  thumb: string;
  price: number;
  status: number;
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
    dispatch(
      setProductOrder([
        {
          type: OptionType.SINGLE,
          optionSelect: null,
          productId,
          productTitle: title,
          thumb,
          qty: count,
          price: count * price,
          deliveryOption,
        },
      ]),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useEffect(() => {
    dispatch(setProductDeliveryOption(deliveryOption));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === 2) {
    return <SoldOut />;
  }

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
