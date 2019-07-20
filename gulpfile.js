const gulp = require('gulp'),
	sass = require('gulp-sass'),
	browsersync = require('browser-sync').create(),
	autoprefixer = require('gulp-autoprefixer'),
	iconfont = require('gulp-iconfont'),
	consolidate = require('gulp-consolidate'),
	iconfontCss = require('gulp-iconfont-css');

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

// 종상 ver
function svgiconfont(done) {
	gulp.src(['fonts/svg/**/*.svg'])
		.pipe(iconfont({
			fontName: 'iconFont',
			prependUnicode: true,
			formats:['woff', 'woff2'],
			fontPath: '../fonts/',
			className: 'icons'
		}))
		.on('glyphs', function(glyphs, options) {
			// CSS templating, e.g.
			console.log(glyphs, options);
		})
	done();
	// 일단.. 임시로 fonts에 scss도 넣어 놓자... =ㅠ=... 어떻게 움직이는거냐아...
}

// function font(done) {
// 	gulp.src('fonts/svg/*.svg')
// 		.pipe(iconfont({
// 			fontName: 'iconfont',
// 			formats: [ 'woff', 'woff2'],
// 		}))
// 		.on('glyphs', function (glyphs, options) {
// 			console.log(glyphs, options);
// 			gulp.src('iconfont-src/iconfont.css')
// 				.pipe(consolidate('underscore', {
// 					glyphs: glyphs,
// 					fontName: options.fontName,
// 					fontDate: new Date().getTime()
// 				}))
// 				.pipe(gulp.dest('iconfont'));
// 			gulp.src('iconfont-src/index.html')
// 				.pipe(consolidate('underscore', {
// 					glyphs: glyphs,
// 					fontName: options.fontName
// 				}))
// 				.pipe(gulp.dest('iconfont'));
// 		})
// 		.pipe(gulp.dest('iconfont'));
// 	done();
// }

const watch = gulp.parallel(watchFiles, broserLive);
exports.font = svgiconfont;
exports.sass = scss;
exports.bs = watch;