var gulp 			= require('gulp'),
	scss 			= require('gulp-sass'),
	bulkSass 		= require('gulp-sass-glob-import'),
	rename 			= require('gulp-rename'),
	bs 				= require('browser-sync').create(),
	data 			= require('gulp-data'),
	autoprefixer 	= require('gulp-autoprefixer'),
	cssmin 			= require('gulp-cssmin'),
	combineMq 		= require('gulp-combine-mq'),
	sourcemaps 		= require('gulp-sourcemaps'),
	nunjucks 		= require('gulp-nunjucks'),
	PATHS 			= require('./package.json').paths,
	BROWSERS_LIST 	= require('./package.json').browserslist;

gulp.task('browser-sync', function () {
	bs.init({
		server: {
			baseDir: './dist'
		}
	});
});

gulp.task('nunjucks', function() {
	gulp.src(PATHS.src.templates + '*.html')
		.pipe(data(function (file) {
			return require('./' + PATHS.src.data + '_global.json');
		}))
		.pipe(nunjucks.compile())
		.pipe(gulp.dest(PATHS.dist.html))
		.pipe(bs.reload({ stream: true }));
});

gulp.task('scss', function () {
	return gulp.src(PATHS.src.styles + 'main.scss')
		.pipe(sourcemaps.init())
		.pipe(bulkSass())
		.pipe(scss().on('error', scss.logError))
		.pipe(scss({
			includePaths: [PATHS.src.styles]
		}))
        .pipe(sourcemaps.write())
        .pipe(rename('style.css'))
        .pipe(gulp.dest(PATHS.dist.css))
        .pipe(bs.reload({stream: true}));
});

gulp.task('autoprefixer', function() {
	gulp.src(PATHS.dist.css + 'style.css')
		.pipe(autoprefixer({
			browsers: BROWSERS_LIST,
			cascade: false
		}))
		.pipe(gulp.dest(PATHS.dist.css));
});

gulp.task('css', function() {
	gulp.src(PATHS.dist.css + 'style.css')
		.pipe(autoprefixer({
			browsers: BROWSERS_LIST,
			cascade: false
		}))
		.pipe(combineMq({
			beautify: true
		}))
		.pipe(cssmin())
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest(PATHS.dist.css));
});

gulp.task('watcher', function() {
	gulp.watch(PATHS.src.templates + '**/*.html', ['nunjucks']);
	gulp.watch(PATHS.src.styles + '**/*.scss', ['scss']);
});

gulp.task('default', ['watcher', 'browser-sync']);