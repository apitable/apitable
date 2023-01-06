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
/*eslint no-undef: 0*/
const withLess = require('next-with-less');
const path = require('path');
const loaderUtils = require('loader-utils');
const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules');
const withBundleAnalyzer = require('@next/bundle-analyzer');
const isProd = process.env.NODE_ENV === 'production';
const {withSentryConfig} = require("@sentry/nextjs");

const isIntranetEnv = process.env.BUILD_VERSION?.includes('test') || process.env.BUILD_VERSION?.includes('op_')

/**
 * Stolen from https://stackoverflow.com/questions/10776600/testing-for-equality-of-regular-expressions
 */
const regexEqual = (x, y) => {
  return (
    x instanceof RegExp &&
    y instanceof RegExp &&
    x.source === y.source &&
    x.global === y.global &&
    x.ignoreCase === y.ignoreCase &&
    x.multiline === y.multiline
  );
};

/**
 * Generate context-aware class names when developing locally
 */
const localIdent = (loaderContext, localIdentName, localName, options) => {
  return (
    loaderUtils
      .interpolateName(loaderContext, `[folder]_[name]__${localName}`, options)
      // Webpack name interpolation returns `about_about.module__root` for
      // `.root {}` inside a file named `about/about.module.css`. Let's simplify
      // this.
      .replace(/\.module_/, '_')
      // Replace invalid symbols with underscores instead of escaping
      // https://mathiasbynens.be/notes/css-escapes#identifiers-strings
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      // "they cannot start with a digit, two hyphens, or a hyphen followed by a digit [sic]"
      // https://www.w3.org/TR/CSS21/syndata.html#characters
      .replace(/^(\d|--|-\d)/, '__$1')
  );
};

// Overrides for css-loader plugin
function cssLoaderOptions(modules) {
  const {getLocalIdent, ...others} = modules;
  return {
    ...others,
    getLocalIdent: getLocalIdent || localIdent,
    exportLocalsConvention: 'camelCaseOnly',
    mode: 'local',
  };
}

const plugins = [
  [withLess, {lessLoaderOptions: {lessOptions: {paths: [path.resolve(__dirname, './src')]}}}],
  [withTM(['@apitable/components', 'antd', 'rc-pagination', 'rc-util', 'rc-picker', 'rc-notification', '@ant-design/icons', 'rc-calendar'])],
  [withBundleAnalyzer({enabled: process.env.ANALYZE === 'true',})],
];

// use local public folder for editions, e.g. apitable
const getStaticFolder = () => {
  if (process.env.USE_CUSTOM_PUBLIC_FILES === 'true') return '';

  return isProd ? process.env.NEXT_PUBLIC_ASSET_PREFIX : '';
};

const _withSentryConfig = isProd && !isIntranetEnv ? withSentryConfig : (nextConfig, sentryConfig) => {
  return nextConfig
}

