import React from 'react';
import { BadgeNumberDesc, Descriptions, TutorialContainer } from './TutorialStyle';
import TutorialTitle from './TutorialTitle';

const TutorialFrame = () => {
  return (
    <TutorialContainer>
      <TutorialTitle title="원하는 액자를 골라 변경할 수 있습니다." imgUrl="tutorial/select.png" />
      <Descriptions>
        <BadgeNumberDesc count={1} desc="이미지 첨부(변경)를 합니다. 화면상에 드롭도 가능합니다." />
      </Descriptions>
    </TutorialContainer>
  );
};

export default TutorialFrame;
