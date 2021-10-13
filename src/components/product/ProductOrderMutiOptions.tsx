import { CloseCircleOutlined, DownOutlined } from '@ant-design/icons';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  ProductOption,
  DeliveryOption,
  ProductOptionSelectList,
  SelectedOptionValue,
  OptionType,
} from 'src/interfaces/ProductInterface';
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

export const SelectItemPrice = styled.div`
  font-size: 14px;
  width: 80px;
  text-align: center;
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
  title: string;
  productId: number;
}

const ProductOrderMutiOptions = ({ productOption, deliveryOption, price, thumb, title, productId }: Props) => {
  const dispatch = useDispatch();

  const { options } = productOption;
  const [selectList, setSelectList] = useState<ProductOptionSelectList[]>([]);
  const [lastSelect, setLastSelect] = useState(false);
  const [showOptionList, setShowOptionList] = useState(0);
  const [selectedOptionValue, setSelectedOptionValue] = useState<SelectedOptionValue[]>([]);

  const totalQty = useMemo(() => {
    return selectList.reduce((acc, cur) => {
      if (acc) {
        acc += cur.qty;
        return acc;
      }
      return cur.qty;
    }, 0);
  }, [selectList]);

  const totalPrice = useMemo(() => {
    return selectList.reduce((acc, cur) => {
      if (acc) {
        acc += cur.qty * cur.price;
        return acc;
      }
      return cur.qty * cur.price;
    }, 0);
  }, [selectList]);

  const handleCount = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const { type, id } = e.currentTarget.dataset;

    if (type === '-' && id) {
      setSelectList((prev) =>
        prev.map((item) => ({
          ...item,
          qty: item.listId === +id && item.qty > 1 ? item.qty - 1 : item.qty,
        })),
      );
    }
    if (type === '+' && id) {
      setSelectList((prev) =>
        prev.map((item) => ({
          ...item,
          qty: item.listId === +id ? item.qty + 1 : item.qty,
        })),
      );
    }
  }, []);

  const handleDelete = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    const { id } = e.currentTarget.dataset;

    if (id) {
      setSelectList((prev) => prev.filter((item) => item.listId !== +id));
    }
  }, []);

  const handleOptionSelectStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { optionid: optionId } = e.currentTarget.dataset;
    if (optionId) {
      setShowOptionList((prev) => (prev === +optionId ? 0 : +optionId));
    }
  }, []);

  const handleOptionSelect = useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => {
      e.stopPropagation();
      const {
        optionname: optionName,
        value,
        stock,
        optionvalueid: optionValueId,
        additionalprice: additionalPrice,
        optionid: optionId,
      } = e.currentTarget.dataset;

      setShowOptionList(0);

      if (optionName && value && optionValueId && additionalPrice && optionId && stock) {
        const last = options?.length === +optionId;

        const checkOptionId = (id: number) => {
          return id === +optionId;
        };

        setSelectedOptionValue((prev) => {
          if (prev.find((lst) => lst.optionId === +optionId)) {
            return prev.map((lst) => ({
              ...lst,
              additionalPrice: checkOptionId(lst.optionId) ? +additionalPrice : lst.additionalPrice,
              optionValueId: checkOptionId(lst.optionId) ? +optionValueId : lst.optionValueId,
              value: checkOptionId(lst.optionId) ? value : lst.value,
              stock: checkOptionId(lst.optionId) ? +stock : lst.stock,
            }));
          }
          return [
            ...prev,
            {
              optionId: +optionId,
              optionName: optionName,
              optionValueId: +optionValueId,
              value: value,
              additionalPrice: +additionalPrice,
              stock: +stock,
            },
          ];
        });
        // 마지막 옵션값까지 골랐을때
        setLastSelect(last);
      }
    },
    [options?.length],
  );

  useEffect(() => {
    if (!selectedOptionValue.length) return;
    if (lastSelect) {
      const totalAddition = selectedOptionValue.reduce((acc, cur) => {
        if (acc) {
          acc += cur.additionalPrice;
        } else {
          acc = cur.additionalPrice;
        }
        return acc;
      }, 0);

      // 고른 옵션 축약
      const optionAbbr = selectedOptionValue.reduce(
        (acc, cur) => {
          const desc = cur.optionName;
          const name = cur.value;

          acc['fullName'] = acc['fullName'] ? `${acc['fullName']} / ${desc} : ${name}` : `${desc} : ${name}`;
          acc['name'] = acc['name'] ? `${acc['name']} / ${name}` : `${name}`;

          return acc;
        },
        { fullName: '', name: '' },
      );

      setSelectList((prev) => {
        if (prev.length) {
          // 중복 처리

          if (prev.find((lst) => lst.optionAbbr?.fullName === optionAbbr.fullName)) {
            alert('이미 추가 되었습니다 :)');
            return prev;
          }

          // 추가
          return [
            ...prev,
            {
              listId: Date.now(),
              optionAbbr,
              qty: 1,
              price: 1 * (price + totalAddition),
              options: selectedOptionValue,
            },
          ];
        } else {
          // 새롭게 생성
          return [
            {
              listId: Date.now(),
              optionAbbr,
              qty: 1,
              price: 1 * (price + totalAddition),
              options: selectedOptionValue,
            },
          ];
        }
      });
      setSelectedOptionValue([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptionValue]);

  useEffect(() => {
    const productOrder = [
      {
        type: OptionType.MULTI,
        productId: productId,
        productTitle: title,
        thumb: thumb,
        optionSelect: selectList,
        deliveryOption,
      },
    ];

    dispatch(setProductOrder(productOrder));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectList]);

  useEffect(() => {
    dispatch(setProductDeliveryOption(deliveryOption));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OrderOptionContainer>
      {options?.map((lst, index) => (
        <SelectBox
          disabled={index > 0 ? (selectedOptionValue[index - 1] ? false : true) : false}
          key={lst.optionId}
          data-optionid={lst.optionId}
          onClick={handleOptionSelectStart}
        >
          <div>{selectedOptionValue[index]?.value || lst.optionName}</div>
          <SelectList>
            {lst.optionValues.map((optionValue) =>
              lst.optionId === showOptionList ? (
                <li
                  onClick={handleOptionSelect}
                  key={optionValue.optionValueId}
                  data-stock={optionValue.stock}
                  data-additionalprice={optionValue.additionalPrice}
                  data-optionid={lst.optionId}
                  data-optionvalueid={optionValue.optionValueId}
                  data-optionname={lst.optionName}
                  data-value={optionValue.value}
                >
                  {optionValue.value}{' '}
                  {optionValue.additionalPrice ? `(+${optionValue.additionalPrice.toLocaleString()})` : ''}
                </li>
              ) : null,
            )}
          </SelectList>
          <span>
            <DownOutlined />
          </span>
        </SelectBox>
      ))}

      <ProductOrderDeliver deliveryOption={deliveryOption} />

      {selectList.length ? (
        <div>
          {selectList.map((item) => (
            <SelectItemList key={item.listId}>
              <SelecItemTitle>
                {item.optionAbbr.name}{' '}
                <span onClick={handleDelete} data-id={item.listId}>
                  <CloseCircleOutlined />
                </span>
              </SelecItemTitle>

              <SelectItemPriceSetting>
                <SelectItemQty>
                  <button onClick={handleCount} data-id={item.listId} data-type="-">
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button onClick={handleCount} data-id={item.listId} data-type="+">
                    +
                  </button>
                </SelectItemQty>
                <SelectItemPrice>{(item.qty * item.price).toLocaleString()}원</SelectItemPrice>
              </SelectItemPriceSetting>
            </SelectItemList>
          ))}
        </div>
      ) : (
        <EmptyTitle>선택하신 상품이 없어요 :) 얼른 담아주세요.</EmptyTitle>
      )}

      {selectList.length ? (
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
