var gulp = require('gulp');

gulp.task('build', ['browserify', 'css', 'fonts', 'assets', 'templates', 'lint'], function(){
    global.isBuilding = false;
});
