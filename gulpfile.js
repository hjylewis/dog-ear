var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var del = require('del');
var webpack = require('gulp-webpack');

var production = process.env.NODE_ENV === 'production';

gulp.task('cleanup', function () {
    return del([
        'package/dist/**/*'
    ]);
});

gulp.task('webpack', function() {
    var webpackPipe;
    if (production) {
        webpackPipe = webpack(require('./webpack.prod.js'));
    } else {
        webpackPipe = webpack(require('./webpack.config.js'));
    }

    return gulp.src('src/entry.js')
        .pipe(webpackPipe)
        .pipe(gulp.dest('package/dist/'));
});

gulp.task('copy', function() {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('package/dist/'));
});

if (!production) {
    gulp.watch('src/**/*[.js|.scss]', ['webpack']);
    gulp.watch('src/**/*.html', ['copy']);
}

gulp.task('default', gulpSequence('cleanup', ['copy', 'webpack']));
