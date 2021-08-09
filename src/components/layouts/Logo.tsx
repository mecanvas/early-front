import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { UtilityImg } from 'public/utils';

const Logos = styled.div`
  width: 5.5em;
  cursor: pointer;

  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    width: 4.5em;
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
      <img src={UtilityImg.early21Logo} alt="샘플용 필기체 로고" />
    </Logos>
  );
};

export default Logo;
