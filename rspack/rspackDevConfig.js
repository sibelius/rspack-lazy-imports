const { merge } = require('webpack-merge');

const rspackCommonConfig = require('./rspackCommonConfig');
const { getWebpackWatchOptions} = require('./getWebpackWatchOptions')

const PORT = parseInt(process.env.PORT || '4459', 10);

/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = merge(rspackCommonConfig, {
  entry: {
    main: [
      '@rspack/core/hot/poll?100',
      './src/index.ts',
    ],
  },
  watch: true,
  devServer: {
    port: PORT,
    allowedHosts: 'all',
    historyApiFallback: {
      disableDotRule: true,
    },
    devMiddleware: {
      writeToDisk: true,
    },
    hot: true,
    compress: true,
    liveReload: false,
  },
  watchOptions: getWebpackWatchOptions(),
  experiments: {
    lazyCompilation: {
      imports: true,
      entries: false,
    }
  },
});
