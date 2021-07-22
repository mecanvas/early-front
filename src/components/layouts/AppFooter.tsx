import React from 'react';
import styled from '@emotion/styled';
import { useExceptionRoute } from 'src/hooks/useExceptionRoute';

const FooterContainer = styled.footer`
  width: 100%;
  padding: 2em;
  border-top: 1px solid ${({ theme }) => theme.color.gray100};
  background-color: ${({ theme }) => theme.color.white};
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
`;

const AppFooter = () => {
  const { exceptionRoute } = useExceptionRoute();

  if (exceptionRoute) {
    return null;
  }

  return (
    <FooterContainer>
      <Footer>&copy; EarlyStudio21</Footer>
    </FooterContainer>
  );
};

export default AppFooter;
