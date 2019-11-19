const path = require('path');
const webpack = require('webpack');

module.exports = env => {
  return {
    entry: './src/music/tone.ts',
    module: {
      rules: [
        {
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    mode: "production",
    output: {
      filename: 'tone.js',
      path: path.resolve(__dirname, 'dist', 'static'),
    },
    plugins: [
      new webpack.DefinePlugin({
        MASTER: JSON.stringify(!!env.master),
        DEV: JSON.stringify(!!env.dev),
      })
    ]
  }
};
