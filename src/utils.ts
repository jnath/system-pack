

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