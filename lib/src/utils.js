"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function parallel(arr, cb) {
    let complete = 0;
    if (!arr || arr.length === 0) {
        cb();
    }
    for (let i = 0; i < arr.length; i++) {
        let fn = arr[i];
        fn(() => {
            if (complete >= arr.length - 1) {
                return cb();
            }
            complete++;
        });
    }
}
exports.parallel = parallel;
function mapFolder(folder, relative, list = {}) {
    fs.readdirSync(folder).forEach((file) => {
        let filePath = path.join(folder, file);
        let rel = path.relative(relative || folder, folder);
        if (fs.statSync(filePath).isDirectory()) {
            mapFolder(filePath, relative, list);
        }
        if (rel != '' && file === 'index.js') {
            list[rel] = path.join(rel, file);
        }
    });
    return list;
}
exports.mapFolder = mapFolder;
//# sourceMappingURL=utils.js.map