import styled from '@emotion/styled';
import { Checkbox } from 'antd';
import React from 'react';
import RegisterTerm from './RegisterTerm';
import RegisterTerm2 from './RegisterTerm2';

const TermsContainer = styled.div`
  max-width: 800px;
  width: 100%;
  margin-bottom: 2em;
`;

const TermsAgree = () => {
  return (
    <>
      <TermsContainer>
        <h4>이용약관</h4>
        <RegisterTerm />
        <div>
          <Checkbox>이용약관에 동의합니다.</Checkbox>
        </div>
      </TermsContainer>
      {/* 개인정보수집동의 */}

      <TermsContainer>
        <h4>개인정보 수집 및 동의</h4>
        <RegisterTerm2 />
        <div>
          <Checkbox>개인정보 수집에 동의합니다.</Checkbox>
        </div>
      </TermsContainer>
    </>
  );
};

export default TermsAgree;