module.exports = withPlugins(plugins, _withSentryConfig({
  // Use the CDN in production and localhost for development.
  assetPrefix: isProd ? process.env.NEXT_ASSET_PREFIX : '',
  images: {
    domains: ['s4.vika.cn', 's1.vika.cn', 'mp.weixin.qq.com', 'localhost'],
    remotePatterns: [{
      protocol: 'http',
      hostname: '**',
      pathname: '/vk-assets-ltd/**',
    }, {
      protocol: 'https',
      hostname: '**',
      pathname: '/vk-assets-ltd/**',
    },{
      protocol: 'http',
      hostname: '**',
      pathname: '/assets/**',
    }, {
      protocol: 'https',
      hostname: '**',
      pathname: '/assets/**',
    }]
  },
  poweredByHeader: false,
  publicRuntimeConfig: {
    staticFolder: getStaticFolder(),
  },
  webpack(config, options) {
    config.resolve.symlinks = false
    const originalEntry = config.entry;

    config.entry = async () => {
      /**
       * In ie11, there will be a shadow error. According to the discussion in the issue, the following polyfill can be used to solve it
       */
      const entries = await originalEntry();

      const mainJs = entries['main.js'];
      if (mainJs && !mainJs.includes('./utils/polyfills.js')) {
        mainJs.unshift('./utils/polyfills.js');
      }

      return entries;
    };

    config.resolve.alias['react'] = path.resolve(__dirname, '../../', 'node_modules', 'react');
    config.resolve.alias['react-dom'] = path.resolve(__dirname, '../../', 'node_modules', 'react-dom');
    config.resolve.alias = {
      ...config.resolve.alias,
      pc: path.resolve(__dirname, './src/pc'),
      static: path.resolve(__dirname, './public/static'),
      enterprise: process.env.IS_ENTERPRISE === 'true' ? path.resolve(__dirname, './src/modules/enterprise') : path.resolve(__dirname, './src/noop')
    };
    const oneOf = config.module.rules.find((rule) => typeof rule.oneOf === 'object');
    if (oneOf) {
      // Find the module which targets *.scss|*.sass files
      const moduleSassRule = oneOf.oneOf.find((rule) => {
        return regexEqual(rule.test, /\.module\.less$/);
      });
      if (moduleSassRule) {
        // Get the config object for css-loader plugin
        const cssLoader = moduleSassRule.use.find(({loader}) => loader.includes('css-loader'));
        const lessLoader = moduleSassRule.use.find(({loader}) => loader.includes('less-loader'));
        if (cssLoader) {
          cssLoader.options = {
            ...cssLoader.options,
            modules: cssLoaderOptions(cssLoader.options.modules),
          };
        }
        if (lessLoader) {
          lessLoader.options = {
            ...lessLoader.options,
            // paths: [path.resolve(__dirname, './src/pc')],
          };
        }
      }
    }

    // patchWebpackConfig(config, options);

    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
      path: require.resolve('https-browserify'),
      zlib: require.resolve('browserify-zlib'),
      http: require.resolve('stream-http'),
      stream: require.resolve('stream-browserify'),
      url: require.resolve('url/'),
      util: require.resolve('util/'),
    });
    config.resolve.fallback = fallback;
    //

    if (options.isServer) {
      // config.externals = webpackNodeExternals({
      // Uses list to add this modules for server bundle and process.
      // allowlist: [/design-system/],
      // });
    }

    const {webpack} = options;
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /canvas|jsdom/,
        contextRegExp: /konva/
      }),
      new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
        const mod = resource.request.replace(/^node:/, '');

        switch (mod) {
          case 'path':
            resource.request = 'path-browserify';
            break;
          default:
            throw new Error(`Not found ${mod}`);
        }
      }));
    config.module.rules.push({
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      use: [
        {
          loader: 'babel-loader',
        },
        {
          loader: '@svgr/webpack',
          options: {
            babel: false,
            icon: true,
          },
        },
        {
          loader: 'svgo-loader',
          options: {
            plugins: [
              {name: 'removeNonInheritableGroupAttrs'},
              {name: 'removeXMLNS'},
              {name: 'collapseGroups'},
              {name: 'removeStyleElement'},
              {name: 'removeAttrs', params: {attrs: '(stroke|fill)'}},
            ],
          }
        },
      ],
    });

    if (!isProd) {
      const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
      config.plugins.push(new ForkTsCheckerWebpackPlugin({
        typescript: {
          memoryLimit: 5000,
          mode: 'write-references'
        }
      }));
    }

    return config;
  },
  distDir: 'web_build',
  output: 'standalone',
  experimental: {
    esmExternals: true,
    // this includes files from the monorepo base two directories up
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  sentry: {
    disableServerWebpackPlugin: true,
    hideSourceMaps: true
  }
}, {
  url: process.env.SENTRY_CONFIG_URL,
  authToken: process.env.SENTRY_CONFIG_AUTH_TOKEN,
  project: 'web-server',
  dsn: process.env.SENTRY_CONFIG_DSN,
  org: 'sentry',
  release: process.env.BUILD_VERSION
}));
