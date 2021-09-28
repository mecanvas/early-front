import styled from '@emotion/styled';
import { Card } from 'antd';
import Link from 'next/link';
import { ProductList } from 'src/interfaces/ProductInterface';

const { Meta } = Card;

const ProductCardContainer = styled.div`
  display: grid;
  gap: 0.5em;
  row-gap: 3em;
  grid-template-columns: repeat(3, 1fr);

  @media all and (max-width: ${({ theme }) => theme.size.md}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media all and (max-width: ${({ theme }) => theme.size.xs}) {
    grid-template-columns: repeat(1, 300px);
  }
`;

const ProductCard = styled(Card)`
  max-width: 280px;
  margin: 0 0.5em;
  img {
    padding: 0.7em;
  }
  .ant-card-body {
    padding: 1em !important;
  }
`;

const ProductMeta = styled(Meta)`
  .ant-card-meta-title {
    font-size: 15px;
    margin: 0;
  }
  .ant-card-meta-description {
    font-size: 13px;
  }
`;

const ProductMore = styled.div`
  width: 130px;
  margin: 2em auto;
  button {
    width: 100%;
    padding: 0.3em 0.8em;
    color: ${({ theme }) => theme.color.black};
    background-color: ${({ theme }) => theme.color.white};
    border: 1px solid ${({ theme }) => theme.color.gray500};
    outline: none;
    cursor: pointer;
  }
`;

interface Props {
  title: string;
  productList: ProductList[];
  moreLink?: string;
}

const HomeProducts = ({ title, productList, moreLink }: Props) => {
  return (
    <>
      <h1>{title}</h1>
      <ProductCardContainer>
        {productList.map((lst) => (
          <Link href={`/product/${lst.id}`} key={lst.id}>
            <ProductCard hoverable cover={<img alt={lst.title} src={lst.thumb} />}>
              <ProductMeta title={lst.title} description={lst.meta} />
              <small>{lst.price.toLocaleString()}W</small>
            </ProductCard>
          </Link>
        ))}
      </ProductCardContainer>
      {moreLink && (
        <ProductMore>
          <Link href={moreLink}>
            <button type="button">More View</button>
          </Link>
        </ProductMore>
      )}
    </>
  );
};

export default HomeProducts;
