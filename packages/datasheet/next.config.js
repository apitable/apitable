/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* eslint no-undef: 0 */
const withLess = require('next-with-less');
const path = require('path');
const withTM = require('next-transpile-modules');
const withBundleAnalyzer = require('@next/bundle-analyzer');
const isProd = process.env.NODE_ENV === 'production';
const getWebpackConfig = require('./webpack.config');
const { withSentryConfig } = require('@sentry/nextjs');

const sentryWebpackPluginOptions = {
  disableServerWebpackPlugin: false,
  widenClientFileUpload: true,
  disableClientWebpackPlugin: false,
  org: process.env.SENTRY_ORG ??  'sentry',
  project: process.env.SENTRY_PROJECT  ?? 'web-server',
  url: process.env.SENTRY_URL  ??  'https://sentry.vika.ltd',
  // An auth token is required for uploading source maps.
  dsn: process.env.SENTRY_CONFIG_DSN ?? 'https://51c44e606db14f34963bd4ba64d86410@sentry.vika.ltd/3',
  authToken: process.env.SENTRY_AUTH_TOKEN_VIKA ?? '',
  release: process.env.WEB_CLIENT_VERSION ?? '',
  silent: false, // Suppresses all logs
  hideSourceMaps: true,
  debug: true

  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

const nextConfig = {
  // Use the CDN in production and localhost for development.
  assetPrefix: isProd ? process.env.NEXT_ASSET_PREFIX : '',
  // Possible fix for  timeout error in static page generation
  env: {
      SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN_VIKA
  },
  staticPageGenerationTimeout: 120,
  webpack: getWebpackConfig,
  images: {
    unoptimized: true,
    domains: ['s4.vika.cn', 's1.vika.cn', 'mp.weixin.qq.com', 'localhost', 's1.apitable.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
        pathname: '/vk-assets-ltd/**'
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/vk-assets-ltd/**'
      },
      {
        protocol: 'http',
        hostname: '**',
        pathname: '/assets/**'
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/assets/**'
      }
    ]
  },
  swcMinify: true,
  poweredByHeader: false,
  publicRuntimeConfig: {
    // use local public folder for editions, e.g. apitable
    staticFolder() {
      if (process.env.USE_CUSTOM_PUBLIC_FILES === 'true') return '';

      return isProd ? process.env.NEXT_PUBLIC_ASSET_PREFIX : '';
    }
  },
  sentry: {
    disableServerWebpackPlugin: false,
    disableClientWebpackPlugin: false
  },
  distDir: 'web_build',
  output: 'standalone',
  experimental: {
    // runtime: 'nodejs', // 'node.js' (default) | experimental-edge
    esmExternals: true,
    // this includes files from the monorepo base two directories up
    outputFileTracingRoot: path.join(__dirname, '../../')
  }
};

/** @type {import('next').NextConfig} */
const plugins = [
  (nextConfigonfig) =>
    withLess({
      ...nextConfigonfig,
      lessLoaderOptions: {
        lessOptions: {
          paths: [path.resolve(__dirname, './src')]
        }
      }
    }),

  withTM(['antd', 'antd-mobile', 'rc-util', 'rc-picker', 'rc-notification', 'rc-calendar', 'purify-ts']),
  withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })
];

const config = () => plugins.reduce((acc, next) => next(acc), nextConfig);
module.exports = isProd ? withSentryConfig(config, sentryWebpackPluginOptions, sentryWebpackPluginOptions) : config;
