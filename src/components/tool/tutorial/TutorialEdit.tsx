import React from 'react';
import { useGlobalState } from 'src/hooks';
import { TutorialContainer, TutorialDescriptions, BadgeNumberDesc } from './TutorialStyle';
import TutorialTitle from './TutorialTitle';

const DividedDescription = () => {
  return (
    <TutorialDescriptions>
      <BadgeNumberDesc
        count={1}
        desc={
          <div>
            <b>이미지를 첨부(변경)</b>합니다. 화면상에 드롭도 가능합니다.
          </div>
        }
      />
      <BadgeNumberDesc
        count={2}
        desc={
          <div>
            분할한 액자를 최근 순서대로 <b>제거</b>합니다.
          </div>
        }
      />
      <BadgeNumberDesc
        count={3}
        desc={
          <div>
            바탕화면의 <b>색상</b>을 변경합니다.
          </div>
        }
      />
      <BadgeNumberDesc
        count={4}
        desc={
          <div>
            <b>가이드 눈금</b>을 표시합니다.
          </div>
        }
      />
      <BadgeNumberDesc
        count={5}
        desc={
          <div>
            이미지의 비율을 원본에 맞춰 <b>자동 조정</b>합니다.
          </div>
        }
      />
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
            <b>이미지를 첨부(변경)</b>합니다. 화면상에 드롭도 가능합니다.
          </div>
        }
      />
      <BadgeNumberDesc
        count={2}
        desc={
          <div>
            현재 이미지를 <b>수평</b>으로 정렬합니다.
          </div>
        }
      />
      <BadgeNumberDesc
        count={3}
        desc={
          <div>
            현재 이미지를 <b>수직</b>으로 정렬합니다.
          </div>
        }
      />
      <BadgeNumberDesc
        count={4}
        desc={
          <div>
            테두리로 구분된 액자의 <b>배경</b>을 변경합니다.
          </div>
        }
      />
      <BadgeNumberDesc
        count={5}
        desc={
          <div>
            표시된 액자의 선에 <b>이미지를 채웁니다.</b>
          </div>
        }
      />
      <BadgeNumberDesc
        count={6}
        desc={
          <div>
            이미지의 비율을 원본에 맞춰 <b>자동 조정</b>합니다.
          </div>
        }
      />
    </TutorialDescriptions>
  );
};

const TutorialEdit = () => {
  const [toolType] = useGlobalState<'single' | 'divided'>('toolType');

  return (
    <TutorialContainer>
      <TutorialTitle title="에디터에서는 다음과 같은 도구를 제공합니다." imgUrl={`tutorial/${toolType}/header.png`} />

      {toolType === 'single' ? <SingleDescription /> : <DividedDescription />}
    </TutorialContainer>
  );
};

export default TutorialEdit;
