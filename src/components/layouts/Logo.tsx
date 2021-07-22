import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { icons } from 'public/icons';

const Logos = styled.div`
  width: 28px;
  cursor: pointer;

  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    width: 22px;
  }

  img {
    width: 100%;
  }
`;

const Logo = () => {
  const router = useRouter();

  const handlePushMainPage = useCallback(() => {
    router.push('/tool');
  }, [router]);

  return (
    <Logos onClick={handlePushMainPage}>
      <img src={icons.home} alt="로고 샘플" />
    </Logos>
  );
};

export default Logo;
