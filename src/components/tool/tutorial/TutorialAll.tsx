import React from 'react';
import { useGlobalState } from 'src/hooks';
import { useCarousel } from 'src/hooks/useCarousel';
import TutorialEdit from './TutorialEdit';
import TutorialFrame from './TutorialFrame';
import TutorialOrder from './TutorialOrder';
import TutorialPreview from './TutorialPreview';
import TutorialPrice from './TutorialPrice';
import { TutorialContainer, TutorialDescriptions, BadgeNumberDesc } from './TutorialStyle';
import TutorialTitle from './TutorialTitle';

const DividedDesription = () => {
  const { AntdCarousel } = useCarousel();

  return (
    <AntdCarousel startIndex={0} lastIndex={8}>
      <div>
        <TutorialContainer>
          <TutorialTitle title="원하는 이미지로 시안을 제작하세요!" imgUrl={`tutorial/single/preview.png`} />
          <TutorialDescriptions>
            <BadgeNumberDesc
              count={1}
              desc={
                <div>
                  이미지의 사이즈는 최소 <b>1MB 이상</b>이어야 합니다.
                </div>
              }
            />
            <BadgeNumberDesc
              count={2}
              desc={
                <div>
                  이미지의 <b>해상도에 따라 결과물이 상이</b>할 수 있습니다.
                </div>
              }
            />
            <BadgeNumberDesc
              count={3}
              desc={
                <div>
                  <b>익스플로러</b> 환경에선 사용이 어려울 수 있습니다.
                </div>
              }
            />
            <BadgeNumberDesc
              count={4}
              desc={
                <div>
                  얼리 21은 <b>크롬</b>에 최적화 되어있습니다.
                </div>
              }
            />
            <BadgeNumberDesc
              count={5}
              desc={
                <div>
                  쾌적한 작업을 위해 <b>전체 화면</b>으로 진행해 주세요.
                </div>
              }
            />
          </TutorialDescriptions>
        </TutorialContainer>
      </div>
      <div>
        <TutorialEdit />
      </div>
      <div>
        <TutorialContainer>
          <TutorialTitle title="첨부한 이미지를 클릭하세요." imgUrl={`tutorial/divided/imgcontrol.png`} />
          <TutorialDescriptions>
            <BadgeNumberDesc count={1} desc={'첨부한 이미지를 클릭하면 다음과 같이 조절할 수 있습니다.'} />
          </TutorialDescriptions>
        </TutorialContainer>
      </div>
      <div>
        <TutorialContainer>
          <TutorialTitle title="상단의 에디터 버튼을 클릭하세요." imgUrl={`tutorial/divided/imgcontrolmodal.png`} />
          <TutorialDescriptions>
            <BadgeNumberDesc
              count={1}
              desc={
                <div>
                  너비에 비율을 맞출 시 비율을 <b>자동으로 조정</b>합니다.
                </div>
              }
            />
            <BadgeNumberDesc
              count={2}
              desc={
                <div>
                  초기 사이즈로 되돌릴 시, <b>처음 사이즈</b>로 돌아갑니다.
                </div>
              }
            />
          </TutorialDescriptions>
        </TutorialContainer>
      </div>
      <div>
        <TutorialContainer>
          <TutorialTitle title="액자 선택 후 원하는 위치에 클릭하세요." videoUrl={`tutorial/divided/divided.mp4`} />
          <TutorialDescriptions>
            <BadgeNumberDesc
              count={1}
              desc={
                <div>
                  <b>정방/인물/풍경</b> 테마 중 원하는 액자 타입을 선택하세요.
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
        </TutorialContainer>
      </div>
      <div>
        <TutorialContainer>
          <TutorialTitle title="액자는 가로/세로 변환할 수 있습니다." videoUrl={`tutorial/divided/vertical.mp4`} />
          <TutorialDescriptions>
            <BadgeNumberDesc count={1} desc={<div>맨 하단의 변환 아이콘을 클릭하세요.</div>} />
            <BadgeNumberDesc
              count={2}
              desc={
                <div>
                  액자를 재선택하세요. <b>가로/세로로</b> 변환됩니다.
                </div>
              }
            />
          </TutorialDescriptions>
        </TutorialContainer>
      </div>
      <div>
        <TutorialPreview />
      </div>
      <div>
        <TutorialPrice />
      </div>
      <div>
        <TutorialOrder />
      </div>
    </AntdCarousel>
  );
};

const SingleDescription = () => {
  const { AntdCarousel } = useCarousel();
  return (
    <AntdCarousel startIndex={0} lastIndex={5}>
      <div>
        <TutorialContainer>
          <TutorialTitle title="원하는 이미지로 시안을 제작하세요!" imgUrl={`tutorial/single/preview.png`} />
          <TutorialDescriptions>
            <BadgeNumberDesc
              count={1}
              desc={
                <div>
                  이미지의 사이즈는 최소 <b>1MB 이상</b>이어야 합니다.
                </div>
              }
            />
            <BadgeNumberDesc
              count={2}
              desc={
                <div>
                  이미지의 <b>해상도에 따라 결과물이 상이</b>할 수 있습니다.
                </div>
              }
            />
            <BadgeNumberDesc
              count={3}
              desc={
                <div>
                  <b>익스플로러</b> 환경에선 사용이 어려울 수 있습니다.
                </div>
              }
            />
            <BadgeNumberDesc
              count={4}
              desc={
                <div>
                  얼리 21은 <b>크롬</b>에 최적화 되어있습니다.
                </div>
              }
            />
            <BadgeNumberDesc
              count={5}
              desc={
                <div>
                  쾌적한 작업을 위해 <b>전체 화면</b>으로 진행해 주세요.
                </div>
              }
            />
          </TutorialDescriptions>
        </TutorialContainer>
      </div>
      <div>
        <TutorialEdit />
      </div>
      <div>
        <TutorialFrame />
      </div>
      <div>
        <TutorialPreview />
      </div>
      <div>
        <TutorialPrice />
      </div>
      <div>
        <TutorialOrder />
      </div>
    </AntdCarousel>
  );
};

const TutorialAll = () => {
  const [toolType] = useGlobalState<'single' | 'divided'>('toolType');

  return <>{toolType === 'single' ? <SingleDescription /> : <DividedDesription />} </>;
};

export default TutorialAll;
