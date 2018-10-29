"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validators = {
    exists: (variable) => {
        return variable && variable !== null && variable !== undefined;
    },
    minLength: (variable, length) => {
        return variable.length >= length;
    },
    isType: (variable, type) => {
        return typeof variable === type;
    }
};
//# sourceMappingURL=index.js.map