import React from 'react';
import { useGlobalState } from 'src/hooks';
import { TutorialContainer, BadgeNumberDesc, TutorialDescriptions } from './TutorialStyle';
import TutorialTitle from './TutorialTitle';

const TutorialPrice = () => {
  const [toolType] = useGlobalState<'single' | 'divided'>('toolType');

  return (
    <TutorialContainer>
      <TutorialTitle title="왼쪽 상단을 확인하세요." imgUrl={`tutorial/${toolType}/price.png`} />
      <TutorialDescriptions>
        <BadgeNumberDesc count={1} desc={'선택한 액자에 따라 가격이 갱신됩니다.'} />
      </TutorialDescriptions>
    </TutorialContainer>
  );
};

export default TutorialPrice;
