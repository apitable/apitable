import { moveArrayElement } from '..';

describe('test move array element', () => {
  it('should return false while index out of bounds of array', () => {
    const arr = [1, 2, 3];
    expect(moveArrayElement(arr, -1, 1)).toBe(false);
    expect(moveArrayElement(arr, 1, 3)).toBe(false);
    expect(moveArrayElement(arr, 1, -1)).toBe(false);
    expect(moveArrayElement(arr, 3, 1)).toBe(false);
  });

  it('should return false while index to equals index from', () => {
    const arr = [1, 2, 3];
    expect(moveArrayElement(arr, 1, 1)).toBe(false);
  });

  it('should move element correctly', () => {
    let arr = [1, 2, 3, 4, 5, 6];
    let res = moveArrayElement(arr, 0, 5);
    expect(arr).toEqual([2, 3, 4, 5, 6, 1]);
    expect(res).toBe(true);

    // 从前往后插入到target之后
    arr = [1, 2, 3, 4, 5, 6];
    res = moveArrayElement(arr, 2, 4);
    expect(arr).toEqual([1, 2, 4, 5, 3, 6]);
    expect(res).toBe(true);

    // 从后往前插入到target之前
    arr = [1, 2, 3, 4, 5, 6];
    res = moveArrayElement(arr, 4, 2);
    expect(arr).toEqual([1, 2, 5, 3, 4, 6]);
    expect(res).toBe(true);
  });
});
