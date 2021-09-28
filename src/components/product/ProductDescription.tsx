import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 2em 1em;
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  border-top: 1px solid ${({ theme }) => theme.color.gray300};
`;

interface Props {
  description: string;
}

const ProductDescription = ({ description }: Props) => {
  return <Container>{description}</Container>;
};

export default ProductDescription;
