var gulp = require("gulp")
var through2 = require("through2")
var markdownlint = require("markdownlint")
var config = require('../config').markdownlint

gulp.task("markdownlint", function task() {
  return gulp.src(config.src, { "read": false })
    .pipe(through2.obj(function obj(file, enc, next) {
      markdownlint(
        { "files": [ file.relative ] },
        function callback(err, result) {
          var resultString = (result || "").toString()
          if (resultString) {
            console.log(resultString)
          }
          next(err, file)
        })
    }))
})
