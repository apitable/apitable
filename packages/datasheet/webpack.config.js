const path = require('path');
const WebpackBar = require('webpackbar');

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

class WasmChunksFixPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('WasmChunksFixPlugin', (compilation) => {
      compilation.hooks.processAssets.tap({ name: 'WasmChunksFixPlugin' }, (assets) =>
        Object.entries(assets).forEach(([pathname, source]) => {
          if (!pathname.match(/\.wasm$/)) return;
          // https://github.com/hasharchives/wasm-ts-esm-in-node-jest-and-nextjs/blob/main/web-app/pages/api/wasm-package-answer.ts
          // compilation.deleteAsset(pathname);
          const name = pathname.split('/')[1];
          const info = compilation.assetsInfo.get(pathname);
          compilation.emitAsset(name, source, info);
        }),
      );
    });
  }
}

// Overrides for css-loader plugin
function cssLoaderOptions(modules) {
  return {
    ...modules,
    exportLocalsConvention: 'camelCaseOnly',
    mode: 'local',
  };
}

/**
 * In ie11, there will be a shadow error. According to the discussion in the issue, the following polyfill can be used to solve it
 */
const compatibleIE11 = async (config) => {
  const originalEntry = config.entry;
  const entries = await originalEntry();
  const mainJs = entries['main.js'];

  if (mainJs && !mainJs.includes('./utils/polyfills.js')) {
    mainJs.unshift('./utils/polyfills.js');
  }

  return entries;
};

const setResolveAlias = (config, options) => {
  config.resolve.alias.react = path.resolve(__dirname, '../../', 'node_modules', 'react');
  config.resolve.alias['react-dom'] = path.resolve(__dirname, '../../', 'node_modules', 'react-dom');
  config.resolve.alias = {
    ...config.resolve.alias,
    api: path.resolve(__dirname, './src/modules/api'),
    pc: path.resolve(__dirname, './src/pc'),
    static: path.resolve(__dirname, './public/static'),
    enterprise: process.env.IS_ENTERPRISE === 'true' ? path.resolve(__dirname, './src/modules/enterprise') : false,
    // JSON cannot use tree shaking, it needs to be configured here
    '@apitable/i18n-lang/src/config/strings.json': options.isServer ? '@apitable/i18n-lang/src/config/strings.json' : false,
  };
};

const setRules = (config) => {
  const oneOfRules = config.module.rules.find((rule) => typeof rule.oneOf === 'object');

  if (oneOfRules) {
    const moduleLessRule = oneOfRules.oneOf.find((rule) => {
      return regexEqual(rule.test, /\.module\.less$/);
    });
    if (moduleLessRule) {
      const cssLoader = moduleLessRule.use.find(({ loader }) => loader.includes('css-loader'));
      if (cssLoader) {
        cssLoader.options = {
          ...cssLoader.options,
          // Customize the class names of CSS modules.
          modules: cssLoaderOptions(cssLoader.options.modules),
        };
      }
    }
  }

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
            { name: 'removeNonInheritableGroupAttrs' },
            { name: 'removeXMLNS' },
            { name: 'collapseGroups' },
            { name: 'removeStyleElement' },
            { name: 'removeAttrs', params: { attrs: '(stroke|fill)' } },
          ],
        },
      },
    ],
  });
};

const isProd = process.env.NODE_ENV === 'production';

/**
 * @param {import('webpack').Configuration} config - The base Webpack configuration provided by Next.js.
 * @param {import('next').NextConfig} options - Options object containing Next.js options.
 * @returns {import('webpack').Configuration} Modified Webpack configuration.
 */
module.exports = (config, options) => {
  // TODO: set symlinks false cause nextjs Fast Refresh not working
  // if (process.env.IS_ENTERPRISE === 'true') {
  //   config.resolve.symlinks = false
  // }
  // config.entry = compatibleIE11(config);

  // if (!options.isServer) {
  //     config.externals = config.externals.concat(...[
  //         function ({context, request}, callback) {
  //             if (/^@apitable\/databus-wasm-nodejs$/.test(request)) {
  //                 // 'commonjs ' +
  //                 return callback(null, request);
  //             }
  //             callback();
  //         }])
  // }

  // if(options.isServer) {
  //     config.externals = config.externals.concat(...[
  //         function ({context, request}, callback) {
  //             if (/^@apitable\/databus-wasm-web$/.test(request)) {
  //                 return callback(null, 'commonjs ' + request);
  //             }
  //             callback();
  //         }])
  // }
  setResolveAlias(config, options);

  setRules(config);

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

  const { webpack } = options;

  config.experiments = {
    ...config.experiments,
    asyncWebAssembly: true,
    // layers: true,
  };

  if (isProd && options.isServer) {
    config.output.webassemblyModuleFilename = '../chunks/[id].wasm';
    config.plugins.push(new WasmChunksFixPlugin());
  } else {
    if (options.isServer) {
      // config.output.webassemblyModuleFilename = "../chunks/[id].wasm";
      config.output.webassemblyModuleFilename = '../is_sever_development_[id].wasm';
      config.plugins.push(new WasmChunksFixPlugin());
    } else {
      config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';
    }
  }

  config.plugins.push(
    new WebpackBar({
      name: config.name,
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /canvas|jsdom/,
      contextRegExp: /konva/,
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
    }),
  );

  // if (!isProd) {
  //   const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
  //   config.plugins.push(new ForkTsCheckerWebpackPlugin({
  //     typescript: {
  //       memoryLimit: 5000,
  //       mode: 'write-references'
  //     },
  //     async: true,
  //   }))
  // }

  return config;
};
