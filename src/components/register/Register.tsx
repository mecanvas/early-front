import React, { useCallback, useState } from 'react';
import styled from '@emotion/styled';
import { Btn } from '../common/Button';
import { Divide } from '../common/Divide';
import RegisterWith from './RegisterIdPw';
import { APP_HEADER_HEIGHT } from 'src/constants';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 98%;
  max-width: 800px;
  margin: 1em auto;
  min-height: calc(80vh - ${APP_HEADER_HEIGHT}px);

  h4 {
    margin: 1em auto;
    color: ${({ theme }) => theme.color.gray700};
  }
`;

const SocialRegister = styled.div`
  display: flex;
  flex-direction: column;
  & > div {
    display: flex;
    justify-content: center;

    div {
      margin: 0 0.3em;
    }
  }
`;

const DivideWrapper = styled.div`
  margin: 0 auto;
`;

const Register = () => {
  const [idPwRegister, setIdPwRegister] = useState(false);
  const [socialRegister, setSocialRegister] = useState(false);

  const handleNaverRegister = useCallback(() => {
    setSocialRegister(true);
  }, []);

  const handleKakaoRegister = useCallback(() => {
    setSocialRegister(true);
  }, []);

  const handleIdPwRegister = useCallback(() => {
    setIdPwRegister(true);
  }, []);

  return (
    <Container>
      {!idPwRegister && !socialRegister ? (
        <>
          <SocialRegister>
            <h4>간편 회원가입</h4>
            <div>
              <div onClick={handleNaverRegister}>
                <Btn>네이버</Btn>
              </div>
              <div onClick={handleKakaoRegister}>
                <Btn>카카오</Btn>
              </div>
            </div>
          </SocialRegister>

          <DivideWrapper>
            <Divide />
          </DivideWrapper>

          <SocialRegister>
            <h4>ID, PW 회원가입</h4>
            <div onClick={handleIdPwRegister}>
              <Btn>회원가입</Btn>
            </div>
          </SocialRegister>
        </>
      ) : null}

      {idPwRegister && <RegisterWith />}
      {socialRegister && <RegisterWith />}
    </Container>
  );
};

export default Register;
