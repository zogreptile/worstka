'use strict';

const { src, dest, series, watch } = require('gulp');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const	nunjucks = require('gulp-nunjucks');
const nunjucksCore = require('nunjucks');
const plumber = require('gulp-plumber');
const del = require('del');
const Fiber = require('fibers');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const postcss = require('gulp-postcss');
const csso = require('gulp-csso');
const autoprefixer = require('autoprefixer');
const prettifyHtml = require('gulp-pretty-html');
const webpack = require('webpack-stream');

const webpackConfig = require('./webpack.config');

sass.compiler = require('sass');

const IS_PROD = process.env.ENV === 'production';

function styles() {
  const sourcemaps = !IS_PROD;

  return src('src/styles/main.scss', { sourcemaps })
    .pipe(plumber())
    .pipe(sassGlob())
    .pipe(sass({
      fiber: Fiber,
      includePaths: ['node_modules'],
    }).on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
    ]))
    .pipe(gulpIf(IS_PROD, csso({ comments: false })))
    .pipe(rename(IS_PROD ? 'style.min.css' : 'style.css'))
    .pipe(dest('build/css', { sourcemaps }));
}

function copyJs() {
  return src('src/js/**', { base: 'src' })
    .pipe(dest('build'));
}

function bundleJs() {
  console.log('🔴 BUNDLE JS');

  return src('src/js-entry-points/**/*.{js,jsx}',)
    .pipe(plumber())
    .pipe(webpack(webpackConfig))
    .pipe(dest('build/js'));
}

function html() {
  const mockData = require('./src/mock-data/index.js');
	const env = new nunjucksCore.Environment(
    new nunjucksCore.FileSystemLoader('src/templates')
  );

	env.addGlobal('styles', IS_PROD ? `css/style.min.css?ver=${Date.now()}` : 'css/style.css');

  return src('src/templates/pages/*.html')
    .pipe(plumber())
    .pipe(nunjucks.compile(mockData, { env }))
    .pipe(gulpIf(IS_PROD, prettifyHtml({
      indent_char: ' ',
      indent_size: 2,
      preserve_newlines: false,
    })))
    .pipe(dest('build'));
}

function copyStaticFiles() {
  return src([
    'src/favicon/**',
    'src/fonts/**/*.{woff,woff2}',
    'src/img/**',
  ], { base: 'src' })
  .pipe(dest('build'));
}

function refresh(done) {
  browserSync.reload();
  done();
}

function server() {
  browserSync.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  watch('src/js/**/*.js', series(copyJs, refresh));
  watch('src/js-webpack/**/*.js', series(bundleJs, refresh));
  watch('src/styles/**/*.scss', series(styles, refresh));
  watch('src/templates/**/*.html', series(html, refresh));
}

function clean() {
  return del('build');
}

const build = series(
  clean,
  copyStaticFiles,
  styles,
  copyJs,
  bundleJs,
  html,
);

exports.default = series(build, server);
exports.build = build;
