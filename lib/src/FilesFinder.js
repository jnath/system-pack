"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const join = path.posix.join;
class FilesFinder {
    constructor(files, cwd) {
        this._files = [];
        this._filesFound = {};
        this._files = files;
        this._files.forEach((file) => {
            let exist = false;
            try {
                fs.accessSync(join(cwd, file));
                exist = true;
            }
            catch (error) {
                exist = false;
            }
            this._filesFound[file] = {
                exist: exist
            };
        });
    }
    exist(file) {
        return this._filesFound[file].exist;
    }
}
exports.default = FilesFinder;
//# sourceMappingURL=FilesFinder.js.map