'use strict';

const { src, dest, series, watch } = require('gulp');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const	nunjucks = require('gulp-nunjucks');
const nunjucksCore = require('nunjucks');
const plumber = require('gulp-plumber');
const del = require('del');
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const postcss = require('gulp-postcss');
const csso = require('gulp-csso');
const autoprefixer = require('autoprefixer');
const prettifyHtml = require('gulp-pretty-html');
const webpack = require('webpack-stream');

let mocks = require('./src/mocks/index.js');

function reloadModule(moduleName){
  delete require.cache[require.resolve(moduleName)]
  console.log('reloadModule: Reloading ' + moduleName + "...");
  return require(moduleName)
}

function updateMocks(done) {
  mocks = reloadModule('./src/mocks/index.js');
  done();
}

const IS_PROD = process.env.ENV === 'production';

function copyStyles() {
  return src('src/styles/pure/**/*.css', { base: 'src/styles/pure' })
    .pipe(dest('dist/css'));
}

function bundleStyles() {
  const sourcemaps = !IS_PROD;

  return src('src/styles/preprocessed/index.scss', { sourcemaps })
    .pipe(plumber())
    .pipe(sassGlob())
    .pipe(sass({
      includePaths: ['node_modules'],
    }).on('error', sass.logError))
    .pipe(gulpIf(IS_PROD, postcss([
      autoprefixer(),
    ])))
    .pipe(gulpIf(IS_PROD, csso({ comments: false })))
    .pipe(rename(IS_PROD ? 'styles.min.css' : 'styles.css'))
    .pipe(dest('dist/css', { sourcemaps }));
}

function copyJs() {
  return src('src/js/pure/**/*.js', { base: 'src/js/pure' })
    .pipe(dest('dist/js'));
}

function bundleJs() {
  const webpackConfig = reloadModule('./webpack.config');

  return src('src/js/webpack/**/*.js',)
    .pipe(plumber())
    .pipe(webpack(webpackConfig))
    .pipe(dest('dist/js'));
}

const env = new nunjucksCore.Environment(
  new nunjucksCore.FileSystemLoader('src/templates')
);

env.addGlobal('styles', IS_PROD ? `css/styles.min.css?timestamp=${Date.now()}` : 'css/styles.css');

function html() {
  return src('src/templates/pages/*.html')
    .pipe(plumber())
    .pipe(nunjucks.compile(mocks, { env }))
    .pipe(gulpIf(IS_PROD, prettifyHtml({
      indent_char: ' ',
      indent_size: 2,
      preserve_newlines: false,
    })))
    .pipe(dest('dist'));
}

function copyStaticFiles() {
  return src([
    'src/favicon/**/*',
    'src/fonts/**/*.{woff,woff2}',
    'src/img/**/*',
  ], { base: 'src' })
    .pipe(plumber())
    .pipe(dest('dist'));
}

function refresh(done) {
  browserSync.reload();
  done();
}

function devServer() {
  browserSync.init({
    server: 'dist/',
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  try {
    watch('src/js/pure/**/*.js', series(copyJs, refresh));
    watch('src/js/webpack/**/*.js', series(bundleJs, refresh)).on('error', (err) => { console.log('webpack-js-error', err)});
    watch('src/styles/pure/**/*.css', series(copyStyles, refresh));
    watch('src/styles/preprocessed/**/*.scss', series(bundleStyles, refresh));
    watch('src/templates/**/*.html', series(html, refresh)).on('error', (err) => { console.log('templates-error', err)});

    watch('src/img/**/*', series(copyStaticFiles, refresh));
    watch('src/favicon/**/*', series(copyStaticFiles, refresh));
    watch('src/fonts/**/*.{woff,woff2}', series(copyStaticFiles, refresh));

    watch('src/mocks/index.js', series(updateMocks, html, refresh));
  } catch (error) {
    console.log('TRY_CATCH error', error);
  }
}

function clean() {
  return del('dist');
}

const build = series(
  clean,
  copyStaticFiles,
  copyStyles,
  bundleStyles,
  copyJs,
  bundleJs,
  html,
);

const dev = series(
  build,
  devServer,
);

exports.default = dev;
exports.build = build;
