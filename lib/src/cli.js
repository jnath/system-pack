#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const SystemPackager_1 = require("./SystemPackager");
const FilesFinder_1 = require("./FilesFinder");
let outfile = 'system.packages.js';
let baseModulePath = 'node_modules';
let defaultMainList = [
    'index.js'
];
let basePath = process.cwd();
function getFile(fileName, cwd, cb) {
    let filePath = path.join(cwd, fileName);
    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
            return cb(err);
        }
        cb(undefined, data);
    });
}
function getPackage(packagePath, cb) {
    getFile('package.json', packagePath, (err, data) => {
        if (err) {
            return cb(err);
        }
        cb(undefined, JSON.parse(data));
    });
}
function error(err) {
    fs.writeFileSync(path.join(basePath, outfile), err);
}
function noMain(submodulePackagePath, systemPackager, pkg) {
    let filesFinder = new FilesFinder_1.default(defaultMainList, submodulePackagePath);
    for (let i = 0; i < defaultMainList.length; i++) {
        let mainFile = defaultMainList[i];
        if (filesFinder.exist(mainFile)) {
            systemPackager.addPackage(pkg.name, {
                main: mainFile
            });
            break;
        }
    }
}
getPackage(basePath, (err, data) => {
    if (err) {
        error(err);
        throw err;
    }
    let systemPackager = new SystemPackager_1.default(data);
    systemPackager.parse((pkgName, cb) => {
        let submodulePackagePath = path.join(basePath, baseModulePath, pkgName);
        getPackage(submodulePackagePath, (err, pkg) => {
            if (err) {
                error(err);
                throw err;
            }
            if (!pkg.main) {
                noMain(submodulePackagePath, systemPackager, pkg);
            }
            cb(undefined, pkg);
        });
    }, (config) => {
        config.baseURL = baseModulePath;
        let configJson = JSON.stringify(config, null, 2);
        fs.writeFileSync(path.join(basePath, outfile), `SystemJS.config(${configJson});`);
    });
});
//# sourceMappingURL=cli.js.map