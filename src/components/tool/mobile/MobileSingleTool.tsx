import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Card, Steps, Tabs } from 'antd';
import { icons } from 'public/icons';
import React, { useCallback, useMemo, useState } from 'react';
import ImageDropZone from 'src/components/common/ImageDropZone';
import { frameSize } from 'src/constants';
import { replacePx } from 'src/utils/replacePx';
const { Step } = Steps;

const Container = styled.div`
  max-width: ${({ theme }) => theme.size.sm};
  margin: 0 auto;
  padding: 0 1em;
`;

const MobileSingleToolHeader = styled.div`
  cursor: pointer;
  height: 45px;
  display: flex;
  align-items: center;
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
    img {
      &:nth-of-type(1) {
        width: 15px;
      }
      width: 20px;
    }
  }
`;

const MobileSingleToolContainer = styled.div`
  padding: 1em 0;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    padding: 1em 0;
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
  padding: 1em;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    width: 100%;
    padding: 1em;
  }
`;

const MobileStepButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
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

const FirstContent = styled.div`
  display: flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
  padding: 2em 0;
  width: 100%;
`;

const FirstContentDropZoneText = styled.div`
  display: flex;
  flex-direction: column;

  small {
    line-height: 22px;
    font-weight: 500;
    color: ${({ theme }) => theme.color.gray700};
  }
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    small {
      font-size: 11px;
    }
  }
`;

const TabTitle = styled.span`
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    font-size: 13px;
  }
`;

const SecondsContent = styled.div`
  @media all and (min-width: ${({ theme }) => theme.size.sm}) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-content: center;
  }
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    width: 100%;
    display: grid;
    gap: 1em;
    grid-template-columns: repeat(2, 1fr);
    justify-content: space-between;
  }
`;

const FrameList = styled.div<{ width: string; height: string }>`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  justify-content: center;
  text-align: center;
  & > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  ${({ width, height, theme }) =>
    width &&
    height &&
    css`
      width: ${replacePx(width) / 2}px;
      height: ${replacePx(height) / 2}px;
      border: 1px solid ${theme.color.gray500};
    `}
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    & > div {
      div {
        font-size: 13px;
      }
    }
  }
`;
const FrameDescription = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MobileSingleTool = () => {
  const FIRST_INDEX = 0;
  const LAST_INDEX = 3;
  const [stepCount, setStepCount] = useState(0);
  const [defaultTab, setDefaultTab] = useState('정사각형');

  const handleTabClick = useCallback((key: string) => {
    setDefaultTab(key);
  }, []);
  const stepTitle = useMemo(() => {
    const title = new Map();
    title.set(0, '이미지 선택');
    title.set(1, '액자 선택');
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

  const handleDropImage = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles);
  }, []);

  return (
    <Container>
      <MobileSingleToolHeader>
        <img src={icons.arrow} />
        <img src={icons.home} />
      </MobileSingleToolHeader>
      <MobileSingleToolContainer>
        <MobileSteps size="small" labelPlacement="vertical" responsive current={stepCount}>
          <Step title={stepTitle.get(0)} />
          <Step title={stepTitle.get(1)} />
          <Step title={stepTitle.get(2)} />
          <Step title={stepTitle.get(3)} />
        </MobileSteps>
        {/* step1 */}
        {stepCount === 0 && (
          <MobileContent>
            <FirstContent>
              <div>
                <h4>이미지를 업로드해 주세요.</h4>
                <p>해상도가 높을수록 퀄리티 있는 작품을 받아 보실 수 있어요.</p>
              </div>
              <ImageDropZone
                onDrop={handleDropImage}
                text={
                  <FirstContentDropZoneText>
                    <small>jpg, png, webp, svg 등 이미지 확장자</small>
                    <small> 최소 1MB 이상</small>
                  </FirstContentDropZoneText>
                }
              />
            </FirstContent>
          </MobileContent>
        )}
        {/* step2 */}
        {stepCount === 1 && (
          <MobileContent>
            <Tabs defaultActiveKey={defaultTab} onTabClick={handleTabClick} activeKey={defaultTab}>
              <Tabs.TabPane key="정사각형" tab={<TabTitle>정사각형</TabTitle>}>
                <SecondsContent>
                  {frameSize()
                    .filter((lst) => lst.attribute === '정방')
                    .map((lst) => (
                      <Card
                        title={
                          <FrameDescription>
                            <div>{lst.name}</div>
                            <small>{lst.price.toLocaleString()}원</small>
                          </FrameDescription>
                        }
                      >
                        <FrameList {...lst.size}>
                          <small>{lst.cm}</small>
                        </FrameList>
                      </Card>
                    ))}
                </SecondsContent>
              </Tabs.TabPane>
              <Tabs.TabPane key="직사각형" tab={<TabTitle>직사각형</TabTitle>}>
                <SecondsContent>
                  {frameSize()
                    .filter((lst) => lst.attribute !== '정방')
                    .map((lst) => (
                      <Card
                        title={
                          <FrameDescription>
                            <div>{lst.name}</div>
                            <small>{lst.price.toLocaleString()}원</small>
                          </FrameDescription>
                        }
                      >
                        <FrameList {...lst.size}>
                          <small>{lst.cm}</small>
                        </FrameList>
                      </Card>
                    ))}
                </SecondsContent>
              </Tabs.TabPane>
            </Tabs>
          </MobileContent>
        )}
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
              {stepTitle.get(stepCount + 1)}
            </MobileNextStepButton>
          )}
        </MobileStepButtonWrapper>
      </MobileSingleToolContainer>
    </Container>
  );
};

export default MobileSingleTool;
