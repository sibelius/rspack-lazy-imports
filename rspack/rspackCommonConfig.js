const NodemonPlugin = require('nodemon-webpack-plugin');
const path = require('path');

const cwd = process.cwd();

const isProduction = process.env.NODE_ENV === 'production';

const filename = 'main.js';

const outputPath = path.resolve('build');

/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  context: cwd,
  target: 'node',
  output: {
    path: outputPath,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        exclude: [/node_modules/],
        loader: 'builtin:swc-loader',
        options: {
          rspackExperiments: {
            relay: true,
          },
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
            transform: {
              react: {
                runtime: 'automatic',
                development: !isProduction,
                refresh: !isProduction,
              },
            },
          },
        },
        type: 'javascript/auto',
      },
      {
        test: /\.(jpe?g|png|gif|svg|mp3|pdf|csv|xlsx|ttf|woff(2)?)$/i,
        type: 'asset',
      },
    ],
  },
  plugins: [
    new NodemonPlugin({
      script: path.resolve('build', filename),
      args: [
        '--enable-source-maps --no-experimental-fetch --trace-warnings --trace-deprecation',
      ],
      verbose: true,
      env: {
        NODE_OPTIONS:
          '--enable-source-maps --no-experimental-fetch --trace-warnings --trace-deprecation',
      },
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.mjs'],
    fallback: {
      fs: false,
    },
  },
  stats: {
    warnings: false,
  },
};
