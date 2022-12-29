import * as React from 'react';
import { ISelectFieldOption } from '@apitable/core';
import { OptionSetting } from './enum';

export interface IColorPicker {
  showRenameInput?: boolean;
  onChange?: (type: OptionSetting, id: string, value: string | number) => void;
  option: ISelectFieldOption;
  mask?: boolean;
  triggerComponent?: React.ReactElement;
}
