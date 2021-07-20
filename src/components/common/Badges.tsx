import styled from '@emotion/styled';
import { Badge } from 'antd';
import React from 'react';

const BadgeStyle = styled(Badge)`
  sup {
    background-color: ${({ theme }) => theme.color.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 25px;
    border-radius: 9999px;
  }
  p {
    line-height: 18px;
    font-size: 18px;
    color: white;
  }
`;

const Badges = ({ count, children }: { count: number; children: React.ReactChild }) => {
  return <BadgeStyle count={count}>{children}</BadgeStyle>;
};
