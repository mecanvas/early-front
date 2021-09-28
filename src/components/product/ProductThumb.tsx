import styled from '@emotion/styled';
import React, { useCallback, useState } from 'react';

const Container = styled.div`
  display: flex;
  @media all and (max-width: ${({ theme }) => theme.size.md}) {
    justify-content: center;
    align-items: center;
    flex-direction: column-reverse;
  }
`;

const Thumb = styled.img`
  width: 98%;
  height: 100%;
  max-width: 450px;
  max-height: 450px;
`;

const SubThumbList = styled.div`
  display: flex;
  flex-direction: column;
  @media all and (max-width: ${({ theme }) => theme.size.md}) {
    flex-direction: row;
  }
  img {
    width: 80px;
    cursor: pointer;
    margin-right: 10px;
    @media all and (max-width: ${({ theme }) => theme.size.md}) {
      margin-top: 0.6em;
      margin-bottom: 0.6em;
    }
  }
  img ~ img {
    margin-top: 0.4em;
  }
`;

interface Props {
  thumb: string;
  subThumb: string[];
  alt: string;
}

const ProductThumb = ({ thumb, subThumb, alt }: Props) => {
  const [showThumb, setShowThumb] = useState(thumb);

  const handleImgSelect = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    const { src } = e.currentTarget;
    setShowThumb(src);
  }, []);

  return (
    <Container>
      <SubThumbList>
        {subThumb.map((lst) => (
          <img onClick={handleImgSelect} src={lst} alt={alt} style={{ opacity: showThumb === lst ? 1 : 0.4 }} />
        ))}
      </SubThumbList>
      <Thumb src={showThumb} alt={alt} />
    </Container>
  );
};

export default ProductThumb;
