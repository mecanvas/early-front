import styled from '@emotion/styled';
import { Divider } from 'antd';
import router from 'next/router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { APP_HEADER_HEIGHT } from 'src/constants';
import { useAppSelector } from 'src/hooks/useRedux';
import { setProductOrderInfo } from 'src/store/reducers/order';
import { TotalPrice } from '../product/ProductOrderMutiOptions';
import OrderProductList from './OrderProductList';

const Container = styled.div`
  background-color: ${({ theme }) => theme.color.gray000};
  padding-top: ${APP_HEADER_HEIGHT}px;
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

const ProductDelivery = styled.div`
  margin-top: 4em;
  padding: 0.5em 0;
`;

const DeliverySetting = styled.div`
  h5 {
    margin-bottom: 0.5em;
  }
  input {
    outline: none;
    border: 1px solid ${({ theme }) => theme.color.gray300};
    padding: 0.5em;
    margin-bottom: 0.5em;
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
      margin-bottom: 0.5em;
      padding: 0 1.5em;
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
    border: 1px solid ${({ theme }) => theme.color.gray300};
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

  const deliveryPrice = useMemo(() => {
    return deliveryOption.deliveryPrice;
  }, [deliveryOption]);

  const totalQty = useMemo(() => {
    return productOrder.reduce((acc, cur) => {
      if (acc) {
        acc += cur.qty;
        return acc;
      }
      return cur.qty;
    }, 0);
  }, [productOrder]);

  const totalPrice = useMemo(() => {
    return productOrder.reduce((acc, cur) => {
      if (acc) {
        acc += cur.price;
        return acc;
      }
      return +cur.price;
    }, 0);
  }, [productOrder]);

  const handlePayNow = useCallback(() => {
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
        <h2>- 주문 내역</h2>
        <Divider />
        <OrderProductList productOrder={productOrder} />

        <Divider />

        <TotalPrice>
          <span>
            총 상품 개수 <span>{totalQty}</span>개
          </span>
          <span>|</span>
          <span>{totalPrice.toLocaleString()}원</span>
        </TotalPrice>

        <ProductDelivery>
          <h2>- 배송 정보 입력</h2>
          <Divider />
          <DeliverySetting>
            <DeliveryReceiver>
              <h5>수령인 :</h5>
              <input type="text" placeholder="이름" onChange={handleDeliveryReceiver} />
            </DeliveryReceiver>
            <DeliveryAddress>
              <h5>주소 입력 :</h5>
              <div>
                <input
                  type="text"
                  placeholder="우편번호"
                  value={userData ? userData.address.postCode : productOrderInfo.address.postCode}
                />
                <button onClick={handleAddress}>찾기</button>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="주소"
                  value={userData ? userData.address.address : productOrderInfo.address.address}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="상세주소"
                  value={userData ? userData.address.addressDetail : productOrderInfo.address.addressDetail}
                  onChange={handleAddressDetail}
                />
              </div>
            </DeliveryAddress>

            <DeliveryPhone>
              <h5>연락처 :</h5>
              <div>
                <input
                  type="text"
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
              <h5>배송 메모 :</h5>
              <textarea placeholder="배송 메모를 입력하세요." onChange={handleDeliveryMemo} />
            </DeliveryMemo>
          </DeliverySetting>
        </ProductDelivery>

        <DeliveryOrderPay>
          <h2>- 결제 진행</h2>
          <Divider />
          <div>
            총 {(totalPrice + deliveryPrice).toLocaleString()}원에 대한 결제를 진행합니다.
            <div>
              <small>(배송비 {deliveryPrice.toLocaleString()}원)</small>
            </div>
          </div>
          <OrderPayButton>
            <button type="button" onClick={handlePayNow}>
              결제
            </button>
          </OrderPayButton>
        </DeliveryOrderPay>
      </OrderTable>
    </Container>
  );
};

export default OrderSheets;
