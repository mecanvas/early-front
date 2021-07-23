import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, List, Steps, Tabs } from 'antd';
import { icons } from 'public/icons';
import React, { useCallback, useMemo, useState } from 'react';
import ImageDropZone from 'src/components/common/ImageDropZone';
import { frameSize } from 'src/constants';
import { FrameSize } from 'src/interfaces/ToolInterface';
import { replacePx } from 'src/utils/replacePx';
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

const MobileGuideText = styled.h5``;

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
    gap: 1em;
    grid-template-columns: repeat(2, 1fr);
    justify-content: center;
  }
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    justify-content: space-between;
  }
`;

const SecondsListItems = styled(List.Item)`
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.color.gray000};
  }
`;

const SecondsFrameWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.color.gray100};
  border-radius: 8px;
  padding: 3em 0;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    margin-top: 1em;
  }
`;

const SecondsFramePreview = styled.div<{ width: string; height: string }>`
  position: relative;
  ${({ width, height, theme }) =>
    width &&
    height &&
    css`
      background-color: ${theme.color.white};
      width: ${replacePx(width) / 2}px;
      height: ${replacePx(height) / 2}px;
      border: 1px solid ${theme.color.gray400};
    `}

  img {
    cursor: pointer;
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
  }
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
  }
`;

const MobileSingleTool = () => {
  const FIRST_INDEX = 0;
  const LAST_INDEX = 3;
  const [stepCount, setStepCount] = useState(0);
  const [defaultTab, setDefaultTab] = useState('추천액자');

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
              <Tabs.TabPane key="추천액자" tab={<TabTitle>추천액자</TabTitle>}>
                <MobileGuideText>이런 액자는 어떠세요?</MobileGuideText>
                <SecondsContent>
                  <List
                    bordered
                    dataSource={frameSize().filter((lst) => lst.attribute === '정방')}
                    renderItem={(item: FrameSize) => (
                      <SecondsListItems>
                        <div>
                          <div>{item.name}</div>
                          <div>
                            <small>{item.cm}</small>
                          </div>
                        </div>
                      </SecondsListItems>
                    )}
                  />
                  <SecondsFrameWrapper>
                    {frameSize()
                      .filter((lst) => lst.attribute == '정방')
                      .slice(1, 2)
                      .map((lst) => (
                        <SecondsFramePreview {...lst.size}>
                          <img src={icons.rotate} />
                        </SecondsFramePreview>
                      ))}
                  </SecondsFrameWrapper>
                </SecondsContent>
              </Tabs.TabPane>
              <Tabs.TabPane key="정사각형" tab={<TabTitle>정사각형</TabTitle>}>
                <MobileGuideText>정사각형 액자입니다. 탁상에 놓기 부담없는 사이즈에요!</MobileGuideText>
                <SecondsContent>
                  <List
                    bordered
                    dataSource={frameSize().filter((lst) => lst.attribute === '정방')}
                    renderItem={(item: FrameSize) => (
                      <SecondsListItems>
                        <div>
                          <div>{item.name}</div>
                          <div>
                            <small>{item.cm}</small>
                          </div>
                        </div>
                      </SecondsListItems>
                    )}
                  />
                  <SecondsFrameWrapper>
                    {frameSize()
                      .filter((lst) => lst.attribute === '정방')
                      .slice(0, 1)
                      .map((lst) => (
                        <SecondsFramePreview {...lst.size}></SecondsFramePreview>
                      ))}
                  </SecondsFrameWrapper>
                </SecondsContent>
              </Tabs.TabPane>
              <Tabs.TabPane key="직사각형" tab={<TabTitle>직사각형</TabTitle>}>
                <MobileGuideText>직사각형 액자입니다. 회전으로 가로와 세로를 바꿀 수 있어요!</MobileGuideText>
                <SecondsContent>
                  <List
                    bordered
                    dataSource={frameSize().filter((lst) => lst.attribute !== '정방')}
                    renderItem={(item: FrameSize) => (
                      <SecondsListItems>
                        <div>
                          <div>{item.name}</div>
                          <div>
                            <small>{item.cm}</small>
                          </div>
                        </div>
                      </SecondsListItems>
                    )}
                  />
                  <SecondsFrameWrapper>
                    {frameSize()
                      .filter((lst) => lst.attribute !== '정방')
                      .slice(0, 1)
                      .map((lst) => (
                        <SecondsFramePreview {...lst.size}>
                          <img src={icons.rotate} />
                        </SecondsFramePreview>
                      ))}
                  </SecondsFrameWrapper>
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
