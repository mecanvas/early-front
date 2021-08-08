import React from 'react';
import { NextSeo } from 'next-seo';

interface Props {
  title?: string;
  desc?: string;
}

const SEO = ({ title, desc }: Props) => {
  return <NextSeo title={`얼리 21 | ${title}`} description={desc} />;
};

export default SEO;
