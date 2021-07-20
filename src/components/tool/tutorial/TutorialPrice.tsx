import React from 'react';
import { useGlobalState } from 'src/hooks';
import { TutorialContainer, BadgeNumberDesc, TutorialDescriptions } from './TutorialStyle';
import TutorialTitle from './TutorialTitle';

const DividedDescription = () => {
  return (
    <TutorialDescriptions>
      <BadgeNumberDesc
        count={1}
        desc={
          <div>
            <b>가격확인</b>에 커서를 올리면 호수, 개수, 가격이 나타납니다.
          </div>
        }
      />
    </TutorialDescriptions>
  );
};

const SingleDescription = () => {
  return (
    <TutorialDescriptions>
      <BadgeNumberDesc count={1} desc={'선택한 액자에 따라 가격이 갱신됩니다.'} />
    </TutorialDescriptions>
  );
};

const TutorialPrice = () => {
  const [toolType] = useGlobalState<'single' | 'divided'>('toolType');

  return (
    <TutorialContainer>
      <TutorialTitle title="왼쪽 상단을 확인하세요." imgUrl={`tutorial/${toolType}/price.png`} />

      {toolType === 'single' ? <SingleDescription /> : <DividedDescription />}
    </TutorialContainer>
  );
};

export default TutorialPrice;
