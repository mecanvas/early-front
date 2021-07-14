import styled from '@emotion/styled';
import { Button } from 'antd';
import { icons } from 'public/icons';
import { useCallback, useState } from 'react';
import ToolTutorial from 'src/components/tool/ToolTutorial';

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

const FloatHelper = () => {
  const [showingModal, setShowingModal] = useState(false);

  const handleOpenTutorial = useCallback(() => {
    setShowingModal((prev) => !prev);
  }, []);

  return (
    <>
      <HelpButton type="text" onClick={handleOpenTutorial}>
        <span>도움말</span>
        <img src={icons.questionMark} />
      </HelpButton>
      {showingModal && <ToolTutorial onClick={handleOpenTutorial} />}
    </>
  );
};

export default FloatHelper;
