"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs = require("fs");
const path = require("path");
const chai_1 = require("chai");
const generate = require("./generate.spec");
describe('cli generate system.packages.js', () => {
    beforeEach(() => {
        generate.feature();
    });
    afterEach((done) => {
        generate.remove(done);
    });
    it('should have system.packages.js file', (done) => {
        child_process_1.exec(`node ${path.join(__dirname, '../src/cli.js')}`, {
            cwd: path.join(__dirname, './features')
        }, (err, stdout, stderr) => {
            chai_1.assert.include(fs.readdirSync(path.join(__dirname, './features')), 'system.packages.js');
            done();
        });
    });
    it('should have system.packages.js with not package.json throw ENOENT', (done) => {
        fs.unlinkSync(path.join(__dirname, './features/package.json'));
        child_process_1.exec(`node ${path.join(__dirname, '../src/cli.js')}`, {
            cwd: path.join(__dirname, './features')
        }, (err, stdout, stderr) => {
            let ENOENT = err && err.message && err.message.match('Error: ENOENT: no such file or directory');
            let ENOENT_FILE = err && err.message && err.message.match(/features(\\|\/)package.json/g);
            chai_1.assert.isArray(ENOENT, 'must be a ENOENT Error');
            chai_1.assert.isArray(ENOENT_FILE, `must be a ENOENT Error for /features/package.json file`);
            done();
        });
    });
    it('should have system.packages.js with error for submodule have no package', (done) => {
        fs.unlinkSync(path.join(__dirname, './features/node_modules/module2/package.json'));
        child_process_1.exec(`node ${path.join(__dirname, '../src/cli.js')}`, {
            cwd: path.join(__dirname, './features')
        }, (err, stdout, stderr) => {
            let ENOENT = err && err.message && err.message.match('Error: ENOENT: no such file or directory');
            let ENOENT_FILE = err && err.message && err.message.match(/features(\\|\/)node_modules(\\|\/)module2(\\|\/)package.json/g);
            chai_1.assert.isArray(ENOENT, 'must be a ENOENT Error');
            chai_1.assert.isArray(ENOENT_FILE, 'must be a ENOENT Error for lib/test/features/node_modules/module2/package.json file');
            done();
        });
    });
    it.only('should have subfolder binding', (done) => {
        generate.createModule({
            name: 'module4',
            dependencies: {
                module2: '1.2.3'
            }
        }, false, { index: true });
        generate.addDeps('module4', '^1.4.5');
        child_process_1.exec(`node ${path.join(__dirname, '../src/cli.js')}`, {
            cwd: path.join(__dirname, './features')
        }, (err, stdout, stderr) => {
            let systemPackage = fs.readFileSync(path.join(__dirname, './features/system.packages.js')).toString();
            let json = JSON.parse(systemPackage.replace('SystemJS.config(', '').replace(');', ''));
            chai_1.assert.property(json, 'map');
            chai_1.assert.deepEqual(json.map, {
                subfolder: 'subfolder/index.js'
            });
            done();
        }).stdout.pipe(process.stdout);
    });
});
//# sourceMappingURL=cli.spec.js.map