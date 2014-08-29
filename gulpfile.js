var gulp   = require('gulp'),
	jshint = require('gulp-jshint');

gulp.task('lint', function() {
	return gulp.src('./bricks/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});
