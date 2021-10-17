import styled from '@emotion/styled';
import React from 'react';
import { useAppSelector } from 'src/hooks/useRedux';
import { Btn } from '../common/Button';
import Link from 'next/link';
import MeLayouts from './MeLayouts';

const UserProfile = styled.div`
  padding: 0.5em;
`;

const UserEmpty = styled.div`
  width: 100%;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Me = () => {
  const { userData } = useAppSelector((state) => state.user);

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
        <div>{userData.email}</div>
        <div>{userData.username}</div>
        <div>{userData.phone}</div>
        <div>{userData.address?.address}</div>
      </UserProfile>
    </MeLayouts>
  );
};

export default Me;
