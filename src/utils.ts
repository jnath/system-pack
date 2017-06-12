
import * as fs from 'fs';
import * as path from 'path';

export function parallel(arr: Array<Function>, cb: () => void) {
  let complete: number = 0;
  if (!arr || arr.length === 0) {
    cb();
  }
  for (let i: number = 0; i < arr.length; i++) {
    let fn = arr[i];
    fn(() => {
      if (complete >= arr.length - 1) {
        return cb();
      }
      complete++;
    })
  }
}

export function mapFolder(folder: string, relative?: string, list: any = {}): any {
  fs.readdirSync(folder).forEach((file: string) => {
    let filePath: string = path.join(folder, file);
    let rel: string = path.relative(relative || folder, folder);
    if (fs.statSync(filePath).isDirectory()) {
      mapFolder(filePath, relative, list);
    }
    if (rel !== '' && file === 'index.js') {
      list[rel] = path.join(rel, file);
    }
  })
  return list;
}