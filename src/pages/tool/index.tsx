import React from 'react';
import styled from '@emotion/styled';
import { Images } from 'public/index';
import { useOpacity } from 'src/hooks/useOpacity';
import Link from 'next/link';
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

  &:hover {
    opacity: 0.8;
    box-shadow: ${({ theme }) => theme.canvasShadow};
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

  &:hover {
    opacity: 0.8;
    box-shadow: ${({ theme }) => theme.canvasShadow};
  }
`;

const Index = () => {
  const { OpacityComponent } = useOpacity('trigger');
  return (
    <OpacityComponent>
      <SelectedWrapper>
        <Link href="/tool/single">
          <SelectedSingle>
            <div>
              <img src={Images.henry} />
            </div>
            <p>하나의 사진으로 하나의 캔버스</p>
          </SelectedSingle>
        </Link>

        <Link href="/tool/divided">
          <SelectedDivided>
            <div>
              <img src={Images.div} />
            </div>
            <p>하나의 사진으로 여러개의 캔버스</p>
          </SelectedDivided>
        </Link>
      </SelectedWrapper>
    </OpacityComponent>
  );
};

export default Index;
