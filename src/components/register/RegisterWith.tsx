import styled from '@emotion/styled';
import { Divider } from 'antd';
import { APP_HEADER_HEIGHT } from 'src/constants';
import { Btn } from '../common/Button';
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

const RegisterWith = () => {
  return (
    <Container>
      <h3>회원가입</h3>

      <div>
        <RegisterForm>
          <RegisterInput>
            <input autoComplete="off" type="text" placeholder="아이디" />
          </RegisterInput>

          <RegisterInput>
            <input autoComplete="off" type="text" placeholder="비밀번호" />
          </RegisterInput>

          <RegisterInput>
            <input autoComplete="off" type="text" placeholder="비밀번호 확인" />
          </RegisterInput>

          <RegisterInput>
            <input autoComplete="off" type="text" placeholder="연락처" />
          </RegisterInput>

          <RegisterInput>
            <input autoComplete="off" type="text" placeholder="이메일" />
          </RegisterInput>
        </RegisterForm>
      </div>

      <div>
        <TermsAgree />
      </div>

      <Divider />

      <FinishForm>
        <Btn type="button">가입</Btn>
      </FinishForm>
    </Container>
  );
};

export default RegisterWith;
