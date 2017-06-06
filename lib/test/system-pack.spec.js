"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SystemPackager_1 = require("../src/SystemPackager");
const chai_1 = require("chai");
describe('dependencies', function () {
    it('1 level of deps', function (done) {
        let systemPackager = new SystemPackager_1.default({
            name: "mymodule",
            dependencies: {
                "mysubmodule": "1.0.0",
            }
        });
        systemPackager.parse((pkgName, cb) => {
            if (pkgName === "mysubmodule") {
                cb(undefined, {
                    name: "mysubmodule",
                    main: 'index.js'
                });
            }
        }, (systemConfig) => {
            chai_1.assert.deepEqual(systemConfig, {
                packageConfigPaths: ['mysubmodule/package.json']
            });
            done();
        });
    });
    it('2 level of deps', function (done) {
        let systemPackager = new SystemPackager_1.default({
            name: "mymodule",
            dependencies: {
                "mysubmodule": "1.0.0",
            }
        });
        systemPackager.parse((pkgName, cb) => {
            if (pkgName === "mysubmodule") {
                cb(undefined, {
                    name: "mysubmodule",
                    main: 'index.js',
                    dependencies: {
                        "mysubmodule2": "1.0.0",
                    }
                });
            }
            else if (pkgName === "mysubmodule2") {
                cb(undefined, {
                    name: "mysubmodule2",
                    main: 'index.js',
                });
            }
        }, (systemConfig) => {
            chai_1.assert.deepEqual(systemConfig, {
                packageConfigPaths: [
                    'mysubmodule/package.json',
                    'mysubmodule2/package.json'
                ]
            });
            done();
        });
    });
    it('no main found', function (done) {
        let systemPackager = new SystemPackager_1.default({
            name: "mymodule",
            dependencies: {
                "mysubmodule": "1.0.0",
            }
        });
        systemPackager.parse((pkgName, cb) => {
            if (pkgName === "mysubmodule") {
                systemPackager.addPackage(pkgName, {
                    main: 'index.js'
                });
                cb(undefined, {
                    name: "mysubmodule",
                });
            }
        }, (systemConfig) => {
            chai_1.assert.deepEqual(systemConfig, {
                packages: {
                    'mysubmodule': {
                        "main": "index.js"
                    }
                }
            });
            done();
        });
    });
    it('with system configuration', function (done) {
        let systemPackager = new SystemPackager_1.default({
            name: "mymodule",
            dependencies: {
                "mysubmodule": "1.0.0",
            },
            system: {
                packages: {}
            }
        });
        systemPackager.parse((pkgName, cb) => {
            if (pkgName === "mysubmodule") {
                systemPackager.addPackage(pkgName, {
                    main: 'index.js'
                });
                cb(undefined, {
                    name: "mysubmodule",
                });
            }
        }, (systemConfig) => {
            chai_1.assert.deepEqual(systemConfig, {
                packages: {
                    'mysubmodule': {
                        "main": "index.js"
                    }
                }
            });
            done();
        });
    });
    it('with system override package', function (done) {
        let systemPackager = new SystemPackager_1.default({
            name: "mymodule",
            dependencies: {
                "mysubmodule": "1.0.0",
            },
            system: {
                packages: {
                    "mysubmodule": {
                        main: 'index.js'
                    }
                }
            }
        });
        systemPackager.parse((pkgName, cb) => {
            if (pkgName === "mysubmodule") {
                cb(undefined, {
                    name: "mysubmodule",
                });
            }
        }, (systemConfig) => {
            chai_1.assert.deepEqual(systemConfig, {
                packages: {
                    'mysubmodule': {
                        "main": "index.js"
                    }
                }
            });
            done();
        });
    });
});
describe('init', function () {
    it('whith no deps', function (done) {
        let systemPackager = new SystemPackager_1.default({
            name: "mymodule",
        });
        function getPackage(pkgName, cb) {
            throw "NO-GET-PACKAGE";
        }
        chai_1.assert.throw(getPackage);
        systemPackager.parse(getPackage, () => {
            done();
        });
    });
});
//# sourceMappingURL=system-pack.spec.js.map