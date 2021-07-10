import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';

const Logos = styled.div`
  font-size: 28px;
  cursor: pointer;
  span {
    font-family: serif;
    font-weight: bold;
  }
  span:nth-of-type(1) {
    color: #499edc;
  }
  span:nth-of-type(2) {
    font-family: serif;
    color: #f0af41;
  }
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    font-size: 24px;
  }
`;

const Logo = () => {
  const router = useRouter();

  const handlePushMainPage = useCallback(() => {
    router.push('/');
  }, [router]);

  return (
    <Logos onClick={handlePushMainPage}>
      <span>ㅇ</span>
      <span>ㄹ</span>
    </Logos>
  );
};

export default Logo;
