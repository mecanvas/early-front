import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { Button } from 'antd';
import { useExceptionRoute } from 'src/hooks/useExceptionRoute';
import Logo from './Logo';

const HeaderContainer = styled.header`
  width: 100%;
  height: 64px;
  padding: 0 3em;
  background-color: ${({ theme }) => theme.color.white};
`;

const Header = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;

  button {
    margin-left: 3px;
  }
`;

const AppHeader = () => {
  const { exceptionRoute } = useExceptionRoute();
  const router = useRouter();

  const handlePushCustomPage = useCallback(
    (e) => {
      const { key } = e.currentTarget.dataset;
      router.push(`/tool/${key}`);
    },
    [router],
  );

  if (exceptionRoute) {
    return null;
  }

  return (
    <HeaderContainer>
      <Header>
        <>
          <Logo />
          <div>
            <Button type="primary" data-key="single" onClick={handlePushCustomPage}>
              단일
            </Button>
            <Button type="primary" data-key="divided" onClick={handlePushCustomPage}>
              분할
            </Button>
          </div>
        </>
      </Header>
    </HeaderContainer>
  );
};

export default AppHeader;
