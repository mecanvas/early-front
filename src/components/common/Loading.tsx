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

const LoaderContainer = styled.div`
  position: absolute;
  z-index: 30;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 250px;
  margin: 0 auto;
  width: 100%;
  text-align: center;
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
  progressPercentage?: number;
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
      <Loader>
        <span></span>
      </Loader>
      <animated.p style={textAni}>{text ? text : '잠시만 기다려 주세요. '}</animated.p>
      <h5>{progressPercentage}%</h5>
    </LoaderContainer>
  );
};

export default Loading;
