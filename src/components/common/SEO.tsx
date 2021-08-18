import React from 'react';
import { NextSeo } from 'next-seo';
import { MAIN_IMAGE_URL, MAIN_TITLE } from 'src/constants/SeoOnly';

interface Props {
  title: string;
  desc: string;
  img?: string;
}

const SEO = ({ title, desc, img }: Props) => {
  return (
    <NextSeo
      title={`얼리 21 | ${title}`}
      description={desc}
      openGraph={{
        title,
        description: desc,
        images: [
          {
            url: img || MAIN_IMAGE_URL,
            alt: desc || MAIN_TITLE,
          },
        ],
      }}
    />
  );
};

export default SEO;
