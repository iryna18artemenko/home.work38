import gulp from 'gulp';
import { deleteAsync } from 'del';
import miniHTML from "gulp-htmlmin";
import stripDebug from "gulp-strip-debug";
import uglify from "gulp-uglify";
import gulpBabel from "gulp-babel";
import sass from "sass";
import gulpSass from "gulp-sass";
import livereload from "gulp-livereload";
import gulpConnect from "gulp-connect";

const src = "./src";
const dest = "./dist";

const htmlPath = `${src}/**/*.html`;
const scriptsPath = `${src}/**/*.js`;
const scssPath = `${src}/**/*.scss`

const reset = () => {
    return deleteAsync(dest);
};

const copy = () => {
    return gulp.src ([
        `${src}/**/*.*`,
        `!${htmlPath}`,
        `!${scriptsPath}`,
        `!${scssPath}`
    ])
    .pipe(gulp.dest(dest))
};

const html = () => {
    return gulp.src(htmlPath)
    .pipe(miniHTML({collapseWhitespace: true}))
    .pipe(gulp.dest(dest))
    .pipe(gulpConnect.reload());
};

const scripts = () => {
    return gulp.src(scriptsPath)
    .pipe(stripDebug())
    .pipe(gulpBabel({ presets: ['@babel/env'] }))
    .pipe(uglify())
    .pipe(gulp.dest(dest))
    .pipe(gulpConnect.reload());
};

const sassProcessor = gulpSass(sass);

const cssCompile = () => {
    return gulp.src (scssPath)
    .pipe(sassProcessor({outputStyle:"compressed"}).on('error', sassProcessor.logError))
    .pipe(gulp.dest(`${dest}/styles`))
    .pipe(gulpConnect.reload());
};

const watchers = () => {
    gulp.watch(htmlPath, html);
    gulp.watch(scriptsPath, scripts);
    gulp.watch([
        `${src}/**/*.*`,
        `!${htmlPath}`,
        `!${scriptsPath}`
    ], copy);
};


const srv = () => {
    gulpConnect.server({ port: 8000, root: './dist', 'livereload': true});
};

const mainBuild = gulp.parallel(html, cssCompile, scripts);
const launch = gulp.series(reset, copy, mainBuild, watchers);
const mainTask = gulp.parallel(launch, srv)

gulp.task('default', mainTask);



