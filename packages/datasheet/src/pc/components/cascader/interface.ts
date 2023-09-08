import React, { MutableRefObject } from 'react';
import { ICascaderOption } from '../../utils';

export interface ICascader {
  loading?: boolean;
  options: ICascaderOption[];
  onChange: (values?: (string | number)[]) => void;
  editing?: boolean;
  cascaderRef?: MutableRefObject<any>;
  value: string[][] | string[];
  displayRender?: (label: string[]) => React.ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
  showSearch?: boolean;
}

export type IMobileCascader = Pick<ICascader, 'options' | 'onChange' | 'cascaderRef' | 'value' | 'disabled'>;
