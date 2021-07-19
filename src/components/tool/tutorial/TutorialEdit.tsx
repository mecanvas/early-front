import React from 'react';
import { TutorialContainer, Descriptions, BadgeNumberDesc } from './TutorialStyle';
import TutorialTitle from './TutorialTitle';

const TutorialEdit = () => {
  return (
    <TutorialContainer>
      <TutorialTitle title="에디터에서는 다음과 같은 도구들을 제공합니다." imgUrl="tutorial/header.png" />

      <Descriptions>
        <BadgeNumberDesc count={1} desc="이미지 첨부(변경)를 합니다. 화면상에 드롭도 가능합니다." />
        <BadgeNumberDesc count={2} desc="현재 이미지를 수평으로 정렬합니다." />
        <BadgeNumberDesc count={3} desc="현재 이미지를 수직으로 정렬합니다." />
        <BadgeNumberDesc count={4} desc="테두리로 구분된 액자의 배경을 변경합니다." />
        <BadgeNumberDesc count={5} desc="선택된 액자의 크기에 맞춰 이미지를 채워 넣습니다." />
        <BadgeNumberDesc count={6} desc="이미지의 비율을 자동으로 조정합니다." />
      </Descriptions>
    </TutorialContainer>
  );
};

export default TutorialEdit;
