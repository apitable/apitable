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

/** @type {import('next').NextConfig} */
/* eslint no-undef: 0 */
const withLess = require('next-with-less')
const path = require('path')
const loaderUtils = require('loader-utils')
const withPlugins = require('next-compose-plugins')
const withTM = require('next-transpile-modules')
const withBundleAnalyzer = require('@next/bundle-analyzer')
const isProd = process.env.NODE_ENV === 'production'
const getWebpackConfig = require('./webpack.config')
const {withSentryConfig} = require("@sentry/nextjs");


const plugins = [
  [
    withLess, {
    lessLoaderOptions: {
      lessOptions: {
        paths: [path.resolve(__dirname, './src')]
      }
    }
  }
  ],
  [
    withTM(['@apitable/components', 'antd', 'rc-pagination', 'rc-util', 'rc-picker', 'rc-notification', '@ant-design/icons', 'rc-calendar'])
  ],
  [
    withBundleAnalyzer({enabled: process.env.ANALYZE === 'true'})
  ]
]


const _withSentryConfig = process.env.SENTRY_CONFIG_AUTH_TOKEN ? withSentryConfig : (nextConfig, sentryConfig) => {
  return nextConfig
}

module.exports = withPlugins(plugins, _withSentryConfig({
  // Use the CDN in production and localhost for development.
  assetPrefix: isProd ? process.env.NEXT_ASSET_PREFIX : '',
  images: {
    unoptimized: true,
    domains: ['s4.vika.cn', 's1.vika.cn', 'mp.weixin.qq.com', 'localhost', 'legacy-s1.apitable.com', 's1.apitable.com'],
    remotePatterns: [{
      protocol: 'http',
      hostname: '**',
      pathname: '/vk-assets-ltd/**'
    }, {
      protocol: 'https',
      hostname: '**',
      pathname: '/vk-assets-ltd/**'
    }, {
      protocol: 'http',
      hostname: '**',
      pathname: '/assets/**'
    }, {
      protocol: 'https',
      hostname: '**',
      pathname: '/assets/**'
    }]
  },
  poweredByHeader: false,
  publicRuntimeConfig: {
    // use local public folder for editions, e.g. apitable
    staticFolder() {
      if (process.env.USE_CUSTOM_PUBLIC_FILES === 'true') return ''

      return isProd ? process.env.NEXT_PUBLIC_ASSET_PREFIX : ''
    }
  },
  webpack: getWebpackConfig,
  distDir: 'web_build',
  output: 'standalone',
  experimental: {
    esmExternals: true,
    // this includes files from the monorepo base two directories up
    outputFileTracingRoot: path.join(__dirname, '../../')
  }
}, {
  url: process.env.SENTRY_CONFIG_URL,
  authToken: process.env.SENTRY_CONFIG_AUTH_TOKEN,
  project: 'web-server',
  dsn: process.env.SENTRY_CONFIG_DSN,
  org: 'sentry',
  release: process.env.BUILD_VERSION
}))
