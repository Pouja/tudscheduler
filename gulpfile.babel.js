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

const paths = {
    bundle: 'app.js',
    entry: 'src/Index.js',
    srcMainCss: 'src/styles/main.less',
    srcCss: 'src/styles/*.less',
    srcLint: ['src/**/*.js', 'test/**/*.js'],
    npmDir: 'node_modules',
    dist: 'dist',
    distCss: 'dist/styles',
    distJs: 'dist/js',
    distDeploy: './dist/**/*'
};

const customOpts = {
    entries: [paths.entry],
    debug: true,
    cache: {},
    packageCache: {}
};

const opts = Object.assign({}, watchify.args, customOpts);

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

gulp.task('run', function () {
    var options = {
        port: 8000,
        root: ['./'],
        rewriteNotFound: false,
        rewriteTemplate: 'index.html',
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
    const bundler = watchify(browserify(opts));

    function rebundle() {
        return bundler.bundle()
            .on('error', notify.onError())
            .pipe(source(paths.bundle))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(paths.distJs))
            .pipe(reload({
                stream: true
            }));
    }

    bundler.transform(babelify)
        .on('update', rebundle);
    return rebundle();
});

gulp.task('browserify', () => {
    return browserify(paths.entry, {
        debug: true
    })
        .transform(babelify)
        .bundle()
        .pipe(source(paths.bundle))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.distJs));
});

gulp.task('styles', function() {
    return gulp.src(paths.srcMainCss)
        .pipe(less({
            paths: [paths.npmDir + '/bootstrap/less/',
            paths.npmDir + '/react-fa/node_modules/font-awesome/less']
        }))
        .on('error', notify.onError())
        .pipe(postcss([autoprefixer('last 1 version')]))
        .pipe(gulp.dest(paths.distCss))
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
        .pipe(gulp.dest(paths.dist));
});

gulp.task('lint', () => {
    return gulp.src(paths.srcLint)
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('replace', () => {
    return gulp.src('dist/js/app.js')
        .pipe(replace('http://localhost:8000/', '/'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('watchTask', () => {
    gulp.watch('./mocks/**/*.js', ['run']);
    gulp.watch(paths.srcCss, ['styles']);
    gulp.watch(paths.srcLint, ['lint']);
});

gulp.task('watch', cb => {
    runSequence('clean', ['browserSync', 'watchTask', 'watchify', 'styles', 'lint', 'run'], cb);
});

gulp.task('build', cb => {
    process.env.NODE_ENV = 'production';
    runSequence('clean', ['browserify', 'styles', 'htmlReplace'], 'replace', cb);
});
