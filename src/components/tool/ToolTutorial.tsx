import React from 'react';
import styled from '@emotion/styled';
import { TutorialType } from 'src/interfaces/ToolInterface';
import TutorialEdit from './tutorial/TutorialEdit';
import { Button } from 'antd';

const TutorialContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  z-index: 100;
  align-items: center;
`;

const TutorialModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
`;

const TutorialModal = styled.div`
  width: 508px;
  height: 508px;
  background-color: ${({ theme }) => theme.color.white};
  box-shadow: 0 4px 12px 0 rgb(0 0 0 / 16%);
  border-radius: 20px;
  z-index: 101;
  position: relative;
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 5px;
  right: 5px;
  span {
    font-size: 24px;
  }
`;

interface Props {
  onClick: () => void;
  type: TutorialType;
}

const ToolTutorial = ({ onClick, type }: Props) => {
  return (
    <TutorialContainer>
      <TutorialModalBackground onClick={onClick} />
      <TutorialModal>
        <CloseButton type="text" onClick={onClick}>
          X
        </CloseButton>

        {type === 'frame' && <div>프레임</div>}
        {type === 'edit' && <TutorialEdit />}
      </TutorialModal>
    </TutorialContainer>
  );
};

export default ToolTutorial;
