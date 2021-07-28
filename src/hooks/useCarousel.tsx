import styled from '@emotion/styled';
import { Carousel, Button } from 'antd';
import { CarouselRef } from 'antd/lib/carousel';
import { icons } from 'public/icons';
import React, { useCallback, useRef, useState } from 'react';

const CarouselContainer = styled(Carousel)`
  background-color: ${({ theme }) => theme.color.gray000};
  .slide-dots {
    position: absolute;
    bottom: -2em;
    button {
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
  background-color: transparent !important;
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
  background-color: transparent !important;
  transform: translateY(-50%);
  right: 0px;
  img {
    width: 20px;
  }
`;

interface Props {
  startIndex: number;
  lastIndex: number;
  children: React.ReactNode;
}

export const useCarousel = () => {
  const AntdCarousel = ({ children, lastIndex, startIndex }: Props) => {
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
        <CarouselContainer ref={carouselRef} dots={{ className: 'slide-dots' }} beforeChange={handleCheckSlideIndex}>
          {children}
        </CarouselContainer>

        {/* 버튼 */}
        {currentIndex === startIndex || (
          <PrevButton type="text" onClick={handleSlickGoToPrev}>
            <img src={icons.arrow} />
          </PrevButton>
        )}
        {currentIndex === lastIndex || (
          <NextButton type="text" onClick={handleSlickGoToNext}>
            <img src={icons.arrow} />
          </NextButton>
        )}
      </>
    );
  };

  return { AntdCarousel };
};
