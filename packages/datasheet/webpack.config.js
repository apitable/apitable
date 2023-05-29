const path = require('path')
const loaderUtils= require('loader-utils')


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
  )
}


// Overrides for css-loader plugin
function cssLoaderOptions(modules) {
  return {
    ...modules,
    exportLocalsConvention: 'camelCaseOnly',
    mode: 'local'
  }
}


/**
 * In ie11, there will be a shadow error. According to the discussion in the issue, the following polyfill can be used to solve it
 */
const compatibleIE11 = async (config) => {
  const originalEntry = config.entry
  const entries = await originalEntry()
  const mainJs = entries['main.js']

  if (mainJs && !mainJs.includes('./utils/polyfills.js')) {
    mainJs.unshift('./utils/polyfills.js')
  }

  return entries
}

const setResolveAlias = (config) => {
  config.resolve.alias.react = path.resolve(__dirname, '../../', 'node_modules', 'react')
  config.resolve.alias['react-dom'] = path.resolve(__dirname, '../../', 'node_modules', 'react-dom')
  config.resolve.alias = {
    ...config.resolve.alias,
    pc: path.resolve(__dirname, './src/pc'),
    static: path.resolve(__dirname, './public/static'),
    enterprise: process.env.IS_ENTERPRISE === 'true' ? path.resolve(__dirname, './src/modules/enterprise') : path.resolve(__dirname, './src/noop')
  }
}

const setRules = (config) => {
  const oneOfRules = config.module.rules.find((rule) => typeof rule.oneOf === 'object')

  if (oneOfRules) {
    const moduleLessRule = oneOfRules.oneOf.find((rule) => {
      return regexEqual(rule.test, /\.module\.less$/)
    })
    if (moduleLessRule) {
      const cssLoader = moduleLessRule.use.find(({loader}) => loader.includes('css-loader'))
      if (cssLoader) {
        cssLoader.options = {
          ...cssLoader.options,
          // Customize the class names of CSS modules.
          modules: cssLoaderOptions(cssLoader.options.modules)
        }
      }
    }
  }

  config.module.rules.push({
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    use: [
      {
        loader: 'babel-loader'
      },
      {
        loader: '@svgr/webpack',
        options: {
          babel: false,
          icon: true
        }
      },
      {
        loader: 'svgo-loader',
        options: {
          plugins: [
            {name: 'removeNonInheritableGroupAttrs'},
            {name: 'removeXMLNS'},
            {name: 'collapseGroups'},
            {name: 'removeStyleElement'},
            {name: 'removeAttrs', params: {attrs: '(stroke|fill)'}}
          ]
        }
      }
    ]
  })
}

const isProd = process.env.NODE_ENV === 'production'

module.exports = (config, options) => {
  // TODO: set symlinks false cause nextjs Fast Refresh not working
  if (process.env.IS_ENTERPRISE === 'true') {
    config.resolve.symlinks = false
  }

  config.entry = compatibleIE11(config)

  setResolveAlias(config)

  setRules(config)

  const fallback = config.resolve.fallback || {}
  Object.assign(fallback, {
    path: require.resolve('https-browserify'),
    zlib: require.resolve('browserify-zlib'),
    http: require.resolve('stream-http'),
    stream: require.resolve('stream-browserify'),
    url: require.resolve('url/'),
    util: require.resolve('util/')
  })

  config.resolve.fallback = fallback

  const {webpack} = options

  config.plugins.push(
    new webpack.IgnorePlugin({
      resourceRegExp: /canvas|jsdom/,
      contextRegExp: /konva/
    }),
    new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
      const mod = resource.request.replace(/^node:/, '')

      switch (mod) {
        case 'path':
          resource.request = 'path-browserify'
          break
        default:
          throw new Error(`Not found ${mod}`)
      }
    }))

  if (!isProd) {
    const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
    config.plugins.push(new ForkTsCheckerWebpackPlugin({
      typescript: {
        memoryLimit: 5000,
        mode: 'write-references'
      },
      async: true,
    }))
  }

  return config
}
