var gulp = require("gulp"),
	jshint = require("gulp-jshint");

gulp.task("lint", function () {
	return gulp.src(["./lib/*.js", "./test/*.js"])
		.pipe(jshint())
		.pipe(jshint.reporter("jshint-stylish"));
});
