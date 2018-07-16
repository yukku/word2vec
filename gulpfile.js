var gulp = require("gulp");
var runSequence = require("run-sequence");
var commandLineArgs = require("command-line-args");
var htmlGulp = require("./gulp/html.js");
var jsGulp = require("./gulp/js.js");
var assetsGulp = require("./gulp/assets.js");
var shaderGulp = require("./gulp/shader.js");

var options = commandLineArgs([
    {name: "task", type: String, defaultOption: true},
    {name: "environment", alias: "e", type: String}
]);

var timestamp = new Date().getTime();

switch (options.task){

    case "serve":

        var browserSync = require("browser-sync").create();

        browserSync.init({
            server: {
                baseDir: "public",
            },
            port: 4000,
            notify: false,
            open: false,
            reloadOnRestart: true,
            logConnections: false,
            logFileChanges: false,
            online: true,
        });

        gulp.task("html-build", htmlGulp.build.bind(this, gulp, browserSync, timestamp));
        gulp.task("assets-build", assetsGulp.build.bind(this, gulp, browserSync, timestamp));
        //gulp.task("shader-build", shaderGulp.build.bind(this, gulp, browserSync, timestamp));
        //gulp.task("shader-serve", shaderGulp.serve.bind(this, gulp, browserSync, timestamp));
        gulp.task("js-build", jsGulp.build.bind(this, gulp, browserSync, timestamp));
        gulp.task("js-serve", jsGulp.serve.bind(this, gulp, browserSync, timestamp));

        gulp.task("serve", function() {
            gulp.watch(["src/index.html"], ["html-build"]);
           // gulp.watch(["shader_precompiled"]);
            // gulp.start("html-build");
            gulp.start("assets-build");
            // gulp.start("shader-build");
            // gulp.start("shader-serve");
            // gulp.start("js-serve");
            runSequence(["html-build"], ["js-serve"])
        });

        break;

    case "build":

        gulp.task("html-build", htmlGulp.build.bind(this, gulp, browserSync, timestamp));
        gulp.task("assets-build", assetsGulp.build.bind(this, gulp, browserSync, timestamp));
        gulp.task("shader-build", shaderGulp.build.bind(this, gulp, browserSync, timestamp));
        gulp.task("js-build", jsGulp.build.bind(this, gulp, browserSync, timestamp));

        gulp.task("build", function() {

            runSequence(["html-build", "assets-build", "shader-build"], ["js-build"])

        });

        break;

    case "deploy":

        gulp.task("html-build", htmlGulp.build.bind(this, gulp, browserSync, timestamp));
        gulp.task("assets-build", assetsGulp.deploy.bind(this, gulp, browserSync, timestamp, null));
        gulp.task("shader-deploy", shaderGulp.deploy.bind(this, gulp, browserSync, timestamp, null));
        gulp.task("js-build", jsGulp.deploy.bind(this, gulp, browserSync, timestamp, null));

        gulp.task("deploy", function() {

            runSequence(["html-build", "assets-build", "shader-deploy"], ["js-build"])

        });

        break;

    case "deploy-to-akqa":

        gulp.task("assets-deploy-to-akqa",
            assetsGulp.deploy.bind(this, gulp, browserSync, timestamp, "../mustang-emblem-generator-themill"));
        gulp.task("shader-deploy-to-akqa",
            shaderGulp.deploy.bind(this, gulp, browserSync, timestamp, "../mustang-emblem-generator-themill"));
        gulp.task("js-deploy-to-akqa",
            jsGulp.deploy.bind(this, gulp, browserSync, timestamp, "../mustang-emblem-generator-themill"));

        gulp.task("deploy-to-akqa", function() {
            gulp.start("assets-deploy-to-akqa");
            gulp.start("shader-deploy-to-akqa");
            gulp.start("js-deploy-to-akqa");
        });

        break;



}
