import styled from '@emotion/styled';
import React, { useCallback, useState } from 'react';
import { useAppSelector } from 'src/hooks/useRedux';
import { Btn } from '../common/Button';
import Link from 'next/link';
import MeLayouts from './MeLayouts';
import { Button, Form, Input } from 'antd';
import { Address } from 'src/interfaces/OrderInterface';

const UserProfile = styled.div`
  h4 {
    margin-bottom: 1em;
  }
  padding: 0.5em;
  padding-top: 1em;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const UserEmpty = styled.div`
  width: 100%;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const UserForm = styled(Form)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const UserFormItem = styled(Form.Item)`
  width: 100%;
  padding: 0 0.5em;
`;

const UserAddress = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 0 0.5em;

  div {
    display: flex;
    margin-bottom: 0.6em;
  }
`;

const UserAddressPostCode = styled(Input)`
  max-width: 300px;
`;

const Me = () => {
  const { userData } = useAppSelector((state) => state.user);
  const [addressData, setAddressData] = useState<Address | null>(userData?.address || null);

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
            setAddressData(userAddr);
          } else {
            const address = data.jibunAddress + extraRoadAddr;
            const userAddr = {
              postCode: data.zonecode,
              address,
              sido: data.sido,
              sigungu: data.sigungu,
              addressDetail: '',
            };
            setAddressData(userAddr);
          }
        },
      }).open();
    }
  }, []);

  const handleAddressDetail = useCallback(({ target: { value } }) => {
    setAddressData((prev) => {
      if (prev) {
        return { ...prev, addressDetail: value };
      }
      return prev;
    });
  }, []);

  if (!userData) {
    return (
      <UserEmpty>
        <h2>로그인 부탁드립니다 :)</h2>
        <Link href="/login">
          <Btn>로그인 하기</Btn>
        </Link>
      </UserEmpty>
    );
  }

  return (
    <MeLayouts>
      <UserProfile>
        <h4>개인정보</h4>
        <UserForm>
          <UserFormItem label="이메일" labelAlign="left" labelCol={{ span: 2 }}>
            <Input readOnly defaultValue={userData.email} />
          </UserFormItem>
          <UserFormItem labelAlign="left" labelCol={{ span: 2 }} label="이름">
            <Input readOnly defaultValue={userData.username} />
          </UserFormItem>
          <UserFormItem labelAlign="left" labelCol={{ span: 2 }} label="연락처">
            <Input readOnly defaultValue={userData.phone} />
          </UserFormItem>

          <UserAddress>
            <h4>기본 주소</h4>
            <div>
              <UserAddressPostCode type="text" required value={addressData?.postCode} placeholder="우편번호" />
              <Button onClick={handleAddress}>변경</Button>
            </div>
            <div>
              <Input type="text" placeholder="주소" required value={addressData?.address} />
            </div>
            <div>
              <Input
                type="text"
                placeholder="상세주소"
                required
                onChange={handleAddressDetail}
                value={addressData?.addressDetail}
                defaultValue={addressData?.addressDetail}
              />
            </div>
          </UserAddress>

          <Btn type="submit" width={100} padding={'.5em'}>
            저장
          </Btn>
        </UserForm>
      </UserProfile>
    </MeLayouts>
  );
};

export default Me;
