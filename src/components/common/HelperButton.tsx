import styled from '@emotion/styled';
import { Button, List, Popover } from 'antd';
import { icons } from 'public/icons';
import React, { useCallback, useState } from 'react';

const HelpButton = styled(Button)`
  height: 34px;
  color: ${({ theme }) => theme.color.gray600};
  img {
    width: 20px;
    margin-bottom: 2px;
    margin-left: 2px;
  }

  &:hover {
    img {
      transition: all 100ms;
      filter: invert(65%) sepia(17%) saturate(185%) hue-rotate(153deg) brightness(85%) contrast(83%);
    }
  }
  &:active {
    img {
      filter: invert(65%) sepia(17%) saturate(185%) hue-rotate(153deg) brightness(85%) contrast(83%);
    }
  }
  &:focus {
    img {
      filter: invert(65%) sepia(17%) saturate(185%) hue-rotate(153deg) brightness(85%) contrast(83%);
    }
  }
`;

const HelperList = styled(List)`
  * {
    width: 300px;
    text-align: left;
  }
  * > li {
    padding: 1em 2em 1em 1em !important;
    cursor: pointer;
    font-size: 13px;
    &:hover {
      background-color: ${({ theme }) => theme.color.gray100};
    }
  }
`;

const FloatHelper = () => {
  const [showingModal, setShowingModal] = useState(false);

  const handleOpenTutorial = useCallback(() => {
    setShowingModal((prev) => !prev);
  }, []);

  const helpList = [
    '전체적인 사용 설명이 필요해요.',
    '액자의 크기를 변경하고 싶어요.',
    '배경 색상을 변경하고 싶어요.',
    '예상 가격이 궁금해요.',
    '주문은 어떻게 하죠?',
  ];

  return (
    <>
      <Popover
        overlayClassName="antd-popover-no-padding"
        trigger="click"
        title={<h6>어떤 도움이 필요하세요?</h6>}
        placement="bottomLeft"
        content={
          <HelperList size="large" dataSource={helpList} renderItem={(item: any) => <List.Item>{item}</List.Item>} />
        }
        visible={showingModal}
      >
        <HelpButton type="text" onClick={handleOpenTutorial}>
          <span>도움말</span>
          <img src={icons.questionMark} />
        </HelpButton>
      </Popover>
    </>
  );
};

export default FloatHelper;
