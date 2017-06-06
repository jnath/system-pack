import SystemPackager, { Package, GetPackageHandlerCb, SystemConfig } from '../src/SystemPackager';
import * as path from 'path';
import { assert } from 'chai';

describe('dependencies', function () {
  it('1 level of deps', function (done) {
    let systemPackager: SystemPackager = new SystemPackager({
      name: "mymodule",
      dependencies: {
        "mysubmodule": "1.0.0",
      }
    });
    systemPackager.parse((pkgName: string, cb: GetPackageHandlerCb) => {
      if (pkgName === "mysubmodule") {
        cb(undefined, {
          name: "mysubmodule",
          main: 'index.js'
        })
      }
    }, (systemConfig: SystemConfig) => {

      assert.deepEqual(systemConfig, {
        packageConfigPaths: ['mysubmodule/package.json']
      });
      done();
    });
  });
  it('2 level of deps', function (done) {
    let systemPackager: SystemPackager = new SystemPackager({
      name: "mymodule",
      dependencies: {
        "mysubmodule": "1.0.0",
      }
    });
    systemPackager.parse((pkgName: string, cb: GetPackageHandlerCb) => {
      if (pkgName === "mysubmodule") {
        cb(undefined, {
          name: "mysubmodule",
          main: 'index.js',
          dependencies: {
            "mysubmodule2": "1.0.0",
          }
        })
      } else if (pkgName === "mysubmodule2") {
        cb(undefined, {
          name: "mysubmodule2",
          main: 'index.js',
        })
      }
    }, (systemConfig: SystemConfig) => {

      assert.deepEqual(systemConfig, {
        packageConfigPaths: [
          'mysubmodule/package.json',
          'mysubmodule2/package.json'
        ]
      });

      done();
    });
  });
  it('no main found', function (done) {
    let systemPackager: SystemPackager = new SystemPackager({
      name: "mymodule",
      dependencies: {
        "mysubmodule": "1.0.0",
      }
    });

    systemPackager.parse((pkgName: string, cb: GetPackageHandlerCb) => {
      if (pkgName === "mysubmodule") {
        systemPackager.addPackage(pkgName, {
          main: 'index.js'
        });
        cb(undefined, {
          name: "mysubmodule",
        })
      }
    }, (systemConfig: SystemConfig) => {

      assert.deepEqual(systemConfig, {
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
    let systemPackager: SystemPackager = new SystemPackager({
      name: "mymodule",
      dependencies: {
        "mysubmodule": "1.0.0",
      },
      system: {
        packages: {}
      }
    });
    systemPackager.parse((pkgName: string, cb: GetPackageHandlerCb) => {
      if (pkgName === "mysubmodule") {
        systemPackager.addPackage(pkgName, {
          main: 'index.js'
        });
        cb(undefined, {
          name: "mysubmodule",
        })
      }
    }, (systemConfig: SystemConfig) => {

      assert.deepEqual(systemConfig, {
        packages: {
          'mysubmodule': {
            "main": "index.js"
          }
        }
      });
      done();
    });
  })
  it('with system override package', function (done) {
    let systemPackager: SystemPackager = new SystemPackager({
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
    systemPackager.parse((pkgName: string, cb: GetPackageHandlerCb) => {
      if (pkgName === "mysubmodule") {
        cb(undefined, {
          name: "mysubmodule",
        })
      }
    }, (systemConfig: SystemConfig) => {

      assert.deepEqual(systemConfig, {
        packages: {
          'mysubmodule': {
            "main": "index.js"
          }
        }
      });

      done();
    });
  })

});
describe('init', function () {
  it('whith no deps', function (done) {
    let systemPackager: SystemPackager = new SystemPackager({
      name: "mymodule",
    });
    function getPackage(pkgName: string, cb: GetPackageHandlerCb) {
      throw "NO-GET-PACKAGE";
    }
    assert.throw(getPackage)
    systemPackager.parse(getPackage, () => {
      done();
    });
  })
})
