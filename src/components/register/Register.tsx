import React, { useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Btn } from '../common/Button';
import { Divide } from '../common/Divide';
import RegisterWith from './RegisterIdPw';
import { APP_HEADER_HEIGHT } from 'src/constants';
import Link from 'next/link';
import router from 'next/router';

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

enum RegisterType {
  IDPW = '1',
  KAKAO = '2',
  NAVER = '3',
}

const Register = () => {
  const { query } = router;
  const [idPwRegister, setIdPwRegister] = useState(false);
  const [socialRegister, setSocialRegister] = useState(false);

  const handleNaverRegister = useCallback(() => {
    setSocialRegister(true);
  }, []);

  const handleKakaoRegister = useCallback(() => {
    setSocialRegister(true);
  }, []);

  useEffect(() => {
    if (query['type']) {
      if (query['type'] === RegisterType.IDPW) {
        setIdPwRegister(true);
      }
      if (query['type'] === RegisterType.KAKAO) {
        setSocialRegister(true);
      }
      if (query['type'] === RegisterType.NAVER) {
        setSocialRegister(true);
      }
    } else {
      setIdPwRegister(false);
      setSocialRegister(false);
    }
  }, [query]);

  return (
    <Container>
      {!idPwRegister && !socialRegister ? (
        <>
          <SocialRegister>
            <h4>간편 회원가입</h4>
            <div>
              <div onClick={handleNaverRegister}>
                <Link href={`/register?type=${RegisterType.NAVER}`}>
                  <Btn>네이버</Btn>
                </Link>
              </div>
              <div onClick={handleKakaoRegister}>
                <Link href={`/register?type=${RegisterType.KAKAO}`}>
                  <Btn>카카오</Btn>
                </Link>
              </div>
            </div>
          </SocialRegister>

          <DivideWrapper>
            <Divide />
          </DivideWrapper>

          <SocialRegister>
            <h4>ID, PW 회원가입</h4>
            <div>
              <Link href={`/register?type=${RegisterType.IDPW}`}>
                <Btn>회원가입</Btn>
              </Link>
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
