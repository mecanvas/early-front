import React from 'react';
import { useGlobalState } from 'src/hooks';
import { useCarousel } from 'src/hooks/useCarousel';
import { BadgeNumberDesc, TutorialDescriptions, TutorialContainer } from './TutorialStyle';
import TutorialTitle from './TutorialTitle';

const TutorialImg = () => {
  const [toolType] = useGlobalState<'single' | 'divided'>('toolType');
  const { AntdCarousel } = useCarousel();

  return (
    <>
      <AntdCarousel startIndex={0} lastIndex={1}>
        <div>
          <TutorialContainer>
            <TutorialTitle title="첨부한 이미지를 클릭하세요." imgUrl={`tutorial/${toolType}/imgcontrol.png`} />
            <TutorialDescriptions>
              <BadgeNumberDesc count={1} desc={'첨부한 이미지를 클릭하면 다음과 같이 조절할 수 있습니다.'} />
            </TutorialDescriptions>
          </TutorialContainer>
        </div>
        <div>
          <TutorialContainer>
            <TutorialTitle
              title="상단의 에디터 버튼을 클릭하세요."
              imgUrl={`tutorial/${toolType}/imgcontrolmodal.png`}
            />
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
      </AntdCarousel>
    </>
  );
};

export default TutorialImg;
