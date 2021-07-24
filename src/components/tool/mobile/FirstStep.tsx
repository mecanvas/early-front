import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Tabs, List } from 'antd';
import { icons } from 'public/icons';
import React, { useCallback, useState } from 'react';
import { frameSize } from 'src/constants';
import { FrameSize } from 'src/interfaces/ToolInterface';
import { replacePx } from 'src/utils/replacePx';

const TabTitle = styled.span`
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    font-size: 13px;
  }
`;

const FirstContent = styled.div`
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

const FirstGuideText = styled.h5``;

const FirstListItems = styled(List.Item)`
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.color.gray000};
  }
`;

const FirstFrameWrapper = styled.div`
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

const FirstFramePreview = styled.div<{ width: string; height: string }>`
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

const FirstStep = () => {
  const [defaultTab, setDefaultTab] = useState('추천액자');

  const handleTabClick = useCallback((key: string) => {
    setDefaultTab(key);
  }, []);

  return (
    <Tabs defaultActiveKey={defaultTab} onTabClick={handleTabClick} activeKey={defaultTab}>
      <Tabs.TabPane key="추천액자" tab={<TabTitle>추천액자</TabTitle>}>
        <FirstGuideText>이런 액자는 어떠세요?</FirstGuideText>
        <FirstContent>
          <List
            bordered
            dataSource={frameSize().filter((lst) => lst.attribute === '정방')}
            renderItem={(item: FrameSize) => (
              <FirstListItems>
                <div>
                  <div>{item.name}</div>
                  <div>
                    <small>{item.cm}</small>
                  </div>
                </div>
              </FirstListItems>
            )}
          />
          <FirstFrameWrapper>
            {frameSize()
              .filter((lst) => lst.attribute == '정방')
              .slice(1, 2)
              .map((lst) => (
                <FirstFramePreview {...lst.size}>
                  <img src={icons.rotate} />
                </FirstFramePreview>
              ))}
          </FirstFrameWrapper>
        </FirstContent>
      </Tabs.TabPane>
      <Tabs.TabPane key="정사각형" tab={<TabTitle>정사각형</TabTitle>}>
        <FirstGuideText>정사각형 액자입니다. 탁상에 놓기 부담없는 사이즈에요!</FirstGuideText>
        <FirstContent>
          <List
            bordered
            dataSource={frameSize().filter((lst) => lst.attribute === '정방')}
            renderItem={(item: FrameSize) => (
              <FirstListItems>
                <div>
                  <div>{item.name}</div>
                  <div>
                    <small>{item.cm}</small>
                  </div>
                </div>
              </FirstListItems>
            )}
          />
          <FirstFrameWrapper>
            {frameSize()
              .filter((lst) => lst.attribute === '정방')
              .slice(0, 1)
              .map((lst) => (
                <FirstFramePreview {...lst.size}></FirstFramePreview>
              ))}
          </FirstFrameWrapper>
        </FirstContent>
      </Tabs.TabPane>
      <Tabs.TabPane key="직사각형" tab={<TabTitle>직사각형</TabTitle>}>
        <FirstGuideText>직사각형 액자입니다. 회전으로 가로와 세로를 바꿀 수 있어요!</FirstGuideText>
        <FirstContent>
          <List
            bordered
            dataSource={frameSize().filter((lst) => lst.attribute !== '정방')}
            renderItem={(item: FrameSize) => (
              <FirstListItems>
                <div>
                  <div>{item.name}</div>
                  <div>
                    <small>{item.cm}</small>
                  </div>
                </div>
              </FirstListItems>
            )}
          />
          <FirstFrameWrapper>
            {frameSize()
              .filter((lst) => lst.attribute !== '정방')
              .slice(0, 1)
              .map((lst) => (
                <FirstFramePreview {...lst.size}>
                  <img src={icons.rotate} />
                </FirstFramePreview>
              ))}
          </FirstFrameWrapper>
        </FirstContent>
      </Tabs.TabPane>
    </Tabs>
  );
};

export default FirstStep;
