import styled from '@emotion/styled';
import { Divider } from 'antd';
import router from 'next/router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from 'src/hooks/useRedux';
import { OptionType } from 'src/interfaces/ProductInterface';
import { setProductOrderInfo } from 'src/store/reducers/order';
import { checkDeliverLimit } from 'src/utils/checkDeliverLimit';
import { TotalPrice } from '../product/ProductOrderMutiOptions';
import OrderProductList from './OrderProductList';

const Container = styled.div`
  background-color: ${({ theme }) => theme.color.gray000};
  padding-top: 2em;
  min-height: 100vh;
  padding-bottom: 2em;
  h3 {
    color: ${({ theme }) => theme.color.gray700};
  }
`;

const OrderTable = styled.div`
  box-shadow: 0 0px 2px ${({ theme }) => theme.color.gray300};
  width: 100%;
  max-width: 800px;
  padding: 2em;
  margin: 2em auto;
  background-color: ${({ theme }) => theme.color.white};
  min-height: 100vh;
`;

const ProductDeliveryForm = styled.form`
  margin-top: 4em;
  padding: 0.5em 0;
`;

const DeliverySetting = styled.div`
  h5 {
    margin-bottom: 0.5em;
  }
  input {
    outline: none;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.color.gray200};
    padding: 0.5em;
    margin-bottom: 0.5em;
    font-size: 0.9rem;
  }
`;

const DeliveryReceiver = styled.div``;

const DeliveryAddress = styled.div`
  margin-top: 2em;

  /* 우편번호 */
  div:nth-of-type(1) {
    display: flex;
    input {
      width: 120px;
      margin-right: 2px;
    }
    button {
      font-size: 0.9rem;
      border-radius: 4px;
      margin-bottom: 0.5em;
      padding: 0 1em;
      border: 1px solid ${({ theme }) => theme.color.gray300};
      &:hover {
        opacity: 0.5;
      }
    }
  }

  input {
    width: 100%;
  }
`;

const DeliveryPhone = styled.div`
  margin-top: 2em;
`;

const DeliveryMemo = styled.div`
  margin-top: 2em;

  textarea {
    border: 1px solid ${({ theme }) => theme.color.gray200};
    border-radius: 4px;
    font-size: 0.9rem;
    width: 90%;
    height: 100px;
    outline: none;
    padding: 0.5em;
  }
`;

const DeliveryOrderPay = styled.div`
  margin-top: 4em;
  padding: 0.5em 0;

  div {
    text-align: center;
  }
`;
const TotalPayDesc = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 1em;
  padding: 1em;
  div {
    font-size: 1.1rem;
    &:nth-of-type(2) {
      margin: 0 2em;
      font-size: 1.5rem;
    }
  }
`;

const TotalPay = styled.span`
  font-weight: bold;
  font-size: 1.1rem;
`;

const OrderPayButton = styled.div`
  button {
    border-radius: 4px;
    font-weight: bold;
    font-size: 1.2rem;
    background: ${({ theme }) => theme.color.black};
    color: ${({ theme }) => theme.color.white};
    margin-top: 2em;
    padding: 0.5em 2em;
    cursor: pointer;
  }
