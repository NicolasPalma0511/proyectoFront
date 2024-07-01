const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.resolve.fallback = {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert-browserify'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    url: require.resolve('url/')
  };

  config.plugins = (config.plugins || []).concat([
    new NodePolyfillPlugin()
  ]);

  return config;
};
