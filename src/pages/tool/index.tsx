import React from 'react';
import styled from '@emotion/styled';
import { Images } from 'public/index';
import { useOpacity } from 'src/hooks/useOpacity';
import Link from 'next/link';
import SEO from 'src/components/common/SEO';
import { TOOL_SEO } from 'src/constants/SeoOnly';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: ${({ theme }) => theme.color.gray000};
  min-height: calc(98vh);
  h4 {
    @media all and (max-width: ${({ theme }) => theme.size.sm}) {
      margin-top: 1em;
      margin-bottom: 0;
    }
  }
`;

const SelectedWrapper = styled.div`
  padding-top: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    flex-direction: column;
  }
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
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    margin-bottom: 2em;
    margin-right: 0;
  }
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
    background-color: ${({ theme }) => theme.color.white};
    font-weight: 500;
    margin: 0;
    padding: 1em 0;
    border-radius: 8px;
  }

  &:hover {
    opacity: 0.8;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
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
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    margin-bottom: 2em;
    margin-left: 0;
  }
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
    background-color: ${({ theme }) => theme.color.white};
    font-weight: 500;
    margin: 0;
    padding: 1em 0;
    border-radius: 8px;
  }

  &:hover {
    opacity: 0.8;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  }
`;

const Index = () => {
  const { OpacityComponent } = useOpacity('trigger');
  return (
    <Container>
      <SEO {...TOOL_SEO} />
      <h4>제작방식을 선택해 주세요.</h4>
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
    </Container>
  );
};

export default Index;
