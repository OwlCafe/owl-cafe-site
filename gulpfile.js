const gulp = require("gulp"),
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    twig = require("gulp-twig"),
    data = require("gulp-data"),
    browserify = require("browserify"),
    babelify = require("babelify"),
    watchify = require("watchify"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    browserSync = require("browser-sync").create(),
    plumber = require("gulp-plumber"),
    svgSprite = require("gulp-svg-sprite"),
    svgmin = require("gulp-svgmin"),
    shell = require("gulp-shell"),
    source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    reuseTab = require("browser-sync-reuse-tab")(browserSync, "local");

let reload = a => {
    console.log("BS Reload", a);
};

gulp.task("scss", () => {
    gulp
        .src("src/styles/*.scss")
        .pipe(
            sass({ outputStyle: "compressed" }).on("error", err => {
                console.error(err.message);
                browserSync.notify(err.message, 3000); // Display error in the browser
            })
        )
        .pipe(
            autoprefixer({
                browsers: ["last 2 versions"],
                cascade: false
            })
        )
        .pipe(gulp.dest("public/assets/css/"))
        .pipe(browserSync.stream());
});

gulp.task("svg", () => {
    gulp
        .src("src/svg/*.svg")
        .pipe(svgmin())
        .pipe(
            svgSprite({
                mode: {
                    symbol: {
                        dest: ".",
                        inline: true
                    }
                }
            })
        )
        .pipe(gulp.dest("public/assets/"));
});

gulp.task("assets", () => {
    gulp
        .src("src/assets/images/**/*.{png,jpg,jpeg,svg}")
        .pipe(gulp.dest("public/assets/"));
});

gulp.task("fonts", () => {
    gulp
        .src(["src/fonts/**/*", "node_modules/font-awesome/fonts/**/*"])
        .pipe(gulp.dest("public/assets/fonts"));
});

gulp.task("views", function() {
    return gulp
        .src("views/*.twig")
        .pipe(
            twig({
                base: ["views/templates"]
            }).on("error", err => {
                console.log(err);
            })
        )
        .pipe(gulp.dest("public"))
        .pipe(browserSync.stream());
});

gulp.task("watch:views", () => {
    gulp
        .watch(["views/**/*.twig", "views/templates/**/*.twig"], ["views"])
        .on("error", function(err) {
            console.error("Error!", err.message);
        });
});

gulp.task("browser-sync", () => {
    const bs = browserSync.init(
        {
            files: ["public/**/*"],
            server: {
                baseDir: "./public",
                serveStaticOptions: {
                    extensions: ["html"]
                }
            },
            notify: {
                styles: {
                    top: "auto",
                    bottom: "0",
                    margin: "0px",
                    padding: "5px",
                    position: "fixed",
                    fontSize: "10px",
                    zIndex: "9999",
                    borderRadius: "5px 0px 0px",
                    textAlign: "center",
                    display: "block",
                    backgroundColor: "var(--primary)",
                    color: "var(--text)"
                }
            },
            open: false
        },
        reuseTab
    );

    reload = bs.publicInstance.reload;
});

gulp.task("browserify-scripts", () => {
    watchify.args.debug = true;
    var bundler = browserify(
        "./src/scripts/browserify/script.js",
        watchify.args
    ).transform(babelify, {
        presets: ["es2015"]
    });

    function bundle(bundler) {
        return bundler
            .bundle()
            .on("error", function(err) {
                console.log(err.message);
            })
            .pipe(source("script.js"))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(
                rename("all.min.js").on("error", err => {
                    console.log(err.message);
                })
            )
            .pipe(gulp.dest("public/assets/scripts"));
    }

    return bundle(bundler);
});

gulp.task("watch:scripts", () => {
    watchify.args.debug = true;
    var bundler = watchify(
        browserify("./src/scripts/browserify/script.js", watchify.args)
    ).transform(babelify, {
        presets: ["es2015"]
    });

    bundler.on("update", rebundle);
    bundler.on("log", log => {
        console.log(log);
    });

    function rebundle() {
        return bundler
            .bundle()
            .on("error", err => {
                console.log(err.message);
            })
            .pipe(source("script.js"))
            .pipe(rename("all.min.js"))
            .pipe(gulp.dest("public/assets/scripts"))
            .pipe(browserSync.stream());
    }

    return rebundle();
});

gulp.task("watch:assets", () => {
    gulp.watch("src/assets/images/**/*.{png,jpg,jpeg,svg}", ["assets"]);
});

gulp.task("watch:fonts", () => {
    gulp.watch("src/fonts/*", ["fonts"]);
});

gulp.task("watch:svg", () => {
    gulp.watch("src/svg/**/*.svg", ["svg"]).on("change", reload);
});

gulp.task("watch:scss", () => {
    gulp.watch("src/styles/**/*.{scss,css}", ["scss"]);
});

gulp.task("browser-sync:watch", ["watch", "browser-sync"]);

gulp.task(
    "watch",
    [
        "watch:scss",
        "watch:scripts",
        "watch:assets",
        "watch:fonts",
        "watch:svg",
        "watch:views"
    ],
    () => {
        gulp.watch("./public/*.html").on("change", () => {
            reload();
        });
    }
);

gulp.task("build", [
    "views",
    "scss",
    "assets",
    "fonts",
    "svg",
    "browserify-scripts"
]);

gulp.task("default", ["build", "browser-sync:watch"]);

gulp.task(
    "create",
    shell.task(
        [
            "mkdir ./src",
            "mkdir ./views",
            "mkdir ./config",
            "mkdir ./public",
            "mkdir ./src/scripts",
            "mkdir ./src/scripts/browserify",
            "touch ./src/scripts/browserify/script.js",
            "mkdir ./src/styles",
            "touch ./src/styles/main.scss",
            "mkdir ./src/assets",
            "mkdir ./src/assets/images",
            "mkdir ./src/svg",
            "touch ./views/index.html"
        ],
        {
            ignoreErrors: true
        }
    )
);
