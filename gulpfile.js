// Plugin Load
// -----------------
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    del = require('del'),
    runSequence = require('run-sequence'),
    autoprefixer = require('gulp-autoprefixer'),
    uncss = require('gulp-uncss'),
    jslint = require('gulp-jslint');


// Development Tasks
// -----------------

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
});


// SASS
gulp.task('sass', function(){
    return gulp.src('app/assets/scss/**/*.scss')
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(uncss({
            html: ['app/**/*.html']
        }))
        .pipe(gulp.dest('app/assets/css/'))
        .pipe(browserSync.reload({
            stream: true
        }))
});


//js
gulp.task('js', function () {
    return gulp.src(['app/assets/js/main.js'])
        .pipe(jslint({
            /* this object represents the JSLint directives being passed down */
        }))
        .pipe(jslint.reporter('default'))
});

// Watchers
gulp.task('watch',['browserSync','sass'],function(){
    gulp.watch('app/assets/scss/**/*.scss', ['sass']);
    gulp.watch('app/**/*.html', browserSync.reload);
    gulp.watch('app/assets/js/**/*.js', browserSync.reload);
    gulp.watch('app/assets/css/**/*.css', browserSync.reload);
    // Other watchers
});




// Optimization Tasks
// ------------------

// Optimizing CSS and JavaScript

gulp.task('useref', function(){
    return gulp.src('app/*.html')
        .pipe(useref())
        // Minifies only if it's a JavaScript file
        .pipe(gulpIf('*.js', uglify()))
        // Minifies only if it's a CSS file
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});


// Optimizing Images
gulp.task('images', function(){
    return gulp.src('app/assets/img/**/*.+(png|jpg|gif|svg)')
        // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'));
});


// Copying fonts
gulp.task('fonts', function() {
    return gulp.src('app/assets/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});


// Cleaning
gulp.task('clean:dist', function() {
    return del.sync('dist');
});




// Build Sequences
// ---------------

gulp.task('default', function (callback) {
    runSequence(['sass','browserSync', 'watch'],
        callback
    )
});


gulp.task('build', function(callback) {
    runSequence('clean:dist',
        ['sass', 'useref', 'images', 'fonts'],
        callback
    )
});

