import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { List } from 'antd';

export const TabTitle = styled.span`
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    font-size: 13px;
  }
`;

export const FirstContent = styled.div`
  display: grid;
  gap: 1em;
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    justify-content: space-between;
  }
`;

export const FirstListItems = styled(List.Item)<{ selected?: boolean }>`
  cursor: pointer;
  ${({ selected, theme }) =>
    selected &&
    css`
      background-color: ${theme.color.gray000};
      div,
      small {
        color: ${theme.color.gray600};
      }
      span {
        svg {
          font-size: 20px;
          path {
            color: ${theme.color.primary};
          }
        }
      }
    `};

  &:hover {
    background-color: ${({ theme }) => theme.color.gray000};
  }
`;

export const FirstFrameWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.color.gray100};
  border-radius: 8px;
  padding: 2em 0;
  min-height: 600px;
  max-height: 600px;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    padding: 1em 0;
    margin-top: 1em;
    min-height: 400px;
    max-height: 400px;
  }
  span {
    position: absolute;
    top: 10px;
    left: 10px;
  }
`;

export const FirstFramePreview = styled.div<{ width: number; height: number }>`
  position: relative;
  ${({ width, height, theme }) =>
    width &&
    height &&
    css`
      background-color: ${theme.color.white};
      width: ${width}px;
      height: ${height}px;
      border: 1px solid ${theme.color.gray400};
      img:nth-of-type(1) {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      @media all and (max-width: ${theme.size.sm}) {
        width: ${width / 1.5}px;
        height: ${height / 1.5}px;
      }
    `}

  img:nth-of-type(2) {
    cursor: pointer;
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
  }
`;

export const FirstGuideText = styled.h5``;

export const FirstSelectedFrameList = styled.div``;
