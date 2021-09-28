import { CloseCircleOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import React, { useState, useMemo, useCallback } from 'react';
import { ProductOption, DeliveryOption } from 'src/interfaces/ProductInterface';

interface OrderList {
  optionName: string;
  value: string;
  id: number;
  qty: number;
  additionalPrice: number;
}

interface Props {
  productOption: ProductOption;
  deliveryOption: DeliveryOption;
  price: number;
}

const ProductOrderMutiOptions = ({ productOption, deliveryOption, price }: Props) => {
  const { options } = productOption;
  const [orderList, setOrderList] = useState<OrderList[]>([]);
  const [showOptionList, setShowOptionList] = useState(false);

  const totalQty = useMemo(() => {
    return orderList.reduce((acc, cur) => {
      if (acc) {
        acc += cur.qty;
        return acc;
      }
      return cur.qty;
    }, 0);
  }, [orderList]);

  const totalPrice = useMemo(() => {
    return orderList.reduce((acc, cur) => {
      if (acc) {
        acc += cur.qty * (price + cur.additionalPrice);
        return acc;
      }
      return cur.qty * (price + cur.additionalPrice);
    }, 0);
  }, [orderList, price]);

  const handleCount = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { type, id } = e.currentTarget.dataset;

    if (type === '-' && id) {
      setOrderList((prev) =>
        prev.map((item) => ({ ...item, qty: item.id === +id && item.qty > 1 ? item.qty - 1 : item.qty })),
      );
    }
    if (type === '+' && id) {
      setOrderList((prev) => prev.map((item) => ({ ...item, qty: item.id === +id ? item.qty + 1 : item.qty })));
    }
  };

  const handleDelete = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    const { id } = e.currentTarget.dataset;

    if (id) {
      setOrderList((prev) => prev.filter((item) => item.id !== +id));
    }
  }, []);

  const handleOptionSelectStart = useCallback(() => {
    setShowOptionList((prev) => !prev);
  }, []);

  const handleOptionSelect = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { optionname: optionName, value, id, additionalprice: additionalPrice } = e.currentTarget.dataset;
    if (optionName && value && id && additionalPrice) {
      setOrderList((prev) => {
        if (prev.length) {
          if (prev.find((lst) => lst.id === +id)) {
            return prev;
          }
          return [...prev, { id: +id, optionName, value, qty: 1, additionalPrice: +additionalPrice }];
        } else {
          return [{ id: +id, optionName, value, qty: 1, additionalPrice: +additionalPrice }];
        }
      });
    }
  }, []);

  return (
    <div>
      {options?.map((lst) => (
        <div key={lst.id} onClick={handleOptionSelectStart}>
          {lst.optionName}
          {showOptionList && (
            <div>
              {lst.value.map((value) => (
                <div
                  key={value.id}
                  onClick={handleOptionSelect}
                  data-additionalprice={value.additionalPrice}
                  data-id={value.id}
                  data-optionname={lst.optionName}
                  data-value={value.text}
                >
                  {value.text} {value.additionalPrice ? `(+${value.additionalPrice.toLocaleString()})` : ''}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <div>
        <div>
          {deliveryOption.deliveryPrice.toLocaleString()}원{' '}
          {deliveryOption.limit && `(${deliveryOption.limit.toLocaleString()}원 이상 구매시 무료 배송)`}
        </div>
        <div>도서산간 지역의 경우 {deliveryOption.additionalPrice.toLocaleString()}원 추가</div>
      </div>

      {orderList.length ? (
        <div>
          {orderList.map((item) => (
            <div key={item.id}>
              <span>
                {item.optionName} - {item.value}{' '}
              </span>
              <span>
                <div>
                  <button onClick={handleCount} data-id={item.id} data-type="-">
                    -
                  </button>
                  <div>{item.qty}</div>
                  <button onClick={handleCount} data-id={item.id} data-type="+">
                    +
                  </button>
                </div>
              </span>
              <span>
                {item.additionalPrice ? `${(price + item.additionalPrice).toLocaleString()}원` : `${price}원`}
              </span>
              <span onClick={handleDelete} data-id={item.id}>
                <CloseCircleOutlined />
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <Divider />

      {orderList.length ? (
        <div>
          <span>총 상품 개수 {totalQty}개</span>
          <span>|</span>
          <span>{totalPrice.toLocaleString()}원</span>
        </div>
      ) : null}
    </div>
  );
};

export default ProductOrderMutiOptions;
