import React from 'react';
import styled from '@emotion/styled';
import { useExceptionRoute } from 'src/hooks/useExceptionRoute';
import Logo from './Logo';
import { APP_HEADER_HEIGHT } from 'src/constants';

const HeaderContainer = styled.header`
  width: 100%;
  height: ${APP_HEADER_HEIGHT}px;
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
        </>
      </Header>
    </HeaderContainer>
  );
};

export default AppHeader;
