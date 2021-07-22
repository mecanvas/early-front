const withPlugins = require('next-compose-plugins');
const withCss = require('@zeit/next-css');
const withLess = require('@zeit/next-less');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack.config');
const withImages = require('next-images');

const nextConfig = {
  target: 'serverless',
  compress: true,
  webpack(config) {
    return merge(config, webpackConfig);
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/tool',
        permanent: true,
      },
    ];
  },
};

module.exports = withPlugins(
  [
    [
      withLess,
      {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
        webpack(config, { isServer }) {
          if (isServer) {
            const antStyles = /(antd\/.*?\/style).*(?<![.]js)$/;
            const origExternals = [...config.externals];
            config.externals = [
              (context, request, callback) => {
                if (request.match(antStyles)) return callback();
                if (typeof origExternals[0] === 'function') {
                  origExternals[0](context, request, callback);
                } else {
                  callback();
                }
              },
              ...(typeof origExternals[0] === 'function' ? [] : origExternals),
            ];

            config.module.rules.unshift({
              test: antStyles,
              use: 'null-loader',
            });
          }
          return config;
        },
      },
    ],
    [withCss],
    [withBundleAnalyzer],
    [withImages],
  ],
  nextConfig,
);
