const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const fs = require('fs');

const getEntrys = () => {
  let srcPath = path.join(__dirname, './src/pages');
  const pages = fs.readdirSync(srcPath);
  const result = {};
  pages.map(page => {
    result[page] = path.join(srcPath, `${page}/index.js`);
  });
  return result;
}

const entrys = getEntrys();
const getHtmls = () => {
  const result = [];
  for (const file in entrys) {
    console.log('file', file, entrys[file]);
    result.push(new HtmlWebpackPlugin({
      title: 'htmlParser',
      template: path.join(__dirname, `src/pages/${file}/index.html`),
      filename: `${file}.html`,
      hash: true
    }));
  }
  return result;
}

const config = {
  entry: entrys,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      { test: /\.less$/, use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
        { loader: 'less-loader' },
      ]},
      { test: /\.css$/, use: [
        { loader: 'style-loader' },
        {
          loader: 'css-loader',
          options: {
            modules: true
          }
        }
      ]},
      { test: /\.ejs$/, use: {loader: 'ejs-loader?variable=data'} },
      { test: /\.ts$/, use: 'ts-loader' },
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [
    ...getHtmls(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 9999,
    open:true,
    hot: true
  }
};

module.exports = config;


