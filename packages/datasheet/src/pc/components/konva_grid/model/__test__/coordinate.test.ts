import { Coordinate } from '../coordinate';

const initState = {
  rowHeight: 32,
  columnWidth: 100,
  rowCount: 10000,
  columnCount: 10000,
  containerWidth: 1000,
  containerHeight: 800,
  rowInitSize: 40,
  columnInitSize: 32,
  rowIndicesMap: {
    0: 16,
    1: 64,
  },
  columnIndicesMap: {
    0: 200,
    1: 400
  }
};

const coordinate = new Coordinate(initState);

describe('test coordinate', () => {
  // 获取列坐标
  it('get column offset', () => {
    expect(
      coordinate.getColumnOffset(0)
    ).toBe(32);

    expect(
      coordinate.getColumnOffset(5000)
    ).toBe(500432);

    expect(
      coordinate.getColumnOffset(10000)
    ).toBe(1000432);
  });

  // 获取行坐标
  it('get row offset', () => {
    expect(
      coordinate.getRowOffset(0)
    ).toBe(40);

    expect(
      coordinate.getRowOffset(5000)
    ).toBe(160056);

    expect(
      coordinate.getRowOffset(10000)
    ).toBe(320056);
  });

  // 根据横向滚动位置获取可见范围中第一列的索引
  it('get column start index', () => {
    expect(
      coordinate.getColumnStartIndex(0)
    ).toBe(0);

    expect(
      coordinate.getColumnStartIndex(10000)
    ).toBe(95);

    expect(
      coordinate.getColumnStartIndex(20000)
    ).toBe(195);
  });

  // 根据横向滚动位置获取可见范围中最后一列的索引
  it('get column stop index', () => {
    expect(
      coordinate.getColumnStopIndex(0, 0)
    ).toBe(5);

    expect(
      coordinate.getColumnStopIndex(95, 10000)
    ).toBe(105);

    expect(
      coordinate.getColumnStopIndex(195, 20000)
    ).toBe(205);
  });

  // 根据纵向滚动位置获取可见范围中第一行的索引
  it('get row start index', () => {
    expect(
      coordinate.getRowStartIndex(0)
    ).toBe(0);

    expect(
      coordinate.getRowStartIndex(10000)
    ).toBe(310);

    expect(
      coordinate.getRowStartIndex(20000)
    ).toBe(623);
  });

  // 根据纵向滚动位置获取可见范围中最后一行的索引
  it('get row stop index', () => {
    expect(
      coordinate.getRowStopIndex(0, 0)
    ).toBe(23);

    expect(
      coordinate.getRowStopIndex(310, 10000)
    ).toBe(335);

    expect(
      coordinate.getRowStopIndex(623, 20000)
    ).toBe(648);
  });
});