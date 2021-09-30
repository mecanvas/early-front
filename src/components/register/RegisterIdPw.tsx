import styled from '@emotion/styled';
import { Divider, Checkbox } from 'antd';
import React, { useState, useCallback } from 'react';
import { APP_HEADER_HEIGHT } from 'src/constants';
import { Btn } from '../common/Button';
import { Divide } from '../common/Divide';
import TermsAgree from './TermsAgree';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 98%;
  padding-top: 5em;
  max-width: 800px;
  margin: 1em auto;
  min-height: calc(90vh - ${APP_HEADER_HEIGHT}px);

  h4 {
    margin: 1em auto;
    color: ${({ theme }) => theme.color.gray700};
  }
`;

const RegisterForm = styled.form`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`;

const RegisterInput = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 1em;
  max-width: 350px;
  width: 100%;

  @media all and (max-width: ${({ theme }) => theme.size.xs}) {
    flex-direction: column;
    align-items: flex-start;
  }

  label {
    font-size: 13px;
    text-align: left;
    width: 60px;
    @media all and (max-width: ${({ theme }) => theme.size.xs}) {
      margin-left: 0.6em;
      margin-bottom: 0.7em;
    }
  }

  input {
    border: 1px solid ${({ theme }) => theme.color.gray300};
    padding: 0.5em 1.5em;
    width: 93%;
    margin-left: 0.5em;
    border-radius: 8px;

    @media all and (max-width: ${({ theme }) => theme.size.xs}) {
      margin: 0 auto;
    }
  }
`;

const AddressForm = styled.div`
  margin: 1.5em 0;
`;

const DeliveryAddress = styled.div`
  input {
    outline: none;
    border: 1px solid ${({ theme }) => theme.color.gray300};
    padding: 0.5em;
    margin-bottom: 0.5em;
    width: 100%;
  }
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
`;

const FinishForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1em;
`;

declare const daum: any;

const RegisterWith = () => {
  const [address, setAddress] = useState({
    postCode: '',
    address: '',
    sido: '',
    sigungu: '',
    addressDetail: '',
  });

  const handleAddressDetail = useCallback((e) => {
    setAddress((prev) => ({ ...prev, addressDetail: e.target.value }));
  }, []);

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
            setAddress(userAddr);
          } else {
            const address = data.jibunAddress + extraRoadAddr;
            const userAddr = {
              postCode: data.zonecode,
              address,
              sido: data.sido,
              sigungu: data.sigungu,
              addressDetail: '',
            };
            setAddress(userAddr);
          }
        },
      }).open();
    }
  }, []);

  return (
    <Container>
      <h2>회원가입</h2>

      <Divider />

      {/* 이용약관 */}
      <TermsAgree />

      <Divider />

      <div>
        <h4>정보 입력</h4>
        <RegisterForm>
          <RegisterInput>
            <label>아이디</label>
            <input autoComplete="off" type="text" placeholder="아이디" />
          </RegisterInput>

          <RegisterInput>
            <label>비밀번호</label>
            <input autoComplete="off" type="text" placeholder="비밀번호" />
          </RegisterInput>

          <RegisterInput>
            <label>확인</label>
            <input autoComplete="off" type="text" placeholder="비밀번호 확인" />
          </RegisterInput>

          <RegisterInput>
            <label>연락처</label>
            <input autoComplete="off" type="text" placeholder="연락처" />
          </RegisterInput>

          <RegisterInput>
            <label>이메일</label>
            <input autoComplete="off" type="text" placeholder="이메일" />
          </RegisterInput>

          <div>
            <Checkbox>마케팅 메일을 수신하시나요?</Checkbox>
          </div>

          <AddressForm>
            <h4>주소 입력</h4>
            <DeliveryAddress>
              <div>
                <input autoComplete="off" type="text" placeholder="우편번호" defaultValue={address.postCode} />
                <button type="button" onClick={handleAddress}>
                  찾기
                </button>
              </div>
              <div>
                <input autoComplete="off" type="text" placeholder="주소" defaultValue={address.address} />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="상세주소"
                  autoComplete="off"
                  defaultValue={address.addressDetail}
                  onChange={handleAddressDetail}
                />
              </div>
            </DeliveryAddress>
          </AddressForm>
        </RegisterForm>
      </div>

      <div>
        <h4>어떻게 오셨나요?</h4>

        <div>
          <Checkbox>광고</Checkbox>
          <Checkbox>검색</Checkbox>
          <Checkbox>블로그</Checkbox>
          <Checkbox>유튜브</Checkbox>
          <Checkbox>기타</Checkbox>
        </div>
      </div>

      <FinishForm>
        <Divide />
        <Btn type="button">가입</Btn>
      </FinishForm>
    </Container>
  );
};

export default RegisterWith;
