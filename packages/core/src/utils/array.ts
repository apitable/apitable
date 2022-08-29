/**
 * 移动数组
 * @export
 * @template T
 * @param {T[]} array
 * @param {number} from 移动数据的原始下标
 * @param {number} to 移动数据的目标下标
 * @returns {(T[] | boolean)}
 */
export function moveArrayElement<T>(array: T[], from: number, to: number): boolean {
  const length = array.length;

  if (from < 0 || from >= length || to < 0 || to >= length || from === to) {
    return false;
  }

  const fromItem = array[from];

  array.splice(from, 1);
  array.splice(to, 0, fromItem);

  return true;
}

/**
 * 检测 array1 与 array2 是否为相同的集合
 * @template T
 * @param {T[]} array1
 * @param {T[]} array2
 * @returns
 */
export function isSameSet<T extends number | string>(array1: T[], array2: T[]) {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return false;
  }
  const set1 = new Set(array1);
  const set2 = new Set(array2);
  if (set1.size !== set2.size) {
    return false;
  }
  for (const ele of set1) {
    if (!set2.has(ele)) {
      return false;
    }
  }
  return true;
}

/**
 * 检测 array1 是否为 array2 的子集
 *
 * @export
 * @template T
 * @param {T[]} array1
 * @param {T[]} array2
 * @returns
 */
export function isSubSet<T extends number | string>(array1: T[], array2: T[]) {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return false;
  }
  const set1 = new Set(array1);
  const set2 = new Set(array2);
  if (set1.size > set2.size) {
    return false;
  }
  for (const ele of set1) {
    if (!set2.has(ele)) {
      return false;
    }
  }
  return true;
}

/**
 * 交集是否为空
 *
 * @export
 * @template T
 * @param {T[]} array1
 * @param {T[]} array2
 * @returns
 */
export function hasIntersect<T extends number | string>(array1: T[], array2: T[]) {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return false;
  }
  const set1 = new Set(array1);
  const set2 = new Set(array2);

  for (const ele of set1) {
    if (set2.has(ele)) {
      return true;
    }
  }
  return false;
}

export function array2Map<T>(arr: T[], key: string) {
  return arr.reduce((obj: {}, element: T) => {
    obj[element[key]] = element;
    return obj;
  }, {});
}

/**
 * 获取数组的上一个索引或者下一个索引，当索引到达边界时候，从头开始。
 * @param length 数组长度
 * @param index 当前索引
 * @param plusOrNot +1 还是 -1
 */
export const getArrayLoopIndex = (length: number, index: number, plusOrNot: number) => {
  if (index == null || length <= 0) return 0;
  const newIndex = index + plusOrNot;
  if (newIndex < 0) {
    return (length + newIndex) % length;
  }
  return newIndex % length;
};

/**
 * @description 给需要排序的对象数组中的每一项增加一个 anchorIndex ,这里的 anchorIndex 就是未排序前的数组的顺序
 * @param sortList 
 */
export const addExtraAnchorIndex = <T>(sortList: T[]): (T & { anchorIndex: number })[] => {
  return sortList.map((item, index) => {
    return {
      ...item,
      anchorIndex: index,
    };
  });
};

/**
 * @description 结合上面增加的 anchorIndex, 当自定义排序函数的结果一致时，比较两项的 anchorIndex 是否一致来进行排序
 * @param sortFunc 
 * @param sortList 
 */
export const sortByExtraAnchorIndex =
  <T, S extends (T & { anchorIndex: number }) = (T & { anchorIndex: number })>(sortFunc: (a: S, b: S) => number, sortList: S[]): S[] => {
    return sortList.sort((a, b) => {
      return sortFunc(a, b) || a.anchorIndex - b.anchorIndex;
    });
  };

/**
 * a 相对于 b 的补集
 * a = [1,2,3]
 * b = [2,3,4]
 * setComplement(a,b) => [4]
 * @param a array
 * @param b array
 */
export const setComplement = (a: any[], b: any[]) => {
  const setA = new Set(a);
  return b.filter(itemB => !setA.has(itemB));
};