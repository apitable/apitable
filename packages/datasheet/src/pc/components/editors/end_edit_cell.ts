import { noop } from 'lodash';

let _endEditCell = noop;

export const endEditCell = () => {
  _endEditCell();
};

export const setEndEditCell = (fn: () => void) => {
  _endEditCell = fn;
};
