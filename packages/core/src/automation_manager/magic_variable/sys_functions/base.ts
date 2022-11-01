// built-in functions which are not related to runtime context, just pure functions

export const getArrayLength = (_context: any, array: any[]): number => {
  // if (!array) return 0;
  return array?.length;
};

/**
 * reduce dimension of array
 * @param context 
 * @param array 
 * @returns 
 */
export const flatten = (_context: any, array: any[]): any[] => {
  return array?.flat();
};

/**
 * get value by json path
 * ({a:{b:1}},['a','b']) => 1
 * if the obj is an array, ([{a:1},{a:2}] ,['a']) => "1,2"
 */
export const getObjectProperty = (_context: any, obj: object, paths: string[]) => {
  const getValue = (obj: any, paths: string[]) => {
    let value = obj;
    for (const path of paths) {
      if (value == null) {
        return null;
      }
      value = value[path];
    }
    return value;
  };
  // [{color: {name:1}},{color: {name:2}}] ,['color'] = > [{name:1},{name:2}]
  if (Array.isArray(obj)) {
    const items = obj.map((item) => getValue(item, paths));
    if (items.every((item) => item == null || ['string', 'number', 'boolean'].includes(typeof item))) {
      return items.join(', ');
    }
    return items;
  }
  return getValue(obj, paths);
};

/**
 * concat paragraph with '\n'
 * @param args 
 * @returns 
 */
export const concatParagraph = (...args: string[]) => {
  const [, ...paragraphs] = args;
  return paragraphs.join('\n');
};

/**
 * concat string with ''
 */
export const concatString = (...args: string[]) => {
  const [, ...strings] = args;
  return strings.join('');
};

/**
 * the factory function of object to make a new object
 * [key1,value1,key2,value2,...] => {key1:value1,key2:value2,...}
 */
export const newObject = (...args: any[]) => {
  const [, ...restArgs] = args;
  // [key1,value1,key2,value2,...] => [[key1,value1],[key2,value2]]
  const keyValuePairs = restArgs.reduce((acc, cur, index) => {
    if (index % 2 === 0) {
      acc.push([cur, restArgs[index + 1]]);
    }
    return acc;
  }, []);
  return Object.fromEntries(keyValuePairs);
};

/**
 * the factory function of array to make a new array
 */
export const newArray = (...args: any[]) => {
  const [, ...restArgs] = args;
  return new Array(...restArgs);
};

/**
 * logical and
 */
export const and = (...args: any[]) => {
  const [, ...restArgs] = args;
  // console.log('and', args);
  return restArgs.every(Boolean);
};

/**
 * logical or
 */
export const or = (...args: any[]) => {
  const [, ...restArgs] = args;
  // console.log('or', args);
  return restArgs.some(Boolean);
};

/**
 * just json stringify
 * @param args
 * @returns 
 */
export const JSONStringify = (_context: any, obj: object) => {
  // console.log('JSONStringify', obj);
  return JSON.stringify(obj);
};

/**
 * get length of iterable object
 * @param _context 
 * @param obj 
 */
export const length = (_context: any, obj: string | any[]) => {
  return obj?.length;
};