import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Button, Slider, Steps } from 'antd';
import router from 'next/router';
import { icons } from 'public/icons';
import React, { useCallback, useMemo, useState } from 'react';
import { useAppSelector } from 'src/hooks/useRedux';
import ToolSave from '../ToolSave';
import FirstStep from './FirstStep';
import SecondsStep from './SecondsStep';
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

const ThirdContent = styled.div`
  display: grid;
  gap: 1em;
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    justify-content: space-between;
  }
`;

const ThirdContentDrawingCanvas = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.color.gray500};
  /* background-color: ${({ theme }) => theme.color.white}; */
`;

const ThirdContentCropper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 285px;
  height: 285px;
  transform: translate(-50%, -50%);
  cursor: move;

  /* top */
  span:nth-of-type(1) {
    position: absolute;
    top: 0;
    width: 100%;
    height: 1px;
    border-top: 2px dashed ${({ theme }) => theme.color.primary};
  }
  /* right */
  span:nth-of-type(2) {
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    border-right: 2px dashed ${({ theme }) => theme.color.primary};
  }
  /* bottom */
  span:nth-of-type(3) {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1px;
    border-bottom: 2px dashed ${({ theme }) => theme.color.primary};
  }
  /* left */
  span:nth-of-type(4) {
    position: absolute;
    left: 0;
    top: 0;
    width: 1px;
    height: 100%;
    border-left: 2px dashed ${({ theme }) => theme.color.primary};
  }
`;

// TODO: 캔버스로 전환 예정 이미지 자를 수 있게.
const LikeCanvas = styled.div`
  width: 100%;
  max-width: 462.5px;
  background-color: #a5b0e6;
  filter: brightness(70%);

  img {
    width: 100%;
  }
`;

const ThirdPreviewCanvasWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6em;
  background-color: ${({ theme }) => theme.color.gray000};

  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    padding: 6em;
  }
`;

const ThirdPreviewCanvas = styled.div`
  width: 100%;
  max-width: 302px;
  filter: ${({ theme }) => theme.canvasShadowFilter};
  background-color: #a5b0e6;

  img {
    width: 100%;
    height: 100%;
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
    setStepCount((prev) => prev + 1);
  }, []);

  const handlePrevStep = useCallback(() => {
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
            <div>
              <Slider
                style={{ width: '135px' }}
                min={1}
                defaultValue={1}
                max={10}
                step={1}
                marks={{ 1: <ZoomOutOutlined />, 10: <ZoomInOutlined /> }}
              />
            </div>
            <ThirdContent>
              <ThirdContentDrawingCanvas>
                <LikeCanvas>
                  <img src="https://early-dev.s3.ap-northeast-2.amazonaws.com/brian-lawson-RBy6FEQ2DIk-unsplash-removebg-preview.png" />
                </LikeCanvas>
                <ThirdContentCropper>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </ThirdContentCropper>
              </ThirdContentDrawingCanvas>

              <ThirdPreviewCanvasWrapper>
                <ThirdPreviewCanvas>
                  <img
                    src={
                      'https://early-dev.s3.ap-northeast-2.amazonaws.com/20210718174824_2021%E1%84%82%E1%85%A7%E1%86%AB+07%E1%84%8B%E1%85%AF%E1%86%AF+18%E1%84%8B%E1%85%B5%E1%86%AF+17_48_gg_%E1%84%8C%E1%85%A5%E1%86%BC%E1%84%87%E1%85%A1%E1%86%BC+S-1%E1%84%92%E1%85%A9.png'
                    }
                  />
                </ThirdPreviewCanvas>
              </ThirdPreviewCanvasWrapper>
            </ThirdContent>
          </MobileContent>
        )}
        {/* step4  옆면 */}
        {stepCount === 3 && (
          <MobileContent>
            <LastContent>
              <ToolSave />
            </LastContent>
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
