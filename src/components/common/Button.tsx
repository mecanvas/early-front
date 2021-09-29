import styled from '@emotion/styled';

export const Btn = styled.button`
  border-radius: 4px;
  font-weight: bold;
  font-size: 1.1rem;
  background: ${({ theme }) => theme.color.black};
  color: ${({ theme }) => theme.color.white};
  margin-top: 1em;
  width: 150px;
  padding: 0.5em 2em;
  cursor: pointer;

  &:hover {
    opacity: 0.5;
  }
`;
