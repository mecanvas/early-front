import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { Button } from 'antd';

const HeaderContainer = styled.header`
  width: 100%;
  height: 50px;
  background-color: ${({ theme }) => theme.color.white};
`;

const Header = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0 40px;
`;

const AppHeader = () => {
  const router = useRouter();

  const handlePushCustomPage = useCallback(() => {
    router.push('/tool');
  }, [router]);

  if (router.asPath === '/tool') {
    return null;
  }

  return (
    <HeaderContainer>
      <Header>
        <>
          <h4>MeCanvas</h4>
          <Button type="primary" onClick={handlePushCustomPage}>
            Canvas
          </Button>
        </>
      </Header>
    </HeaderContainer>
  );
};

export default AppHeader;
