import React from 'react';
import styled from '@emotion/styled';
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

const Loader = styled.span`
  z-index: 30;
  width: 40px;
  height: 40px;
  position: absolute;
  border: 4px solid ${({ theme }) => theme.color.primary};
  top: 50%;
  left: 50%;
  animation: ${LoaderAnimation} 2s infinite ease;

  span {
    vertical-align: top;
    display: inline-block;
    width: 100%;
    background-color: ${({ theme }) => theme.color.primary};
    animation: ${LoaderInnerAnimation} 2s infinite ease-in;
  }
`;

const Loading = () => {
  return (
    <Loader>
      <span></span>
    </Loader>
  );
};

export default Loading;
