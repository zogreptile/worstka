const path = require('path');
const glob = require('glob');

const mode = process.env.ENV || 'production';

const entries = glob
  .sync('./src/js/webpack/*/index.js')
  .reduce((entries, entry) => {
    // в качестве имени используется имя директории
    // для примера ниже это будет about
    // ./src/js/webpack/about/index.js
    const [entryName] = path.parse(entry).dir.split('/').slice(-1);

    return Object.assign(entries, { [entryName]: entry });
  }, {});

const webpackConfig = {
  mode,
  entry: entries,
  output: {
    filename: '[name].js',
  },
};

module.exports = webpackConfig;
