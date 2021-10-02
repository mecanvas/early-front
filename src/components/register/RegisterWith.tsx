import styled from '@emotion/styled';
import { Divider } from 'antd';
import { useCallback, useState } from 'react';
import { APP_HEADER_HEIGHT } from 'src/constants';
import { emailReg, phoneReg } from 'src/constants/match';
import { Btn } from '../common/Button';
import EarlyInput from '../common/EarlyInput';
import TermsAgree from './TermsAgree';

const Container = styled.div`
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  width: 98%;
  padding-top: 5em;
  max-width: 500px;
  margin: 1em auto;
  min-height: calc(90vh - ${APP_HEADER_HEIGHT}px);

  h3 {
    padding-bottom: 1em;
    color: ${({ theme }) => theme.color.gray700};
  }
`;

const RegisterForm = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

const RegisterInput = styled.div`
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
    font-size: 14px;
    width: 93%;
    margin-left: 0.5em;
    border-radius: 8px;

    @media all and (max-width: ${({ theme }) => theme.size.xs}) {
      margin: 0 auto;
    }
  }
`;

const FinishForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1em;
`;

interface Register {
  [key: string]: string;
  id: string;
  password: string;
  password2: string;
  phone: string;
  email: string;
}

type RegisterFormVaild = 'id' | 'password' | 'password2' | 'phone' | 'email';

const RegisterWith = () => {
  const [form, setForm] = useState<Register>({ id: '', password: '', password2: '', phone: '', email: '' });
  const [isTrySubmit, setIsTrySubmit] = useState(false);

  const checkRule = useCallback(
    (name: string, reg: RegExp, message: string) => {
      if (!isTrySubmit) {
        return '';
      }

      if (form[name]) {
        const item = form[name];

        if (!item.match(reg)) {
          return message;
        }
      }
    },
    [form, isTrySubmit],
  );

  const emailRuleMessage = checkRule('email', emailReg, '올바른 이메일로 입력 부탁드립니다.');

  const phoneRuleMessage = checkRule('phone', phoneReg, '-가 없는 올바른 번호를 입력해 주세요.');

  const checkValidation = useCallback(
    (name: RegisterFormVaild) => {
      if (isTrySubmit) {
        const pass = form[name] !== '';
        if (pass) {
          return 'pass';
        }
        if (!pass) {
          return 'fail';
        }
      } else {
        return 'pass';
      }
    },
    [form, isTrySubmit],
  );

  const handleRegisterForm = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleRegisterSubmit = useCallback(() => {
    setIsTrySubmit(true);
  }, []);

  return (
    <Container>
      <h3>회원가입</h3>

      <div>
        <RegisterForm onChange={handleRegisterForm}>
          <RegisterInput>
            {/* <input autoComplete="off" type="text" placeholder="아이디" /> */}
            <EarlyInput name="id" isRequire valid={checkValidation('id')} placeholder="아이디" />
          </RegisterInput>

          <RegisterInput>
            <EarlyInput
              name="password"
              type="password"
              isRequire
              valid={checkValidation('password')}
              placeholder="비밀번호"
            />
            {/* <input autoComplete="off" type="text" placeholder="비밀번호" /> */}
          </RegisterInput>

          <RegisterInput>
            <EarlyInput
              name="password2"
              type="password"
              isRequire
              valid={checkValidation('password2')}
              placeholder="비밀번호확인"
            />
            {/* <input autoComplete="off" type="text" placeholder="비밀번호 확인" /> */}
          </RegisterInput>

          <RegisterInput>
            <EarlyInput
              name="phone"
              type="tel"
              ruleMessage={phoneRuleMessage}
              isRequire
              valid={checkValidation('phone')}
              placeholder="연락처"
            />
          </RegisterInput>

          <RegisterInput>
            <EarlyInput
              name="email"
              type="email"
              ruleMessage={emailRuleMessage}
              isRequire
              valid={checkValidation('email')}
              placeholder="이메일"
            />

            {/* <input autoComplete="off" type="text" placeholder="이메일" /> */}
          </RegisterInput>
        </RegisterForm>
      </div>

      <div>
        <TermsAgree />
      </div>

      <Divider />

      <FinishForm>
        <Btn type="submit" onClick={handleRegisterSubmit}>
          가입
        </Btn>
      </FinishForm>
    </Container>
  );
};

export default RegisterWith;
