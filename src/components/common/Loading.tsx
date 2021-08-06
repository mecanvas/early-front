import React from 'react';
import styled from '@emotion/styled';
import { useSpring, animated } from 'react-spring';
import { keyframes } from '@emotion/react';

const LoaderAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  
  25% {
    transform: rotate(180deg);
  }
  
  50% {
    transform: rotate(180deg);
  }
  
  75% {
    transform: rotate(360deg);
  }
  
  100% {
    transform: rotate(360deg);
  }`;

const LoaderInnerAnimation = keyframes`
 0% {
    height: 0%;
  }
  
  25% {
    height: 0%;
  }
  
  50% {
    height: 100%;
  }
  
  75% {
    height: 100%;
  }
  
  100% {
    height: 0%;
  }
`;

const LoaderBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: #fff;
  opacity: 0.5;
  width: 100%;
  min-height: 100vh;
`;

const LoaderContainer = styled.div`
  position: absolute;
  z-index: 30;
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h5,
  p {
    z-index: 10;
    font-weight: 600;
  }
`;

const Loader = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${({ theme }) => theme.color.primary};
  display: inline-block;
  position: relative;
  top: 50%;
  animation: ${LoaderAnimation} 2s infinite ease;
  margin-bottom: 12px;
  span {
    vertical-align: top;
    display: inline-block;
    width: 100%;
    background-color: ${({ theme }) => theme.color.primary};
    animation: ${LoaderInnerAnimation} 2s infinite ease-in;
  }
`;

interface Props {
  loading: boolean;
  text?: string;
  progressPercentage?: number | null;
}

const Loading = ({ loading, text, progressPercentage }: Props) => {
  const textAni = useSpring({
    to: { opacity: 1, translateY: 0 },
    from: { opacity: 0, translateY: 20 },
    delay: 500,
    config: { duration: 1000 },
  });

  if (!loading) {
    return null;
  }

  return (
    <LoaderContainer>
      <LoaderBg />
      <Loader>
        <span></span>
      </Loader>
      <animated.p style={textAni}>{text ? text : '잠시만 기다려 주세요!'}</animated.p>
      {progressPercentage && <h5>{progressPercentage}%</h5>}
    </LoaderContainer>
  );
};

export default Loading;
