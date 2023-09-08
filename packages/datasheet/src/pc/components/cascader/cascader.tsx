import React from 'react';
import { useResponsive } from 'pc/hooks';
import { ScreenSize } from '../common/component_display';
import { ICascader } from './interface';
import { MobileCascader } from './mobile_cascader';
import { PcCascader } from './pc_cascader';

export const Cascader = (props: ICascader) => {
  const { options, disabled, onChange, cascaderRef, ...rest } = props;
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  if (isMobile) {
    return <MobileCascader cascaderRef={cascaderRef} disabled={disabled} options={options} value={rest.value} onChange={onChange} />;
  }
  return <PcCascader {...props} />;
};
