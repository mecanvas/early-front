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
  padding-top: 2em;
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    padding-top: 2em;
    margin-top: 1em;
  }
  span {
    position: absolute;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    top: 10px;
    left: 10px;
    img:nth-of-type(1) {
      position: absolute;
      width: 22px;
      right: 25px;
      cursor: pointer;
      top: -5px;
    }
  }
`;

export const FirstFramePreview = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.color.white};
  width: 100%;
  max-height: 600px;
  border: 1px solid ${({ theme }) => theme.color.gray400};
  img:nth-of-type(1) {
    width: 100%;
    object-fit: fill;
  }
  @media all and (max-width: ${({ theme }) => theme.size.sm}) {
    width: 100%;
    max-height: 400px;
    img:nth-of-type(1) {
      width: 100%;
      object-fit: contain;
      max-height: 400px;
    }
  }
`;

export const FirstGuideText = styled.h5``;

export const FirstSelectedFrameList = styled.div``;
