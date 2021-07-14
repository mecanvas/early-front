import React from 'react';
import styled from '@emotion/styled';

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
  width: 546px;
  height: 280px;
  background-color: ${({ theme }) => theme.color.white};
  box-shadow: 0 4px 12px 0 rgb(0 0 0 / 16%);
  z-index: 101;
`;

interface Props {
  onClick: () => void;
}

const ToolTutorial = ({ onClick }: Props) => {
  return (
    <TutorialContainer>
      <TutorialModalBackground onClick={onClick} />
      <TutorialModal></TutorialModal>
    </TutorialContainer>
  );
};

export default ToolTutorial;
