import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Btn = styled.button<{
  width?: number;
  padding?: string;
  margin?: string;
  fontSize?: 'small' | 'medium';
  bg?: string;
  color?: string;
  borderColor?: string;
  disabled?: boolean;
}>`
  border-radius: 4px;
  border: 1px solid ${({ borderColor }) => (borderColor ? `${borderColor}` : 'none')};
  font-weight: bold;
  margin: ${({ margin }) => (margin ? `${margin}` : '1em 0 0 0')};
  font-size: ${({ fontSize }) => {
    if (fontSize === 'small') {
      return '0.8rem';
    }
    if (fontSize === 'medium') {
      return '1rem';
    }
    return '1rem';
  }};
  background: ${({ bg, theme }) => (bg ? `${bg}` : theme.color.gray900)};
  color: ${({ color, theme }) => (color ? `${color}` : theme.color.white)};
  width: ${({ width }) => (width ? `${width}px` : '150px')};
  padding: ${({ padding }) => (padding ? `${padding}` : '0.5em 2em')};
  cursor: pointer;

  ${({ disabled }) => {
    if (disabled) {
      return css`
        pointer-events: none;
        opacity: 0.5;
      `;
    }
  }}

  &:hover {
    transition: all 300ms;
    opacity: 0.8;
  }
`;
