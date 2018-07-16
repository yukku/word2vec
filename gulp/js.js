var browserify = require("browserify");
var babel = require('gulp-babel');
var uglify = require("gulp-uglify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var gutil = require("gulp-util");
var buffer = require("vinyl-buffer");
var watchify = require("watchify");
var uglifyes = require("gulp-uglifyes");
var es = require("event-stream");

module.exports = {

    build: function(gulp, timestamp){
        var bundle = function(gulp, timestamp) {
            return transformer.bundle()
                .on("error", function(err) {
                    gutil.log(err.stack, err.message);
                    process.exit(1);
                 })
                .pipe(source("bundle" + ".js"))
                .pipe(buffer())
                .pipe(uglifyes())
                .pipe(gulp.dest("./public"))
                .on("data", function() {});
        }

        var transformer = browserify({
            cache: {},
            packageCache: {},
            debug: false,
            fullPaths: false,
            entries: ["src/main.js"]
        });

        transformer.transform(babelify, {
            presets: ["es2015"],
            compact: true
        });

        transformer.on("time", function(time) {
            var fmted =  Math.round(time / 10) / 100 + "s";
            gutil.log("JS transform took " + gutil.colors.bold.cyan(fmted));
        });

        return bundle(gulp, timestamp);

    },

    serve: function(gulp, browserSync, timestamp){

        var files = [
            'main.js',
            'worker.js'
        ];

        var tasks = files.map(function(entry) {

            var bundle = function(gulp, timestamp) {
                return transformer.bundle()
                    .on("error", function(err) {
                        gutil.log(err.stack, err.message);
                    })
                        .pipe(source(entry))
                    .pipe(buffer())
                    .pipe(gulp.dest('./public'))
                    .on("data", function() {
                        if (browserSync) browserSync.reload();
                    });
                }

            var transformer = browserify({
                cache: {},
                packageCache: {},
                debug: false,
                fullPaths: false,
                entries: ["src/" + entry]
            })
            transformer.plugin(watchify, {
                ignoreWatch: ["**/node_modules/**"],
                poll: true
            });
            transformer.transform(babelify, {
                presets: ["es2015"],
                compact: true
            });
            transformer.on("update", bundle.bind(this, gulp, browserSync, timestamp));
            transformer.on("time", function(time) {
                var fmted =  Math.round(time / 10) / 100 + "s";
                gutil.log("JS transform took " + gutil.colors.bold.cyan(fmted));
            });

            return bundle(gulp, timestamp)
        });
        // create a merged stream
        return es.merge.apply(null, tasks);
    },

    deploy: function(gulp, browserSync, timestamp, distPath){

        var distFolder = (distPath) ? distPath  + "/app" : "dist/app"

        return gulp.src(["src/**/*.js"])
            .pipe(babel({
                presets: ["es2015"],
                plugins: ["add-module-exports", "transform-remove-console"]
            }))
            .pipe(uglify())
            .pipe(gulp.dest(distFolder));

    },



}