`;

declare const daum: any;

const OrderSheets = () => {
  const dispatch = useDispatch();
  const { userData } = useAppSelector((state) => state.user);
  const { productOrder, deliveryOption, productOrderInfo } = useAppSelector((state) => state.order);

  const handleDeliveryMemo = useCallback(
    (e) => {
      dispatch(setProductOrderInfo({ ...productOrderInfo, memo: e.target.value }));
    },
    [dispatch, productOrderInfo],
  );

  const handleDeliveryReceiver = useCallback(
    (e) => {
      dispatch(setProductOrderInfo({ ...productOrderInfo, receiver: e.target.value }));
    },
    [dispatch, productOrderInfo],
  );

  const handlePhoneNum = useCallback(
    (e) => {
      const { name, value } = e.target;
      dispatch(setProductOrderInfo({ ...productOrderInfo, [name]: value }));
    },
    [dispatch, productOrderInfo],
  );

  const handleAddressDetail = useCallback(
    (e) => {
      dispatch(
        setProductOrderInfo({
          ...productOrderInfo,
          address: { ...productOrderInfo.address, addressDetail: e.target.value },
        }),
      );
    },
    [dispatch, productOrderInfo],
  );

  const handleAddress = useCallback(() => {
    if (process.browser) {
      new daum.Postcode({
        oncomplete: (data: any) => {
          let extraRoadAddr = '';
          //   도로명 선택시,
          //   https://postcode.map.daum.net/guide 기본 설저 참고
          if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
            extraRoadAddr += data.bname;
          }
          // 건물명이 있고, 공동주택일 경우 추가한다.
          if (data.buildingName !== '' && data.apartment === 'Y') {
            extraRoadAddr += extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName;
          }
          // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
          if (extraRoadAddr !== '') {
            extraRoadAddr = ' (' + extraRoadAddr + ')';
          }

          if (data.userSelectedType === 'R') {
            const address = data.roadAddress + extraRoadAddr;
            const userAddr = {
              postCode: data.zonecode,
              address,
              sido: data.sido,
              sigungu: data.sigungu,
              addressDetail: '',
            };
            dispatch(
              setProductOrderInfo({ ...productOrderInfo, address: { ...productOrderInfo.address, ...userAddr } }),
            );
          } else {
            const address = data.jibunAddress + extraRoadAddr;
            const userAddr = {
              postCode: data.zonecode,
              address,
              sido: data.sido,
              sigungu: data.sigungu,
              addressDetail: '',
            };
            dispatch(
              setProductOrderInfo({ ...productOrderInfo, address: { ...productOrderInfo.address, ...userAddr } }),
            );
          }
        },
      }).open();
    }
  }, [dispatch, productOrderInfo]);

  const totalQty = useMemo(() => {
    let qty = 0;
    productOrder.forEach((order) => {
      if (order.type === OptionType.MULTI) {
        qty += order.optionSelect?.length || 0;
      } else {
        qty += 1;
      }
    });
    return qty;
  }, [productOrder]);

  const totalPrice = useMemo(() => {
    let price = 0;
    productOrder.forEach((order) => {
      if (order.type == OptionType.MULTI) {
        price +=
          order.optionSelect?.reduce((acc, cur) => {
            if (acc) {
              acc += cur.qty * cur.price;
              return acc;
            }
            return cur.qty * cur.price;
          }, 0) || 0;
      } else {
        price += (order.qty || 0) * (order.price || 0);
      }
    });

    return price;
  }, [productOrder]);

  const deliveryPrice = useMemo(() => {
    if (checkDeliverLimit(totalPrice, deliveryOption.limit)) {
      return 0;
    }
    return deliveryOption.deliveryPrice;
  }, [deliveryOption.deliveryPrice, deliveryOption.limit, totalPrice]);

  const handlePayNow = useCallback((e) => {
    e.preventDefault();
    router.push('/pay?status=1');
  }, []);

  useEffect(() => {
    if (!productOrder.length) {
      router.back();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(setProductOrderInfo({ ...productOrderInfo, productOrder }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Container>
      <OrderTable>
        <h2>주문 내역</h2>
        <Divider />
        <OrderProductList productOrder={productOrder} />

        <TotalPrice>
          <span>
            총 결제 개수 <span>{totalQty}</span>개
          </span>
          <span>|</span>
          <span>{totalPrice?.toLocaleString()}원</span>
          {deliveryOption.limit > totalPrice ? (
            <div>
              {deliveryOption.deliveryPrice ? `(배송비 ${deliveryOption.deliveryPrice.toLocaleString()}원 포함)` : ``}
            </div>
          ) : (
            <></>
          )}
        </TotalPrice>

        <ProductDeliveryForm onSubmit={handlePayNow}>
          <h2>배송 정보 입력</h2>
          <Divider />
          <DeliverySetting>
            <DeliveryReceiver>
              <h5>수령인 정보</h5>
              <input type="text" required placeholder="이름" onChange={handleDeliveryReceiver} />
            </DeliveryReceiver>
            <DeliveryAddress>
              <h5>주소 입력</h5>
              <div>
                <input
                  type="text"
                  required
                  placeholder="우편번호"
                  value={userData ? userData.address?.postCode : productOrderInfo.address.postCode}
                />
                <button onClick={handleAddress}>찾기</button>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="주소"
                  required
                  value={userData ? userData.address?.address : productOrderInfo.address.address}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="상세주소"
                  required
                  value={userData ? userData.address?.addressDetail : productOrderInfo.address.addressDetail}
                  onChange={handleAddressDetail}
                />
              </div>
            </DeliveryAddress>

            <DeliveryPhone>
              <h5>연락처</h5>
              <div>
                <input
                  type="text"
                  required
                  placeholder="연락처 1"
                  name="phone"
                  value={userData ? userData.phone : productOrderInfo.phone}
                  onChange={handlePhoneNum}
                />
              </div>
              <div>
                <input type="text" placeholder="연락처 2" name="phone2" onChange={handlePhoneNum} />
              </div>
            </DeliveryPhone>

            <DeliveryMemo>
              <h5>배송 메모</h5>
              <textarea placeholder="배송 메모를 입력하세요." onChange={handleDeliveryMemo} />
            </DeliveryMemo>
          </DeliverySetting>
          <DeliveryOrderPay>
            <h2>결제 진행</h2>
            <Divider />
            <div>
              <TotalPayDesc>
                <div>{(totalPrice - deliveryPrice).toLocaleString()}원</div>
                <div>+</div>
                <div>{deliveryPrice ? `${deliveryPrice.toLocaleString()}원` : '무료배송'}</div>
              </TotalPayDesc>
              <TotalPay>총 {totalPrice.toLocaleString()}원</TotalPay>에 대한 결제를 진행합니다.
              {deliveryPrice ? (
                <div>
                  <small>(배송비 {deliveryPrice.toLocaleString()}원 포함)</small>
                </div>
              ) : (
                <></>
              )}
            </div>
            <OrderPayButton>
              <button type="submit">결제</button>
            </OrderPayButton>
          </DeliveryOrderPay>
        </ProductDeliveryForm>
      </OrderTable>
    </Container>
  );
};

export default OrderSheets;
