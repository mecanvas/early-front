import styled from '@emotion/styled';
import { Button, Steps, Tabs } from 'antd';
import { icons } from 'public/icons';
import React, { useCallback, useMemo, useState } from 'react';
const { Step } = Steps;

const MobileSingleToolHeader = styled.div`
  cursor: pointer;
  height: 45px;
  display: flex;
  align-items: center;
  padding: 0 1em;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray200};
  img {
    &:nth-of-type(1) {
      transform: rotateY(180deg);
      -webkit-transform: rotateY(180deg);
      -moz-transform: rotateY(180deg);
      -o-transform: rotateY(180deg);
      -ms-transform: rotateY(180deg);
      unicode-bidi: bidi-override;
      direction: rtl;
      margin-right: 4px;
      width: 20px;
    }
    width: 25px;
  }
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    cursor: pointer;
    img {
      &:nth-of-type(1) {
        transform: rotateY(180deg);
        -webkit-transform: rotateY(180deg);
        -moz-transform: rotateY(180deg);
        -o-transform: rotateY(180deg);
        -ms-transform: rotateY(180deg);
        unicode-bidi: bidi-override;
        direction: rtl;
        margin-right: 4px;
        width: 15px;
      }
      width: 20px;
    }
  }
`;

const MobileSingleToolContainer = styled.div`
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    padding: 1.5em 2px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const MobileSteps = styled(Steps)`
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    span {
      font-size: 13px;
      font-weight: 500;
    }
    svg {
      fill: ${({ theme }) => theme.color.primary};
      font-size: 13px;
      font-weight: 500;
      path {
        color: inherit;
        fill: inherit;
      }
    }
  }
`;

const MobileContent = styled.div`
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    width: 100%;
    padding: 1em;
    height: 500px;
  }
`;

const MobileStepButtonWrapper = styled.div`
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    width: 100%;
    display: flex;
    justify-content: center;
    div {
      display: flex;
      align-items: center;
    }
    & > button + button {
      margin-left: 1em;
    }
    & > button {
      width: 80px;
    }
  }
`;

const MobileNextStepButton = styled(Button)`
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    padding: 3px !important;
    font-size: 13px;
  }
`;
const MobilePrevStepButton = styled(Button)`
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    padding: 3px !important;
    font-size: 13px;
    border: 1px solid ${({ theme }) => theme.color.gray700};

    &:hover {
      border: 1px solid ${({ theme }) => theme.color.gray500};
    }
  }
`;

const FirstContent = styled.div`
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
`;

const MobileSingleTool = () => {
  const FIRST_INDEX = 0;
  const LAST_INDEX = 3;
  const [stepCount, setStepCount] = useState(0);

  const stepTitle = useMemo(() => {
    const title = new Map();
    title.set(0, '액자 선택');
    title.set(1, '사진 업로드');
    title.set(2, '시안 확인');
    title.set(3, '저장하기');
    return title;
  }, []);

  const handleNextStep = useCallback(() => {
    setStepCount((prev) => prev + 1);
  }, []);

  const handlePrevStep = useCallback(() => {
    setStepCount((prev) => prev - 1);
  }, []);

  return (
    <>
      <MobileSingleToolHeader>
        <img src={icons.arrow} />
        <img src={icons.home} />
      </MobileSingleToolHeader>
      <MobileSingleToolContainer>
        <MobileSteps size="small" labelPlacement="vertical" current={stepCount}>
          <Step title={stepTitle.get(0)} />
          <Step title={stepTitle.get(1)} />
          <Step title={stepTitle.get(2)} />
          <Step title={stepTitle.get(3)} />
        </MobileSteps>
        {/* step1 */}
        {stepCount === 0 && (
          <MobileContent>
            <FirstContent>
              <div>하</div>
              <div>후</div>
              <div>돈</div>
              <div>짱</div>
            </FirstContent>
          </MobileContent>
        )}
        {/* step2 */}
        {stepCount === 1 && <MobileContent>사진 업로드</MobileContent>}
        {/* step3 */}
        {stepCount === 2 && <MobileContent>시안 확인</MobileContent>}
        {/* step4 */}
        {stepCount === 3 && <MobileContent>저장하기</MobileContent>}
        <MobileStepButtonWrapper>
          {FIRST_INDEX !== stepCount && (
            <MobilePrevStepButton type="text" onClick={handlePrevStep}>
              {stepTitle.get(stepCount - 1)}
            </MobilePrevStepButton>
          )}

          {LAST_INDEX !== stepCount && (
            <MobileNextStepButton type="primary" onClick={handleNextStep}>
              {stepTitle.get(stepCount)}
            </MobileNextStepButton>
          )}
        </MobileStepButtonWrapper>
      </MobileSingleToolContainer>
    </>
  );
};

export default MobileSingleTool;
