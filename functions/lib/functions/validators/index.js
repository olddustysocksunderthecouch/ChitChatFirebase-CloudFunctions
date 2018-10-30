"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validators = {
    exists: (variable) => {
        const doesExist = !!variable && variable !== null && variable !== undefined;
        if (!doesExist)
            console.log(`Exists?: ${doesExist}`);
        return doesExist;
    },
    minLength: (variable, length) => {
        const hasMinLength = variable.length >= length;
        if (!hasMinLength)
            console.log(`Has a min length of ${length}?: ${hasMinLength}`);
        return hasMinLength;
    },
    isType: (variable, type) => {
        const hasType = typeof variable === type;
        if (!hasType)
            console.log(`Has type '${type}'?: ${hasType}, it is ${typeof variable}`);
        return hasType;
    }
};
//# sourceMappingURL=index.js.map