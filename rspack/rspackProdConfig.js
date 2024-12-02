const path = require('path');
const { merge } = require('webpack-merge');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const rspackCommonConfig = require('./rspackCommonConfig');

const cwd = process.cwd();

/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = merge(rspackCommonConfig, {
  entry: {
    main: [
      './src/index.ts',
    ],
  },
  output: {
    path: path.join(cwd, 'build'),
  },
  plugins: [
    new CleanWebpackPlugin({ verbose: true }),
  ],
  optimization: {
    minimize: true,
  },
});
