"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parallel(arr, cb) {
    let complete = 0;
    if (!arr || arr.length === 0) {
        cb();
    }
    for (let i = 0; i < arr.length; i++) {
        let fn = arr[i];
        fn(() => {
            if (complete >= arr.length - 1) {
                return cb();
            }
            complete++;
        });
    }
}
exports.parallel = parallel;
//# sourceMappingURL=utils.js.map