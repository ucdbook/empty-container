const path = require('path');
const package = require('./package.json');
module.exports = {
  publicPath: `/`, // 子应用base路径， 默认为包名
  outputPath: './dist', // 打包文件输出地址；配置值时，基于项目根目录，默认为：'./libDist'
  packEntry: {
    'EmptyContainer': path.join(__dirname, 'src/components/EmptyContainer'),
    'ContentEditable': path.join(__dirname, 'src/components/ContentEditable')
  },
  lessVariables: {},
  isBundleAnalyzerPlugin: true,
  webpackConfig: (config, options) => {
    config.resolve.alias = {
      '@': path.join(__dirname, 'src'),
      [package.name]: path.join(__dirname),
    };

    return config;
  },
};
