const gulp = require('gulp'),
	sass = require('gulp-sass'),
	browsersync = require('browser-sync').create(),
	autoprefixer = require('gulp-autoprefixer'),
	iconfont = require('gulp-iconfont'),
	iconfontCss = require('gulp-iconfont-css'),
	consolidate = require('gulp-consolidate'),
	async = require('async');

const runTimestamp = Math.round(Date.now()/1000);

const path = {
	scss: './scss/**/*.scss',
	html: './*.html',
	css: 'css/*.css'
}

function broserLive(done) {
	browsersync.init({
		server: {
			baseDir: "./"
		},
	});
	done();
}

function browserSyncReload(done) {
	browsersync.reload();
	done();
}

function scss(done) {
	gulp.src(path.scss , {sourcemaps: true})
		.pipe(sass({
			outputStyle: 'expanded', // nested, expanded, compact, compressed
			indentType: 'tab',
			indentWidth : 1,
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(gulp.dest('./css',{ sourcemaps: true }));
	done();
}

// Watch files
function watchFiles() {
	gulp.watch("./scss/**/*", scss);
	gulp.watch(
		[
			path.html,
			path.css
		],
		browserSyncReload,
	)
}

function iconFont(done) {
	gulp.src(['fonts/svg/**/*.svg'])
		.pipe(iconfontCss({
			fontName: 'iconFont',
			path: 'scss/lib/_icons.scss',
			targetPath: '_icons.scss',
			fontPath: '../fonts/common/'
		}))
		.pipe(iconfont({
			fontName: 'iconFont',
			fontPath: './fonts/',
			className: 'icons'
		}))
		.pipe(gulp.dest('scss/common'));
	
	gulp.src('scss/*.{eot,ttf,woff}')
		.pipe(gulp.dest('fonts'));
	done();
}

const watch = gulp.parallel(watchFiles, broserLive);

exports.font = iconFont;
exports.sass = scss;
exports.bs = watch;