var manifest = require('./package.json');

var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var del = require('del');
var webpack = require('gulp-webpack');
var merge = require('gulp-merge-json');
var zip = require('gulp-zip');

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

gulp.task('set-production', function() {
  return (process.env.NODE_ENV = 'production');
});

gulp.task('set-development', function() {
  return (process.env.NODE_ENV = 'development');
});

gulp.task('cleanup', function() {
  return del(['package/dist/**/*']);
});

gulp.task('updateVersion', function() {
  return gulp
    .src('package/manifest.json')
    .pipe(
      merge({
        fileName: 'manifest.json',
        endObj: { version: manifest.version },
        jsonSpace: '    ',
      })
    )
    .pipe(gulp.dest('package'));
});

gulp.task('webpack', function() {
  var webpackPipe;
  if (isProduction()) {
    webpackPipe = webpack(require('./webpack.prod.js'));
  } else {
    webpackPipe = webpack(require('./webpack.config.js'));
  }

  return gulp
    .src('src/entry.js')
    .pipe(webpackPipe)
    .pipe(gulp.dest('package/dist/'));
});

gulp.task('copy', function() {
  return gulp.src('src/**/*.html').pipe(gulp.dest('package/dist/'));
});

gulp.task('package', function() {
  return gulp
    .src('./package/**/*')
    .pipe(zip(`${manifest.name}-${manifest.version}.zip`))
    .pipe(gulp.dest('./releases'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*[.js|.scss]', ['webpack']);
  gulp.watch('src/**/*.html', ['copy']);
});

gulp.task(
  'build',
  gulpSequence(['cleanup', 'updateVersion'], ['copy', 'webpack'])
);
gulp.task('development', gulpSequence('set-development', 'build', 'watch'));
gulp.task('production', gulpSequence('set-production', 'build'));
gulp.task('publish', gulpSequence('production', 'package'));

gulp.task('default', ['development']);
