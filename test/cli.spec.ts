
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { assert } from 'chai';

import * as generate from './generate.spec';

describe('cli generate system.packages.js', () => {

  beforeEach(() => {
    generate.feature();
  })

  afterEach((done) => {
    generate.remove(done);
  })

  it('should have system.packages.js file', (done) => {
    exec(`node ${path.join(__dirname, '../src/cli.js')}`, {
      cwd: path.join(__dirname, './features')
    }, (err, stdout, stderr) => {
      assert.include(fs.readdirSync(path.join(__dirname, './features')), 'system.packages.js')
      done();
    });
  });

  it('should have system.packages.js with error', (done) => {
    fs.unlinkSync(path.join(__dirname, './features/package.json'));
    exec(`node ${path.join(__dirname, '../src/cli.js')}`, {
      cwd: path.join(__dirname, './features')
    }, (err, stdout, stderr) => {
      let ENOENT = err && err.message && err.message.match('Error: ENOENT: no such file or directory');
      let ENOENT_FILE = err && err.message && err.message.match('lib/test/features/package.json');
      assert.isArray(ENOENT, 'must be a ENOENT Error');
      assert.isArray(ENOENT_FILE, 'must be a ENOENT Error for lib/test/features/package.json file');
      done();
    });
  });
  it('should have system.packages.js with error for submodule have no package', (done) => {
    fs.unlinkSync(path.join(__dirname, './features/node_modules/module2/package.json'));
    exec(`node ${path.join(__dirname, '../src/cli.js')}`, {
      cwd: path.join(__dirname, './features')
    }, (err, stdout, stderr) => {
      let ENOENT = err && err.message && err.message.match('Error: ENOENT: no such file or directory');
      let ENOENT_FILE = err && err.message && err.message.match('lib/test/features/node_modules/module2/package.json');
      assert.isArray(ENOENT, 'must be a ENOENT Error');
      assert.isArray(ENOENT_FILE, 'must be a ENOENT Error for lib/test/features/node_modules/module2/package.json file');
      done();
    });
  });
});