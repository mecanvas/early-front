import React from 'react';
import { TutorialContainer, BadgeNumberDesc, Descriptions } from './TutorialStyle';
import TutorialTitle from './TutorialTitle';

const TutorialPreview = () => {
  return (
    <TutorialContainer>
      <TutorialTitle title="우측 상단의 미리보기 버튼을 클릭하세요." imgUrl="tutorial/preview.png" />
      <Descriptions>
        <BadgeNumberDesc
          count={1}
          desc={
            <div>
              우측 상단의 <b>미리보기</b> 버튼을 클릭하세요.
            </div>
          }
        />
        <BadgeNumberDesc count={2} desc={<div>제작한 시안이 나타납니다. 시안은 앞면만 제공합니다.</div>} />
        <BadgeNumberDesc
          count={3}
          desc={
            <div>
              되돌아가려면 같은 곳의 <b>이미지로</b> 버튼을 클릭하세요.
            </div>
          }
        />
      </Descriptions>
    </TutorialContainer>
  );
};

export default TutorialPreview;
