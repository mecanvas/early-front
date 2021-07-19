import React from 'react';
import { useGlobalState } from 'src/hooks';
import { TutorialContainer, BadgeNumberDesc, Descriptions } from './TutorialStyle';
import TutorialTitle from './TutorialTitle';

const TutorialPrice = () => {
  const [toolType] = useGlobalState<'single' | 'divided'>('toolType');

  return (
    <TutorialContainer>
      <TutorialTitle title="왼쪽 상단을 확인하세요." imgUrl={`tutorial/${toolType}/price.png`} />
      <Descriptions>
        <BadgeNumberDesc count={1} desc={'선택한 액자에 따라 가격이 갱신됩니다.'} />
      </Descriptions>
    </TutorialContainer>
  );
};

export default TutorialPrice;
