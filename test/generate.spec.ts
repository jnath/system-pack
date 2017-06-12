
import * as fs from 'fs';
import * as path from 'path';
import * as rimraf from 'rimraf';


const featuresPath: string = path.join(__dirname, 'features');

const packageJSON: any = {
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

export function addDeps(depName: string, version: string) {
  packageJSON.dependencies[depName] = version;
  let pkgPath: string = path.join(featuresPath, 'package.json');
  fs.unlinkSync(pkgPath)
  fs.writeFileSync(pkgPath, JSON.stringify(packageJSON, null, 2));
}

export function createModule(pkg: {
  name: string,
  main?: string,
  devDependencies?: { [name: string]: string }
  dependencies?: { [name: string]: string }
}, genIndex: boolean = false, subFolder?: { index?: boolean }) {
  let modulePath: string = path.join(featuresPath, `./node_modules/${pkg.name}`);
  fs.mkdirSync(modulePath);
  fs.writeFileSync(path.join(modulePath, 'package.json'), JSON.stringify(pkg, null, 2));
  if (pkg.main || genIndex) {
    fs.writeFileSync(path.join(modulePath, pkg.main || 'index.js'), '');
  }
  if (subFolder) {
    let mySubFolderPath: string = path.join(modulePath, './mysubFolder');
    fs.mkdirSync(mySubFolderPath);
    if (subFolder.index) {
      fs.writeFileSync(path.join(mySubFolderPath, 'index.js'), '');
    }
  }
}

export function feature() {
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


export function remove(done: () => void) {
  rimraf(featuresPath, done);
}