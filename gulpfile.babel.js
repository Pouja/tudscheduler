import gulp from 'gulp';
import autoprefixer from 'autoprefixer';
import browserify from 'browserify';
import watchify from 'watchify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import eslint from 'gulp-eslint';
import babelify from 'babelify';
import uglify from 'gulp-uglify';
import rimraf from 'rimraf';
import notify from 'gulp-notify';
import browserSync, {
    reload
}
from 'browser-sync';
import sourcemaps from 'gulp-sourcemaps';
import htmlReplace from 'gulp-html-replace';
import runSequence from 'run-sequence';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import versionAppend from 'gulp-version-append';
import replace from 'gulp-replace';
import restEmulator from 'gulp-rest-emulator';

gulp.task('clean', cb => {
    rimraf('dist', cb);
});

gulp.task('browserSync', () => {
    browserSync({
        server: {
            baseDir: './'
        }
    });
});

gulp.task('mock-server', function() {
    var options = {
        port: 8000,
        root: ['./'],
        rewriteNotFound: false,
        corsEnable: true,
        corsOptions: {},
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return gulp.src('./mocks/**/*.js')
        .pipe(restEmulator(options));
});

gulp.task('watchify', () => {
    const customOpts = {
        entries: ['src/Index.js'],
        debug: process.env.NODE_ENV !== 'production',
        cache: {},
        packageCache: {}
    };

    const opts = Object.assign({}, watchify.args, customOpts);
    const bundler = watchify(browserify(opts));

    function rebundle() {
        return bundler.bundle()
            .on('error', notify.onError())
            .pipe(source('app.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: process.env.NODE_ENV !== 'production'
            }))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist/js'))
            .pipe(reload({
                stream: true
            }));
    }

    bundler.transform(babelify)
        .on('update', rebundle);
    return rebundle();
});

gulp.task('browserify', () => {
    return browserify('src/Index.js', {
            debug: process.env.NODE_ENV !== 'production'
        })
        .transform(babelify)
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: process.env.NODE_ENV !== 'production'
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('styles', function() {
    return gulp.src('src/styles/main.less')
        .pipe(less())
        .on('error', notify.onError())
        .pipe(postcss([autoprefixer('last 1 version')]))
        .pipe(gulp.dest('dist/styles'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('htmlReplace', () => {
    return gulp.src('index.html')
        .pipe(htmlReplace({
            css: 'styles/main.css?v=@version@',
            js: 'js/app.js?v=@version@'
        }))
        .pipe(versionAppend(['js', 'css']))
        .pipe(gulp.dest('dist'));
});

gulp.task('lint', () => {
    return gulp.src(['src/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('replace', () => {
    return gulp.src('dist/js/app.js')
        .pipe(replace('http://localhost:8000/', '/'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('watchTask', () => {
    gulp.watch('./mocks/**/*.js', ['mock-server']);
    gulp.watch('./src/styles/*.less', ['styles']);
    gulp.watch(['./src/**/*.js'], ['lint']);
});

gulp.task('watch', cb => {
    runSequence('clean', ['browserSync', 'watchTask', 'watchify', 'styles', 'lint',
        'mock-server'
    ], cb);
});

gulp.task('build', cb => {
    process.env.NODE_ENV = 'production';
    runSequence('clean', ['browserify', 'styles', 'htmlReplace'], 'replace', cb);
});
