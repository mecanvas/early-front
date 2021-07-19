import React from 'react';
import { useGlobalState } from 'src/hooks';
import { BadgeNumberDesc, TutorialDescriptions, TutorialContainer } from './TutorialStyle';
import TutorialTitle from './TutorialTitle';

const TutorialImg = () => {
  const [toolType] = useGlobalState<'single' | 'divided'>('toolType');

  return (
    <TutorialContainer>
      <TutorialTitle title="액자 선택 후 원하는 위치에 클릭하세요." imgUrl={`tutorial/${toolType}/imgcontrol.png`} />
      <TutorialDescriptions>
        <BadgeNumberDesc count={1} desc={'저장 버튼 클릭 시 다음과 같은 화면이 나타납니다.'} />
      </TutorialDescriptions>
    </TutorialContainer>
  );
};

export default TutorialImg;
