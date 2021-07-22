import React from 'react';
import styled from '@emotion/styled';
import { Button } from 'antd';
import { useExceptionRoute } from 'src/hooks/useExceptionRoute';
import Logo from './Logo';
import Link from 'next/link';

const HeaderContainer = styled.header`
  width: 100%;
  height: 60px;
  padding: 0 2em;
  background-color: ${({ theme }) => theme.color.white};
  border-bottom: 1px solid ${({ theme }) => theme.color.gray200};
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

  if (exceptionRoute) {
    return null;
  }

  return (
    <HeaderContainer>
      <Header>
        <>
          <Logo />
          <div>
            <Link href="/tool">
              <Button type="default">시안 제작</Button>
            </Link>
          </div>
        </>
      </Header>
    </HeaderContainer>
  );
};

export default AppHeader;
