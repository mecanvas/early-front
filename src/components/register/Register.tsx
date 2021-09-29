import React from 'react';
import styled from '@emotion/styled';
import { APP_HEADER_HEIGHT } from 'src/constants';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(90vh - ${APP_HEADER_HEIGHT}px);

  h4 {
    margin: 1em 0;
    color: ${({ theme }) => theme.color.gray700};
  }
`;

const Register = () => {
  return (
    <Container>
      <h2>회원가입</h2>
    </Container>
  );
};

export default Register;
