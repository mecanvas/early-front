import styled from '@emotion/styled';
import { Button, Carousel } from 'antd';
import { CarouselRef } from 'antd/lib/carousel';
import { icons } from 'public/icons';
import React, { useCallback, useRef, useState } from 'react';
import { useGlobalState } from 'src/hooks';
import { BadgeNumberDesc, TutorialDescriptions, TutorialContainer } from './TutorialStyle';
import TutorialTitle from './TutorialTitle';

const TutorialCarousel = styled(Carousel)`
  .slide-dots {
    button {
      margin-top: 12px;
      border: 1px solid ${({ theme }) => theme.color.primary} !important;
    }
  }
  li.slick-active {
    button {
      background-color: ${({ theme }) => theme.color.primary} !important;
    }
  }
`;

const PrevButton = styled(Button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0px;
  img {
    transform: rotateY(180deg);
    -webkit-transform: rotateY(180deg);
    -moz-transform: rotateY(180deg);
    -o-transform: rotateY(180deg);
    -ms-transform: rotateY(180deg);
    unicode-bidi: bidi-override;
    direction: rtl;
    width: 20px;
  }
`;

const NextButton = styled(Button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0px;
  img {
    width: 20px;
  }
`;

const TutorialImg = () => {
  const [toolType] = useGlobalState<'single' | 'divided'>('toolType');
  const carouselRef = useRef<CarouselRef>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleCheckSlideIndex = useCallback((_, current) => {
    setCurrentIndex(current);
  }, []);

  const handleSlickGoToPrev = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  }, [carouselRef]);

  const handleSlickGoToNext = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  }, [carouselRef]);

  return (
    <>
      <TutorialCarousel ref={carouselRef} dots={{ className: 'slide-dots' }} beforeChange={handleCheckSlideIndex}>
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
      </TutorialCarousel>
      {currentIndex === 0 || (
        <PrevButton type="text" onClick={handleSlickGoToPrev}>
          <img src={icons.arrow} />
        </PrevButton>
      )}
      {currentIndex === 1 || (
        <NextButton type="text" onClick={handleSlickGoToNext}>
          <img src={icons.arrow} />
        </NextButton>
      )}
    </>
  );
};

export default TutorialImg;
