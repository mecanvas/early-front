import { CloseCircleOutlined, DownOutlined } from '@ant-design/icons';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ProductOption, DeliveryOption } from 'src/interfaces/ProductInterface';
import styled from '@emotion/styled';
import ProductOrderDeliver from './ProductOrderDeliver';
import { css } from '@emotion/react';
import { useDispatch } from 'react-redux';
import { setProductDeliveryOption, setProductOrder } from 'src/store/reducers/order';

export const OrderOptionContainer = styled.div``;

const SelectBox = styled.div<{ disabled: boolean }>`
  position: relative;
  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0.3;
    `}
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
  margin-bottom: 0.5em;
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
  thumb: string;
}

interface OrderList {
  value: string;
  productId: number;
  optionId: number;
  qty: number;
  additionalPrice: number;
}

const ProductOrderMutiOptions = ({ productOption, deliveryOption, price, thumb }: Props) => {
  const dispatch = useDispatch();

  const { options } = productOption;
  const [orderList, setOrderList] = useState<OrderList[]>([]);
  const [showOptionList, setShowOptionList] = useState(0);
  const [selectedOptionValue, setSelectedOptionValue] = useState<string[]>([]);

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
    const { type, optionid: optionId, value } = e.currentTarget.dataset;

    if (type === '-' && optionId) {
      setOrderList((prev) =>
        prev.map((item) => ({
          ...item,
          qty: item.optionId === +optionId && item.value === value && item.qty > 1 ? item.qty - 1 : item.qty,
        })),
      );
    }
    if (type === '+' && optionId) {
      setOrderList((prev) =>
        prev.map((item) => ({
          ...item,
          qty: item.optionId === +optionId && item.value === value ? item.qty + 1 : item.qty,
        })),
      );
    }
  };

  const handleDelete = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    const { value } = e.currentTarget.dataset;

    if (value) {
      setOrderList((prev) => prev.filter((item) => item.value !== value));
    }
  }, []);

  const handleOptionSelectStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { id } = e.currentTarget.dataset;
    if (id) {
      setShowOptionList((prev) => (prev === +id ? 0 : +id));
    }
  }, []);

  const handleOptionSelect = useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => {
      e.stopPropagation();
      const {
        optionname: optionName,
        value,
        optionid: optionId,
        additionalprice: additionalPrice,
        productid: productId,
      } = e.currentTarget.dataset;
      setShowOptionList(0);

      if (optionName && value && optionId && additionalPrice && productId) {
        const last = options?.length === +productId;

        setSelectedOptionValue((prev) => {
          if (prev) {
            if (prev[+productId - 1]) {
              prev[+productId - 1] = value;
              return prev;
            }
            return [...prev, value];
          }
          return [value];
        });

        // 마지막 옵션값까지 골랐을때
        if (last) {
          setOrderList((prev) => {
            const txt = selectedOptionValue ? `${selectedOptionValue.join(', ')}, ${value}` : value;
            if (prev.length) {
              if (prev.find((lst) => lst.optionId === +optionId && lst.value === txt)) {
                alert('이미 추가 되었습니다 :)');
                return prev;
              }

              return [
                ...prev,
                { optionId: +optionId, productId: +productId, value: txt, qty: 1, additionalPrice: +additionalPrice },
              ];
            } else {
              return [
                { optionId: +optionId, productId: +productId, value: txt, qty: 1, additionalPrice: +additionalPrice },
              ];
            }
          });
          setSelectedOptionValue([]);
        }
      }
    },
    [options?.length, selectedOptionValue],
  );

  useEffect(() => {
    const productOrder = orderList.map((lst) => ({
      optionId: lst.optionId,
      productId: lst.productId,
      thumb: thumb,
      value: lst.value,
      qty: lst.qty,
      price: lst.qty * (price + lst.additionalPrice),
    }));
    dispatch(setProductOrder(productOrder));
    dispatch(setProductDeliveryOption(deliveryOption));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderList]);

  return (
    <OrderOptionContainer>
      {options?.map((lst, index) => (
        <SelectBox
          disabled={index > 0 ? (selectedOptionValue[index - 1] ? false : true) : false}
          key={lst.id}
          data-id={lst.id}
          onClick={handleOptionSelectStart}
        >
          <div>{selectedOptionValue[index] || lst.optionName}</div>
          {lst.value.map((value) =>
            lst.id === showOptionList ? (
              <SelectList key={value.id}>
                <li
                  onClick={handleOptionSelect}
                  data-additionalprice={value.additionalPrice}
                  data-productid={lst.id}
                  data-optionid={value.id}
                  data-optionname={lst.optionName}
                  data-value={value.text}
                >
                  {value.text} {value.additionalPrice ? `(+${value.additionalPrice.toLocaleString()})` : ''}
                </li>
              </SelectList>
            ) : null,
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
            <SelectItemList key={item.value}>
              <SelecItemTitle>
                {item.value}{' '}
                <span onClick={handleDelete} data-value={item.value}>
                  <CloseCircleOutlined />
                </span>
              </SelecItemTitle>

              <SelectItemPriceSetting>
                <SelectItemQty>
                  <button onClick={handleCount} data-value={item.value} data-optionid={item.optionId} data-type="-">
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button onClick={handleCount} data-value={item.value} data-optionid={item.optionId} data-type="+">
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
