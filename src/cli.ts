#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import SystemPackager, { Package, GetPackageHandlerCb, SystemConfig } from './SystemPackager';
import FilesFinder from './FilesFinder';

const join = path.posix.join;

let outfile: string = 'system.packages.js';
let baseModulePath: string = 'node_modules';
let defaultMainList: Array<string> = [
  'index.js'
];
let basePath: string = process.cwd();

function getFile(fileName: string, cwd: string, cb: (err?: NodeJS.ErrnoException, data?: string) => void) {
  let filePath: string = join(cwd, fileName);
  fs.readFile(filePath, "utf-8", (err: NodeJS.ErrnoException, data: string) => {
    if (err) {
      return cb(err);
    }

    cb(undefined, data);
  })
}

function getPackage(packagePath: string, cb: (err?: NodeJS.ErrnoException, data?: Package) => void) {
  getFile('package.json', packagePath, (err: NodeJS.ErrnoException, data: string) => {
    if (err) {
      return cb(err);
    }
    cb(undefined, JSON.parse(data));
  });
}

function error(err: Error) {
  fs.writeFileSync(join(basePath, outfile), err);
}

function noMain(submodulePackagePath: string, systemPackager: SystemPackager, pkg: Package) {
  let filesFinder: FilesFinder = new FilesFinder(defaultMainList, submodulePackagePath);
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

getPackage(basePath, (err: NodeJS.ErrnoException, data: Package) => {
  if (err) {
    error(err);
    throw err;
  }

  let systemPackager: SystemPackager = new SystemPackager(data);

  systemPackager.parse((pkgName: string, cb: GetPackageHandlerCb) => {
    let submodulePackagePath: string = join(basePath, baseModulePath, pkgName);
    getPackage(submodulePackagePath, (err: NodeJS.ErrnoException, pkg: Package) => {
      if (err) {
        error(err);
        throw err;
      }
      if (!pkg.main) {
        noMain(submodulePackagePath, systemPackager, pkg);
      }
      cb(undefined, pkg);
    });
  }, (config: SystemConfig) => {
    config.baseURL = baseModulePath;
    let configJson = JSON.stringify(config, null, 2);
    fs.writeFileSync(join(basePath, outfile), `SystemJS.config(${configJson});`);
  });
});
