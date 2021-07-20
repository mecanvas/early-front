import React from 'react';
import styled from '@emotion/styled';
import { TutorialType } from 'src/interfaces/ToolInterface';
import TutorialEdit from './tutorial/TutorialEdit';
import { Button } from 'antd';
import TutorialFrame from './tutorial/TutorialFrame';
import TutorialPreview from './tutorial/TutorialPreview';
import TutorialPrice from './tutorial/TutorialPrice';
import TutorialOrder from './tutorial/TutorialOrder';
import { useOpacity } from 'src/hooks/useOpacity';
import TutorialImg from './tutorial/TutorialImg';
import TutorialAll from './tutorial/TutorialAll';

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
  z-index: 9999;
  span {
    font-size: 24px;
  }
`;

interface Props {
  onClick: () => void;
  tutorialType: TutorialType;
}

const ToolTutorial = ({ onClick, tutorialType }: Props) => {
  const { OpacityComponent } = useOpacity('type');
  return (
    <TutorialContainer>
      <TutorialModalBackground onClick={onClick} />
      <OpacityComponent>
        <TutorialModal>
          <CloseButton type="text" onClick={onClick}>
            X
          </CloseButton>

          {tutorialType === 'all' && <TutorialAll />}
          {tutorialType === 'frame' && <TutorialFrame />}
          {tutorialType === 'preview' && <TutorialPreview />}
          {tutorialType === 'image' && <TutorialImg />}
          {tutorialType === 'edit' && <TutorialEdit />}
          {tutorialType === 'price' && <TutorialPrice />}
          {tutorialType === 'order' && <TutorialOrder />}
        </TutorialModal>
      </OpacityComponent>
    </TutorialContainer>
  );
};

export default ToolTutorial;
