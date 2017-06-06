'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const EventEmitter = require("events");
const utils_1 = require("./utils");
class SystemPackager extends EventEmitter {
    constructor(pkg) {
        super();
        this.dependencies = pkg.dependencies || {};
        this.config = pkg.system || {};
    }
    addPackage(pkgName, config) {
        if (!this.config.packages) {
            this.config.packages = {};
        }
        this.config.packages[pkgName] = config;
    }
    hasPackage(pkgName) {
        return !!(this.config.packages && this.config.packages[pkgName]);
    }
    hasPackageConfigPaths(packageConfigPaths) {
        return !!(this.config.packageConfigPaths && this.config.packageConfigPaths.indexOf(packageConfigPaths) !== -1);
    }
    addPackageConfigPaths(packageConfigPaths) {
        if (!this.config.packageConfigPaths) {
            this.config.packageConfigPaths = [];
        }
        this.config.packageConfigPaths.push(packageConfigPaths);
    }
    parseDeps(dependencies, getPackage, cb) {
        utils_1.parallel(Object.keys(dependencies).map((depName) => {
            return this.addDependecies.bind(this, depName, getPackage);
        }), cb);
    }
    addDependecies(pkgName, getPackage, cb) {
        getPackage(pkgName, (err, pkg) => {
            let entryPathPackage = path.join(pkgName, "package.json");
            if (!this.hasPackage(pkgName) && !this.hasPackageConfigPaths(entryPathPackage)) {
                this.addPackageConfigPaths(entryPathPackage);
            }
            this.parseDeps(pkg.dependencies || {}, getPackage, cb);
        });
    }
    parse(getPackage, cb) {
        this.parseDeps(this.dependencies, getPackage, () => {
            cb(this.config);
        });
    }
}
exports.default = SystemPackager;
//# sourceMappingURL=SystemPackager.js.map