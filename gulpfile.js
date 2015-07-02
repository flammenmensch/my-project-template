'use strict';

var gulp = require('gulp');
var del = require('del');
var babelify = require('babelify');
var browserify = require('browserify');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var scsslint = require('gulp-scss-lint');
var minifycss = require('gulp-minify-css');
var cleanhtml = require('gulp-cleanhtml');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('css:dev', function() {
  return gulp.src([ './scss/all.scss' ])
    .pipe(sass())
    .pipe(gulp.dest('./'));
});

gulp.task('css:prod', function() {
  return gulp.src([ './scss/all.scss' ])
    .pipe(sass())
    .pipe(minifycss())
    .pipe(gulp.dest('./dist'));
});

gulp.task('html', function() {
  return gulp.src([ './index.html' ])
    .pipe(cleanhtml())
    .pipe(gulp.dest('./dist'));
});

gulp.task('js:dev', function() {
  return browserify({ entries: [ './js/index.js' ] })
    .transform(babelify)
    .bundle()
    .pipe(source('all.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./'));
});

gulp.task('js:prod', function() {
  return browserify({ entries: [ './js/index.js' ] })
    .transform(babelify)
    .bundle()
    .pipe(source('all.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
    .on('error', function(err) {
      console.log('Error : ' + err.message);
    });
});

gulp.task('scss-lint', function() {
  return gulp.src([ './scss/*.scss' ])
    .pipe(scsslint())
    .pipe(scsslint.failReporter());
});

gulp.task('es-lint', function() {
  return gulp.src([ 'js/**/*.js' ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('watch', function() {
  return gulp.watch([ './js/**/*.js' ], [ 'css:dev', 'js:dev' ]);
});

gulp.task('clean', function(callback) {
  del([ './dist/*' ], callback);
});

gulp.task('build', function() {
  return runSequence('clean', /*'scss-lint', */'es-lint', 'compile');
});

gulp.task('compile', [ 'css:prod', 'js:prod', 'html' ]);
gulp.task('default', [ 'watch' ]);
