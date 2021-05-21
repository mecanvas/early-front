import React from 'react';
import styled from '@emotion/styled';

const FooterContainer = styled.footer`
  width: 100%;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
`;

const AppFooter = () => {
  return (
    <FooterContainer>
      <Footer>&copy; mecanvas 2021</Footer>
    </FooterContainer>
  );
};

export default AppFooter;
