import styled from '@emotion/styled';
import { Button, Steps } from 'antd';
import router from 'next/router';
import { icons } from 'public/icons';
import React, { useCallback, useMemo, useState } from 'react';
import { useAppSelector } from 'src/hooks/useRedux';
import ToolSave from '../ToolSave';
import FirstStep from './FirstStep';
import FourthStep from './FourthStep';
import SecondsStep from './SecondsStep';
import ThirdStep from './ThirdStep';
const { Step } = Steps;

const Container = styled.div``;

const MobileSingleToolHeader = styled.div`
  cursor: pointer;
  height: 45px;
  display: flex;
  align-items: center;
  padding: 0 2em;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray200};

  nav {
    max-width: 1200px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    margin: 0 auto;

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
  }
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    padding: 0 1em;

    img {
      &:nth-of-type(1) {
        width: 15px;
      }
      width: 20px;
    }
  }
`;

const MobileSingleToolContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2em 1em;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    max-width: ${({ theme }) => theme.size.sm};
    padding: 1em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const MobileSteps = styled(Steps)`
  svg {
    path {
      fill: ${({ theme }) => theme.color.primary};
    }
  }
  span {
    font-size: 13px;
    font-weight: 500;
  }

  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
  }
`;

const MobileContent = styled.div`
  padding: 2em 1em;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    width: 100%;
    padding: 0.5em 0;
  }
`;

const MobileStepButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 2em;
  div {
    display: flex;
    align-items: center;
  }
  & > button + button {
    margin-left: 1em;
  }
  & > button {
    width: 150px;
  }

  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    justify-content: center;
    margin-top: 2em;
    & > button {
      width: 120px;
    }
  }
`;

const MobileNextStepButton = styled(Button)`
  font-size: 13px;
  padding: 3px !important;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
  }
`;
const MobilePrevStepButton = styled(Button)`
  font-size: 13px;
  padding: 3px !important;
  border: 1px solid ${({ theme }) => theme.color.gray700};

  &:hover {
    border: 1px solid ${({ theme }) => theme.color.gray500};
  }
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
  }
`;

const LastContent = styled.div``;

const MobileSingleTool = () => {
  const FIRST_INDEX = 0;
  const LAST_INDEX = 4;
  const [stepCount, setStepCount] = useState(0);
  const { selectedFrame } = useAppSelector((state) => state.frame);

  const nextCondition = useMemo(() => {
    const condition = new Map();
    condition.set(0, selectedFrame.length);
    condition.set(
      1,
      selectedFrame.every((lst) => lst.imgUrl),
    );
    condition.set(2, selectedFrame.length);
    condition.set(3, selectedFrame.length);
    return condition;
  }, [selectedFrame]);

  const stepTitle = useMemo(() => {
    const title = new Map();
    title.set(0, '액자');
    title.set(1, '이미지');
    title.set(2, '제작');
    title.set(3, '옆면');
    title.set(4, '저장');
    return title;
  }, []);

  const handleNextStep = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStepCount((prev) => prev + 1);
  }, []);

  const handlePrevStep = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStepCount((prev) => prev - 1);
  }, []);

  const handleFinished = useCallback(() => {
    router.push('/success');
  }, []);

  return (
    <Container>
      <MobileSingleToolHeader>
        <nav>
          <img src={icons.arrow} />
          <img src={icons.home} />
        </nav>
      </MobileSingleToolHeader>
      <MobileSingleToolContainer>
        <MobileSteps size="small" labelPlacement="vertical" responsive current={stepCount}>
          <Step title={stepTitle.get(0)} />
          <Step title={stepTitle.get(1)} />
          <Step title={stepTitle.get(2)} />
          <Step title={stepTitle.get(3)} />
          <Step title={stepTitle.get(4)} />
        </MobileSteps>
        {/* step1 액자 선택 */}
        {stepCount === 0 && (
          <MobileContent>
            <FirstStep />
          </MobileContent>
        )}
        {/* step2 이미지 */}
        {stepCount === 1 && (
          <MobileContent>
            <SecondsStep />
          </MobileContent>
        )}
        {/* step3 제작 */}
        {stepCount === 2 && (
          <MobileContent>
            <ThirdStep />
          </MobileContent>
        )}
        {/* step4  옆면 */}
        {stepCount === 3 && (
          <MobileContent>
            <FourthStep />
          </MobileContent>
        )}

        {/* step5 저장 */}
        {stepCount === 4 && (
          <MobileContent>
            <LastContent>
              <ToolSave />
            </LastContent>
          </MobileContent>
        )}

        <MobileStepButtonWrapper>
          {FIRST_INDEX !== stepCount && (
            <MobilePrevStepButton type="text" onClick={handlePrevStep}>
              {stepTitle.get(stepCount - 1)}
            </MobilePrevStepButton>
          )}

          {LAST_INDEX !== stepCount && (
            <MobileNextStepButton type="primary" onClick={handleNextStep} disabled={!nextCondition.get(stepCount)}>
              {stepTitle.get(stepCount + 1)}
            </MobileNextStepButton>
          )}

          {LAST_INDEX === stepCount && (
            <MobileNextStepButton type="primary" onClick={handleFinished}>
              저장하기
            </MobileNextStepButton>
          )}
        </MobileStepButtonWrapper>
      </MobileSingleToolContainer>
    </Container>
  );
};

export default MobileSingleTool;
