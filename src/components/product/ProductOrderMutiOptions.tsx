import { CloseCircleOutlined, DownOutlined } from '@ant-design/icons';
import React, { useState, useMemo, useCallback } from 'react';
import { ProductOption, DeliveryOption } from 'src/interfaces/ProductInterface';
import styled from '@emotion/styled';
import ProductOrderDeliver from './ProductOrderDeliver';

export const OrderOptionContainer = styled.div``;

const SelectBox = styled.div`
  position: relative;
  div {
    padding: 0.7em;
  }
  span {
    position: absolute;
    top: 10px;
    right: 5px;
  }
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.color.gray300};
`;

const SelectList = styled.ul`
  border-top: 1px solid ${({ theme }) => theme.color.gray300};
  li {
    padding: 0.7em;
    &:hover {
      background-color: ${({ theme }) => theme.color.gray100};
    }
  }
  li ~ li {
    border-top: 1px solid ${({ theme }) => theme.color.gray300};
  }
`;

interface OrderList {
  optionName: string;
  value: string;
  id: number;
  qty: number;
  additionalPrice: number;
}

const SelectItemList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1.5em;
  margin-bottom: 1em;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray300};
`;

const EmptyTitle = styled.div`
  width: 100%;
  text-align: center;
  font-weight: 700;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.color.gray700};
  margin: 2em 0;
`;

const SelecItemTitle = styled.div`
  position: relative;
  width: 100%;
  font-weight: bold;
  margin-right: auto;
  color: ${({ theme }) => theme.color.gray700};
  span {
    position: absolute;
    top: 0;
    right: 5px;
    cursor: pointer;
  }
`;

const SelectItemPriceSetting = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

export const SelectItemQty = styled.div`
  display: flex;
  align-items: center;
  button {
    outline: none;
    background: ${({ theme }) => theme.color.white};
    color: ${({ theme }) => theme.color.black};
    border: 1px solid ${({ theme }) => theme.color.gray700};
    padding: 0 0.5em;
    font-size: 18px;
    margin: 0 0.4em;
  }
`;

export const TotalPrice = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 1.5em 0;
  span {
    margin-right: 0.5em;

    &:nth-of-type(1) {
      span {
        margin: 0;
        font-weight: bold;
        font-size: 1.25rem;
      }
    }

    &:nth-of-type(3) {
      font-weight: bold;
      font-size: 1.25rem;
    }
  }
`;

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

  const handleOptionSelect = useCallback((e: React.MouseEvent<HTMLLIElement>) => {
    const { optionname: optionName, value, id, additionalprice: additionalPrice } = e.currentTarget.dataset;
    if (optionName && value && id && additionalPrice) {
      setOrderList((prev) => {
        if (prev.length) {
          if (prev.find((lst) => lst.id === +id)) {
            alert('이미 추가 되었습니다 :)');
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
    <OrderOptionContainer>
      {options?.map((lst) => (
        <SelectBox key={lst.id} onClick={handleOptionSelectStart}>
          <div>{lst.optionName}</div>
          {showOptionList && (
            <SelectList>
              {lst.value.map((value) => (
                <li
                  key={value.id}
                  onClick={handleOptionSelect}
                  data-additionalprice={value.additionalPrice}
                  data-id={value.id}
                  data-optionname={lst.optionName}
                  data-value={value.text}
                >
                  {value.text} {value.additionalPrice ? `(+${value.additionalPrice.toLocaleString()})` : ''}
                </li>
              ))}
            </SelectList>
          )}
          <span>
            <DownOutlined />
          </span>
        </SelectBox>
      ))}

      <ProductOrderDeliver deliveryOption={deliveryOption} />

      {orderList.length ? (
        <div>
          {orderList.map((item) => (
            <SelectItemList key={item.id}>
              <SelecItemTitle>
                {item.optionName} - {item.value}{' '}
                <span onClick={handleDelete} data-id={item.id}>
                  <CloseCircleOutlined />
                </span>
              </SelecItemTitle>

              <SelectItemPriceSetting>
                <SelectItemQty>
                  <button onClick={handleCount} data-id={item.id} data-type="-">
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button onClick={handleCount} data-id={item.id} data-type="+">
                    +
                  </button>
                </SelectItemQty>
                <div>
                  {item.additionalPrice ? `${(price + item.additionalPrice).toLocaleString()}원` : `${price}원`}
                </div>
              </SelectItemPriceSetting>
            </SelectItemList>
          ))}
        </div>
      ) : (
        <EmptyTitle>선택하신 상품이 없어요 :) 얼른 담아주세요.</EmptyTitle>
      )}

      {orderList.length ? (
        <TotalPrice>
          <span>
            총 상품 개수 <span>{totalQty}</span>개
          </span>
          <span>|</span>
          <span>{totalPrice.toLocaleString()}원</span>
        </TotalPrice>
      ) : null}
    </OrderOptionContainer>
  );
};

export default ProductOrderMutiOptions;
