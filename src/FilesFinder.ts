
import * as fs from 'fs';
import * as path from 'path';

export default class FilesFinder {
  private _files: Array<string> = [];
  private _filesFound: {
    [file: string]: {
      exist: boolean;
    }
  } = {};

  constructor(files: Array<string>, cwd: string) {
    this._files = files;
    this._files.forEach((file: string) => {
      let exist: boolean = false;
      try {
        fs.accessSync(path.join(cwd, file));
        exist = true;
      } catch (error) {
        exist = false;
      }
      this._filesFound[file] = {
        exist: exist
      };
    })
  }

  exist(file: string): boolean {
    return this._filesFound[file].exist;
  }


}