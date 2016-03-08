var gulp = require('gulp');
var lint = require('gulp-eslint');
var config = require('../config').lint;
gulp.task('lint', function() {
	return gulp.src(config.src)
		.pipe(lint({config: config.configSrc}))
		.pipe(lint.format());
});
