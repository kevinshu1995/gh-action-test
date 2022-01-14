const fs = require("fs");

exports.readFile = file => {
    return new Promise(function (resolve, reject) {
        fs.readFile(file, "utf8", function (err, content) {
            err ? reject(err) : resolve(content);
        });
    });
};

exports.writeFile = (targetFile, content) => {
    return new Promise(function (resolve, reject) {
        fs.writeFile(targetFile, content, "utf8", function (err) {
            err ? reject(err) : resolve("Write file Success!");
        });
    });
};
