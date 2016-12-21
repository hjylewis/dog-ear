var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var del = require('del');
var webpack = require('gulp-webpack');


gulp.task('cleanup', function () {
    return del([
        'dist/**/*'
    ]);
});

gulp.task('webpack', function() {
    return gulp.src('src/entry.js')
        .pipe(webpack( require('./webpack.config.js') ))
        .pipe(gulp.dest('dist/'));
});

gulp.watch('src/**/*[.js|.scss]', ['webpack']);

gulp.task('copy', function() {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist/'));
});

gulp.watch('src/**/*.html', ['copy']);

gulp.task('default', gulpSequence('cleanup', ['copy', 'webpack']));
