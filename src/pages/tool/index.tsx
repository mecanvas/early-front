import React from 'react';
import styled from '@emotion/styled';
import { Images } from 'public/index';
const SelectedWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: calc(100vh - 170px);
  background-color: ${({ theme }) => theme.color.white};
`;

const SelectedSingle = styled.div`
  cursor: pointer;
  border-radius: 8px;
  width: 300px;
  border: 1px solid ${({ theme }) => theme.color.gray300};
  display: flex;
  flex-direction: column;
  margin-right: 3em;
  text-align: center;
  div:nth-of-type(1) {
    border-radius: 8px;
    background-color: ${({ theme }) => theme.color.white};
    padding: 0.3em 0.3em;
    height: 350px;
    img {
      background-color: ${({ theme }) => theme.color.gray100};
      object-fit: contain;
      padding: 0.7em 0.3em;
      width: 100%;
      height: 100%;
    }
  }
  p {
    font-weight: 500;
    margin: 0;
    padding: 1em 0;
    border-radius: 8px;
  }
`;

const SelectedDivided = styled.div`
  cursor: pointer;
  border-radius: 8px;
  width: 300px;
  border: 1px solid ${({ theme }) => theme.color.gray300};
  display: flex;
  flex-direction: column;
  margin-left: 3em;
  text-align: center;
  div:nth-of-type(1) {
    background-color: ${({ theme }) => theme.color.white};
    height: 350px;
    border-radius: 8px;
    padding: 0.3em 0.3em;
    img {
      background-color: ${({ theme }) => theme.color.gray100};
      object-fit: contain;
      width: 100%;
      padding: 0.7em 0.3em;
      height: 100%;
    }
  }
  p {
    font-weight: 500;
    margin: 0;
    padding: 1em 0;
    border-radius: 8px;
  }
`;

const Index = () => {
  return (
    <SelectedWrapper>
      <SelectedSingle>
        <div>
          <img src={Images.henry} />
        </div>
        <p>하나의 사진으로 하나의 캔버스</p>
      </SelectedSingle>
      <SelectedDivided>
        <div>
          <img src={Images.div} />
        </div>
        <p>하나의 사진으로 여러개의 캔버스</p>
      </SelectedDivided>
    </SelectedWrapper>
  );
};

export default Index;
