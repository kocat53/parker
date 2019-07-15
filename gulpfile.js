const gulp = require('gulp'),
	sass = require('gulp-sass'),
	browsersync = require('browser-sync').create(),
	autoprefixer = require('gulp-autoprefixer'),
	iconfont = require('gulp-iconfont'),
	iconfontCss = require('gulp-iconfont-css'),
	rmLines = require('gulp-rm-lines');

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
	gulp.src(path.scss, { sourcemaps: true })
		.pipe(sass({
			outputStyle: 'compact', // nested, expanded, compact, compressed
			indentType: 'tab',
			indentWidth: 1,
			linefeed: 'cr',
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(rmLines({
			'filters': [
				/<link\s+rel=["']/i
			],
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
			targetPath: '_iconfont.scss',
			fontPath: '../fonts/'
		}))
		.pipe(iconfont({
			fontName: 'iconFont',
			formats:['ttf', 'eot', 'woff', 'woff2'],
			fontPath: '../fonts/',
			className: 'icons'
		}))
	done();
	// 일단.. 임시로 fonts에 scss도 넣어 놓자... =ㅠ=... 어떻게 움직이는거냐아...
}

const icon = gulp.series(iconFont,scss)

const watch = gulp.parallel(watchFiles, broserLive);

exports.font = icon;
exports.sass = scss;
exports.bs = watch;