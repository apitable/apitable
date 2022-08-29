import { getLanguage } from '@vikadata/core';
import { StyleConfig } from './config';

export const getStyleConfig = (model: keyof typeof StyleConfig) => {
  const lang = getLanguage();
  return StyleConfig[model][lang];
};

getStyleConfig('gantt_mobile_unit_select_width');
