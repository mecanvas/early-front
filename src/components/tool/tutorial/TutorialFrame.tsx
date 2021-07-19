import React from 'react';
import { useGlobalState } from 'src/hooks';
import { BadgeNumberDesc, TutorialDescriptions, TutorialContainer } from './TutorialStyle';
import TutorialTitle from './TutorialTitle';

const DividedDescription = () => {
  return (
    <TutorialDescriptions>
      <BadgeNumberDesc
        count={1}
        desc={
          <div>
            <b>정방/인물/해경/풍경</b> 테마 중 원하는 액자 타입을 선택하세요.
          </div>
        }
      />
      <BadgeNumberDesc
        count={2}
        desc={
          <div>
            액자를 선택하면 <b>마우스를 따라 다니는 액자</b>가 생성됩니다.
          </div>
        }
      />
      <BadgeNumberDesc
        count={3}
        desc={
          <div>
            원하는 위치까지 <b>마우스를 움직인 뒤 클릭</b>하세요.
          </div>
        }
      />
      <BadgeNumberDesc count={4} desc={<div>분할된 액자에 커서를 올려 클릭하면 제거됩니다.</div>} />
    </TutorialDescriptions>
  );
};

const SingleDescription = () => {
  return (
    <TutorialDescriptions>
      <BadgeNumberDesc
        count={1}
        desc={
          <div>
            <b>정방/인물/해경/풍경</b> 테마 중 원하는 액자 타입을 선택하세요.
          </div>
        }
      />
      <BadgeNumberDesc count={2} desc="원하는 액자를 선택하면 사이즈가 자동 적용됩니다." />
      <BadgeNumberDesc count={3} desc="'접기'를 눌러 보이지 않게 할 수 있습니다." />
    </TutorialDescriptions>
  );
};

const TutorialFrame = () => {
  const [toolType] = useGlobalState<'single' | 'divided'>('toolType');

  return (
    <TutorialContainer>
      {toolType === 'single' ? (
        <TutorialTitle title="액자를 선택해 변경하세요." imgUrl={`tutorial/single/select.png`} />
      ) : (
        <TutorialTitle title="액자 선택 후 원하는 위치에 클릭하세요." videoUrl={`tutorial/divided/divided.mp4`} />
      )}

      {toolType === 'single' ? <SingleDescription /> : <DividedDescription />}
    </TutorialContainer>
  );
};

export default TutorialFrame;
