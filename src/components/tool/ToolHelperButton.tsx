import styled from '@emotion/styled';
import { Button, List, Popover } from 'antd';
import { useRouter } from 'next/router';
import { icons } from 'public/icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ToolTutorial from './ToolTutorial';

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

const HelperButton = () => {
  const [showingHelper, setShowingHelper] = useState(false);
  const { asPath } = useRouter();
  const [isOpenTutorial, setIsOpenTutorial] = useState(false);
  const [openType, setOpenType] = useState<'frame' | 'bg'>('');
  const handleVisible = useCallback((visible) => {
    setShowingHelper(visible);
  }, []);

  const helpArray = useMemo(() => {
    const singleHelpList = {
      all: '전체적인 사용 설명이 필요해요.',
      frame: '액자의 크기를 변경하고 싶어요.',
      bg: '배경 색상을 변경하고 싶어요.',
      price: '예상 가격이 궁금해요.',
      order: '주문은 어떻게 하죠?',
    };

    if (asPath.includes('single')) {
      return Object.entries(singleHelpList);
    }
    return Object.entries(singleHelpList);
  }, [asPath]);

  const handleOpenTutorialModal = useCallback((e?: any) => {
    if (e) {
      const { key } = e.currentTarget.dataset;
      setOpenType(key);
    }

    setIsOpenTutorial((prev) => !prev);
    setShowingHelper(false);
  }, []);
  console.log(openType);
  return (
    <>
      {isOpenTutorial && <ToolTutorial type={openType} onClick={handleOpenTutorialModal} />}
      <Popover
        overlayClassName="antd-popover-no-padding"
        trigger="click"
        onVisibleChange={handleVisible}
        title={<h6>어떤 도움이 필요하세요?</h6>}
        placement="bottomLeft"
        content={
          <HelperList
            size="large"
            dataSource={helpArray}
            renderItem={([key, value]: any) => (
              <List.Item onClick={handleOpenTutorialModal} data-key={key}>
                {value}
              </List.Item>
            )}
          />
        }
        visible={showingHelper}
      >
        <HelpButton type="text" onClick={handleVisible}>
          <span>도움말</span>
          <img src={icons.questionMark} />
        </HelpButton>
      </Popover>
    </>
  );
};

export default HelperButton;
