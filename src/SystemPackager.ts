'use strict';

import * as path from 'path';
import * as EventEmitter from 'events';
import { DependencyMap, SystemConfig, PackageConfig, Package } from './Package';
import { parallel } from './utils';

export { Package, PackageConfig, SystemConfig };

export interface GetPackageHandlerCb {
  (err?: Error, pkg?: Package): void;
}
export interface GetPackageHandler {
  (pkgName: string, cb: GetPackageHandlerCb): void;
}

export default class SystemPackager extends EventEmitter {

  dependencies: DependencyMap;
  config: SystemConfig;

  constructor(pkg: Package) {
    super();
    this.dependencies = pkg.dependencies || {};
    this.config = pkg.system || {};
  }

  addPackage(pkgName: string, config: PackageConfig) {
    if (!this.config.packages) {
      this.config.packages = {};
    }
    this.config.packages[pkgName] = config;
  }

  private hasPackage(pkgName: string): boolean {
    return !!(this.config.packages && this.config.packages[pkgName]);
  }

  private hasPackageConfigPaths(packageConfigPaths: string): boolean {
    return !!(this.config.packageConfigPaths && this.config.packageConfigPaths.indexOf(packageConfigPaths) !== -1)
  }

  private addPackageConfigPaths(packageConfigPaths: string) {
    if (!this.config.packageConfigPaths) {
      this.config.packageConfigPaths = [];
    }
    this.config.packageConfigPaths.push(packageConfigPaths);
  }
  private parseDeps(dependencies: DependencyMap, getPackage: GetPackageHandler, cb: () => void) {
    parallel(Object.keys(dependencies).map((depName) => {
      return this.addDependecies.bind(this, depName, getPackage);
    }), cb);
  }
  private addDependecies(pkgName: string, getPackage: GetPackageHandler, cb: () => void) {
    getPackage(pkgName, (err: Error, pkg: Package) => {
      let entryPathPackage = path.join(pkgName, "package.json");
      if (!this.hasPackage(pkgName) && !this.hasPackageConfigPaths(entryPathPackage)) {
        this.addPackageConfigPaths(entryPathPackage)
      }
      this.parseDeps(pkg.dependencies || {}, getPackage, cb);
    });
  }
  parse(getPackage: GetPackageHandler, cb: (config: SystemConfig) => void) {
    this.parseDeps(this.dependencies, getPackage, () => {
      cb(this.config);
    });
  }

}