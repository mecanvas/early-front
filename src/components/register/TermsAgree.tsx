import styled from '@emotion/styled';
import { Checkbox } from 'antd';
import React from 'react';

const TermsContainer = styled.div`
  width: 100%;
  width: 200px;
  margin: 0.5em auto;
  text-align: left;
`;

const CheckText = styled.span`
  margin-left: 0.5em;
  font-size: 0.95rem;
  a {
    font-size: 0.95rem;
  }
`;

const TermsAgree = () => {
  return (
    <>
      <TermsContainer>
        <div>
          <Checkbox />
          <CheckText>
            <a target="blank" href="/register/terms2">
              이용약관
            </a>
            에 동의합니다.
          </CheckText>
        </div>
      </TermsContainer>
      {/* 개인정보수집동의 */}

      <TermsContainer>
        <div>
          <Checkbox />
          <CheckText>
            <a target="blank" href="/register/terms">
              개인정보 수집
            </a>
            에 동의합니다.
          </CheckText>
        </div>
      </TermsContainer>

      <TermsContainer>
        <div>
          <Checkbox></Checkbox>
          <CheckText>이벤트 및 마케팅 수신 여부</CheckText>
        </div>
      </TermsContainer>
    </>
  );
};

export default TermsAgree;
