const {
	src,
	dest,
	watch,
	parallel,
	series
} = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const	nunjucks = require('gulp-nunjucks');
const nunjucksCore = require('nunjucks');
const	rename = require('gulp-rename');
const scss = require('gulp-sass');
const	bulkSass = require('gulp-sass-glob-import');
const	sourcemaps = require('gulp-sourcemaps');
const	autoprefixer = require('gulp-autoprefixer');
const	cssmin = require('gulp-cssmin');
const	combineMq = require('gulp-combine-mq');
const webpack = require('webpack-stream');

const paths = require('./config');
const	browsersList = require('./package.json').browserslist;

const IS_PROD = process.env.NODE_ENV === 'production';

const liveReload = () => {
	browserSync.init({
		server: {
			baseDir: './dist',
		}
	});
};

const compileTemplates = () => {
	const data = require(`./${paths.src.data}index.js`);
	const env = new nunjucksCore.Environment(new nunjucksCore.FileSystemLoader(paths.src.templates));
  const options = {
    env: env,
  };

	env.addGlobal('styles', IS_PROD ? 'css/style.min.css' : 'css/style.css');

  return src(paths.src.templates + 'pages/*.html')
    .pipe(plumber())
    .pipe(nunjucks.compile(data, options))
    .pipe(dest(paths.dist.html))
    .pipe(browserSync.stream());
};

const compileScss = () => src(paths.src.styles + 'main.scss')
  .pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(bulkSass())
	.pipe(scss({
		includePaths: [paths.src.styles]
	}))
	.pipe(sourcemaps.write())
	.pipe(rename('style.css'))
	.pipe(dest(paths.dist.css))
  .pipe(browserSync.stream());

const prodStyles = () => src(paths.dist.css + 'style.css')
  .pipe(plumber())
	.pipe(autoprefixer({
		browsers: browsersList,
		cascade: false
	}))
	.pipe(combineMq({
		beautify: true
	}))
	.pipe(cssmin())
	.pipe(rename('style.min.css'))
	.pipe(dest(paths.dist.css));
	
const compileJs = () => src(paths.src.js + 'index.js')
	.pipe(webpack(require('./webpack.config.js')))
	.pipe(dest(paths.dist.js))
	.pipe(browserSync.stream());
  
const cleanDist = del.sync('dist');

// COPY STATIC ***

const copyFonts = () => src(paths.src.fonts + '**/*')
	.pipe(dest(paths.dist.fonts));

const copyFavicon = () => src(paths.src.favicon + '**/*')
	.pipe(dest(paths.dist.favicon));

const copyImages = () => src(paths.src.images + '**/*')
	.pipe(dest(paths.dist.images));

const copyJs = () => src(paths.src.compiledJs + '**/*')
	.pipe(dest(paths.dist.js));

const copyStatic = parallel(copyFonts, copyFavicon, copyImages, copyJs);

// END COPY STATIC ***

const watcher = () => {
	watch(paths.src.fonts + '**/*', copyFonts);
	watch(paths.src.favicon + '**/*', copyFavicon);
	watch(paths.src.images + '**/*', copyImages);
	watch(paths.src.templates + '**/*.html', compileTemplates);
	watch(paths.src.styles + '**/*.scss', compileScss);
	watch(paths.src.js + '**/*.js', compileJs);
};

exports.build = series(
	cleanDist,
	parallel(
		copyStatic,
		compileTemplates,
		compileJs,
		series(compileScss, prodStyles),
	),
);

// exports.default = parallel(copyStatic, watcher, liveReload);
exports.default = series(
	cleanDist,
	parallel(
		copyStatic,
		compileTemplates,
		compileScss,
		compileJs,
		watcher,
		liveReload,
	),
);
