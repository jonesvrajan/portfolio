var gulp = require('gulp'),
  	connect = require('gulp-connect');
  	cssmin = require('gulp-cssmin');
  	rename = require("gulp-rename");
  	concat = require('gulp-concat');
  	concatCss = require('gulp-concat-css');
    uglify = require('gulp-uglify');
    pump = require('pump');
    htmlmin = require('gulp-htmlmin');
 
gulp.task('connect', function() {
  connect.server({
    root: './',
    livereload: true
  });
});

gulp.task('css-min', function () {
    gulp.src('./dist/css/bundle.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(connect.reload());
});

gulp.task('scripts', function() {
  return gulp.src([
  	'./assets/js/jquery-1.11.1.min.js', 
  	'./assets/js/bootstrap.min.js',
    './assets/js/jquery.magnific-popup.min.js',
    './assets/js/jquery.parallax-1.1.3.js',
    './assets/js/imagesloaded.pkgd.js',
    './assets/js/jquery.shuffle.min.js',
    './assets/js/owl.carousel.min.js',
    './assets/js/jquery.fitvids.js',
    './assets/js/jquery.sticky.js',
    './assets/js/smoothscroll.js',
    './assets/js/wow.min.js',
    './assets/js/gmaps.js',
    './assets/js/custom.js',
    './assets/js/custom-shuffle-init.js',
    ])
  	//'./assets/js/*.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('concat-css', function () {
    return gulp.src('assets/css/*.css')
    .pipe(concatCss("bundle.css"))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('html', function () {
  gulp.src('index.html')
    .pipe(connect.reload());
});

gulp.task('rename', function () {
  gulp.src("index.html")
  .pipe(rename("index.php"))
  .pipe(gulp.dest("./"));
});

gulp.task('compress', function (cb) {
  pump([
        gulp.src('./dist/js/*.js'),
        uglify(),
        gulp.dest('./dist/js/min')
    ],
    cb
  );
});

/*gulp.task('minify', function() {
  return gulp.src('index.php')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./'));
});*/

gulp.task('watch', function () {
  gulp.watch(['index.html'] , ['html']);
  gulp.watch(['index.html'] , ['rename']);
  //gulp.watch(['index.html'] , ['minify']);
  gulp.watch(['./assets/css/*.css'] , ['concat-css']);
  gulp.watch(['./dist/css/bundle.css'], ['css-min']);

});
 
gulp.task('default', ['scripts','compress','connect', 'watch' ]);