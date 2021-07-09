const path = require('path');
const glob = require('glob');

const mode = process.env.ENV || 'production';

const entries = glob
  .sync('./src/js-entry-points/*.js')
  .reduce((entries, entry) => {
    const entryName = path.parse(entry).name

    console.log(JSON.stringify(entries, null, 2));

    return Object.assign(entries, { [entryName]: entry });
  }, {});

const webpackConfig = {
  mode,
  entry: entries,
  output: {
    filename: '[name].bundle.js',
    // sourceMapFilename: '[name].bundle.map'
  },
};

module.exports = webpackConfig;
