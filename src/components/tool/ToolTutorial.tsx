import React from 'react';
import styled from '@emotion/styled';

const TutorialContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TutorialModal = styled.div`
  width: 546px;
  height: 280px;
  background-color: ${({ theme }) => theme.color.white};
  box-shadow: 0 4px 12px 0 rgb(0 0 0 / 16%);
`;

const ToolTutorial = () => {
  return (
    <TutorialContainer>
      <TutorialModal></TutorialModal>
    </TutorialContainer>
  );
};

export default ToolTutorial;
