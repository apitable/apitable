// 和运行时上下文无关的函数

export const getArrayLength = (_context: any, array: any[]): number => {
  // if (!array) return 0;
  return array?.length;
};

/**
 * 将数组拍平，降低一个维度。
 * @param context 
 * @param array 
 * @returns 
 */
export const flatten = (context: any, array: any[]): any[] => {
  return array?.flat();
};

/**
 * json path 取值
 * ({a:{b:1}},['a','b']) => 1
 * 这里兼容数组的语意 ([{a:1},{a:2}] ,['a']) => "1,2"
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
 * 段落拼接 \n
 * @param args 
 * @returns 
 */
export const concatParagraph = (...args) => {
  const [, ...paragraphs] = args;
  return paragraphs.join('\n');
};

/**
 * 字符串拼接
 */
export const concatString = (...args) => {
  const [, ...strings] = args;
  return strings.join('');
};

/**
 * 构造对象
 * [key1,value1,key2,value2,...] => {key1:value1,key2:value2,...}
 */
export const newObject = (...args) => {
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
 * 构造数组
 */
export const newArray = (...args) => {
  const [, ...restArgs] = args;
  return new Array(...restArgs);
};

/**
 * 逻辑与
 */
export const and = (...args) => {
  const [, ...restArgs] = args;
  // console.log('and', args);
  return restArgs.every(Boolean);
};

/**
 * 逻辑或
 */
export const or = (...args) => {
  const [, ...restArgs] = args;
  // console.log('or', args);
  return restArgs.some(Boolean);
};

/**
 * JSON 格式化为字符串
 * @param args
 * @returns 
 */
export const JSONStringify = (_context: any, obj: object) => {
  // console.log('JSONStringify', obj);
  return JSON.stringify(obj);
};

/**
 * 获取可迭代对象的长度
 * @param _context 
 * @param obj 
 */
export const length = (_context: any, obj: string | any[]) => {
  return obj?.length;
};