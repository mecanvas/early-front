import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';

const HeaderContainer = styled.header`
  width: 100%;
  height: 50px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  button {
    padding: 12px;
    background-color: blue;
    color: white;
  }
`;

const AppHeader = () => {
  const router = useRouter();

  const handlePushCustomPage = useCallback(() => {
    router.push('/tool');
  }, [router]);

  return (
    <HeaderContainer>
      <Header>
        <button type="button" onClick={handlePushCustomPage}>
          뭔가 캔버스를 만들수 있을거 같은 버튼
        </button>
      </Header>
    </HeaderContainer>
  );
};

export default AppHeader;
