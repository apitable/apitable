import { noop } from 'lodash';

let _endEditCell = noop;

// 提供给其他地方，将表格中聚焦的单元格保存并失焦
export const endEditCell = () => {
  _endEditCell();
};

export const setEndEditCell = (fn: () => void) => {
  _endEditCell = fn;
};
