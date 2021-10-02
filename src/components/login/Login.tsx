import React, { useCallback, useEffect, useState } from 'react';
import { APP_HEADER_HEIGHT } from 'src/constants';
import styled from '@emotion/styled';
import { Btn } from '../common/Button';
import Link from 'next/link';
import { Divide } from '../common/Divide';
import EarlyInput from '../common/EarlyInput';
import { useDispatch } from 'react-redux';
import { getUser, UserData } from 'src/store/reducers/user';
import { useAppSelector } from 'src/hooks/useRedux';
import router from 'next/router';

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

const LoginForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;

  button {
    margin-top: 0.8em;
  }
`;

const LoginInput = styled.div`
  text-align: center;
  align-items: center;
  display: flex;
  margin-bottom: 1em;
  max-width: 350px;
  width: 100%;

  @media all and (max-width: ${({ theme }) => theme.size.xs}) {
    flex-direction: column;
    align-items: flex-start;
  }

  input {
    border: 1px solid ${({ theme }) => theme.color.gray300};
    padding: 0.5em 1.5em;
    width: 93%;
    margin-left: 0.5em;
    border-radius: 8px;

    @media all and (max-width: ${({ theme }) => theme.size.xs}) {
      margin: 0 auto;
    }
  }
`;

const SocialLoginContainer = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 0.5em;
  padding: 1em;
`;

const SocialLogin = styled.div`
  display: flex;
  width: 100%;
  max-width: 150px;
  justify-content: center;

  img {
    cursor: pointer;
    width: 30px;
    margin: 0 0.3em;
  }
`;

const Register = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;

  button {
    font-size: 1rem;
    width: 200px;
    background-color: ${({ theme }) => theme.color.white};
    border: 1px solid ${({ theme }) => theme.color.black};
    color: ${({ theme }) => theme.color.gray700};
  }
`;

interface LoginProps {
  id: '';
  password: '';
}

const Login = () => {
  const [form, setForm] = useState<LoginProps>({ id: '', password: '' });
  const dispatch = useDispatch();
  const { userData } = useAppSelector((state) => state.user);

  const handleLoginChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleLogin = useCallback(
    (e) => {
      e.preventDefault();
      const mockUser: UserData = {
        id: 1,
        email: 'earlystudio21@gmail.com',
        role: 0,
        username: '얼리21',
        phone: '01026299315',
        address: null,
      };
      dispatch(getUser(mockUser));
    },
    [dispatch],
  );

  useEffect(() => {
    if (userData) {
      router.push('/');
    }
  }, [userData]);

  return (
    <Container>
      <LoginForm onChange={handleLoginChange} onSubmit={handleLogin}>
        <LoginInput>
          <EarlyInput name="id" placeholder="아이디" />
        </LoginInput>
        <LoginInput>
          <EarlyInput name="password" type="password" placeholder="비밀번호" />
        </LoginInput>

        <Btn type="submit">로그인</Btn>
        <SocialLoginContainer>
          <SocialLogin>
            <div>
              <img src="https://t1.daumcdn.net/cfile/tistory/994331335F52047D05" alt="네이버 로그인 버튼" />
            </div>
            <div>
              <img
                src="https://mblogthumb-phinf.pstatic.net/MjAxODAyMDJfMjUw/MDAxNTE3NTAyODA4ODAy.gGCquKwzKIMUn0jDY28suXT4q3dTFflS9ykUhR2LfkQg.qmy4EOJZcXoHwmA-sK5jF7eoZxC6O3YiGaaQHAvbexQg.PNG.marketstory24/%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%86%A1_%EB%A1%9C%EA%B3%A0_2.png?type=w800"
                alt="카카오 로그인 버튼"
              />
            </div>
          </SocialLogin>
        </SocialLoginContainer>
      </LoginForm>

      <Divide />

      <Register>
        <Link href="/register">
          <Btn>1분만에 회원가입하기</Btn>
        </Link>
      </Register>

      {/* <div>
        <p>까먹으셨다면</p>
        <div>아이디 찾기</div>
      </div> */}
    </Container>
  );
};

export default Login;
