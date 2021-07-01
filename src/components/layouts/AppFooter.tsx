import React from 'react';
import styled from '@emotion/styled';
import { useExceptionRoute } from 'src/hooks/useExceptionRoute';

const FooterContainer = styled.footer`
  width: 100%;
  padding: 40px;
  background-color: ${({ theme }) => theme.color.secondarybg};
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
      <Footer>&copy; mecanvas 2021</Footer>
    </FooterContainer>
  );
};

export default AppFooter;
