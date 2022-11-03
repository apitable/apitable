/* eslint-disable */
let arr = [];
let each = arr.forEach;
let slice = arr.slice;

export function defaults(obj) {
  each.call(slice.call(arguments, 1), function(source) {
    if (source) {
      for (var prop in source) {
        if (obj[prop] === undefined) {
          obj[prop] = source[prop];
        }
      }
    }
  });
  return obj;
}

export function extend(obj) {
  each.call(slice.call(arguments, 1), function(source) {
    for (var prop in source) {
      if (source) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
}
