"use strict";

var gulp = require('gulp');
var del = require('del');
var babelify = require('babelify');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('js', function() {
  return browserify({ entries: [ './js/index.js' ] })
    .transform(babelify)
    .bundle()
    .pipe(source('all.js'))
    .pipe(buffer())
    .pipe(eslint())
    .pipe(gulp.dest('./js'));
});

gulp.task('watch', function() {
  return gulp.watch([
    '!./js/all.js', // Exclude compiled file
    './js/**/*.js'
  ], [ 'js' ]);
});

gulp.task('copy', function() {
  return gulp.src([ 'js/all.js' ], { base: './' }).pipe(gulp.dest('./dist'));
});

gulp.task('clean', function(callback) {
  del([ './dist/*' ], callback);
});

gulp.task('build', function() {
  return runSequence('compile', 'clean', 'copy');
});

gulp.task('compile', [ 'js' ]);
gulp.task('default', [ 'watch' ]);
