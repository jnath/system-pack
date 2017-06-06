"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const featuresPath = path.join(__dirname, 'features');
const packageJSON = {
    "name": "features-module",
    "version": "1.0.0",
    "main": "index.js",
    "devDependencies": {
        "devmodule1": "^0.17.7",
        "devmodule2": "^0.3.8"
    },
    "dependencies": {
        "module1": "^0.18.1",
        "module2": "^15.5.4",
        "module3": "^15.5.4"
    },
    "system": {
        "packages": {
            "/lib": {
                "defaultExtention": "js"
            }
        }
    }
};
function createModule(pkg, genIndex = false) {
    let modulePath = path.join(featuresPath, `./node_modules/${pkg.name}`);
    fs.mkdirSync(modulePath);
    fs.writeFileSync(path.join(modulePath, 'package.json'), JSON.stringify(pkg, null, 2));
    if (pkg.main || genIndex) {
        fs.writeFileSync(path.join(modulePath, pkg.main || 'index.js'), '');
    }
}
function feature() {
    // generate features
    fs.mkdirSync(featuresPath);
    fs.writeFileSync(path.join(featuresPath, 'package.json'), JSON.stringify(packageJSON, null, 2));
    fs.mkdirSync(path.join(featuresPath, './node_modules'));
    createModule({
        name: 'module1',
        dependencies: {
            module2: '1.2.3'
        }
    });
    createModule({
        name: 'module2',
        main: 'index.js'
    });
    createModule({
        name: 'module3'
    }, true);
    createModule({
        name: 'devmodule1'
    });
    createModule({
        name: 'devmodule2'
    });
}
exports.feature = feature;
function remove(done) {
    rimraf(featuresPath, done);
}
exports.remove = remove;
//# sourceMappingURL=generate.spec.js.map