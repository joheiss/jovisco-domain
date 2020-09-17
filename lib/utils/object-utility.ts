import {isEqual, isObject, transform } from 'lodash';

export function difference(object: any, base: Object): Object {
    // @ts-ignore
    function changes(object, base): any {
        return transform(object, function (result, value, key) {
            if (!isEqual(value, base[key])) {
                result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
            }
        });
    }
    return changes(object, base);
}
