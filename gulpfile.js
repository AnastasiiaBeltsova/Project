import gulp from "gulp";
import imagemin from "gulp-imagemin";

import browserSync from "browser-sync";
import sourcemap from "gulp-sourcemaps";
import cleanCSS from "gulp-clean-css";
import mediaQueries from "gulp-group-css-media-queries";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import htmlMin from "gulp-htmlmin";
import svgstore from "gulp-svgstore";
import del from "del";
import rename from "gulp-rename";
import replace from "gulp-replace";
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('code', function () {
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('sass', function () {
    return gulp.src('app/sass/**/*.+(scss|sass)')
        .pipe(sourcemap.init())
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('svg-sprite', function () {
    return gulp.src("app/img/icons/*.svg")
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest("app/img"));
});

gulp.task('clean', function (done) {
    del.sync('dist');
    done();
});

gulp.task('css', function () {
    return gulp.src('app/sass/**/*.+(scss|sass)')
        .pipe(sass())
        .pipe(mediaQueries())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('html', function () {
    return gulp.src('app/*.html')
        .pipe(replace('style.css', 'style.min.css'))
        .pipe(htmlMin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
});

gulp.task('optimize-images', function () {
    return gulp.src(["app/img/**/*.{png,jpg,svg}", "!app/img/sprite.svg", "!app/img/icons/*.svg"])
        .pipe(imagemin([
            imagemin.mozjpeg({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 3 }),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('svg-sprite-prod', function () {
    return gulp.src("app/img/icons/*.svg")
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest("dist/img"));
});

gulp.task('copy-dist', function (done) {
    gulp.src('app/fonts/**/*.*')
        .pipe(gulp.dest('dist/fonts'));
    done();
});

gulp.task('watch', function () {
    gulp.watch('app/sass/**/*.+(scss|sass)', gulp.parallel('sass'));
    gulp.watch('app/img/icons/*.svg', gulp.parallel('svg-sprite'));
    gulp.watch('app/*.html', gulp.parallel('code'));
});

gulp.task('default', gulp.parallel('sass', 'svg-sprite', 'browser-sync', 'watch'));  //  Запускаем задачи в режиме разработки командой gulp
gulp.task('build', gulp.series('clean', 'css', 'html', 'optimize-images', 'svg-sprite-prod', 'copy-dist')); //  Собираем проект для продакшена командой gulp build
