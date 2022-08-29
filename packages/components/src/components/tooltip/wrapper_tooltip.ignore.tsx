import React, { Fragment } from 'react';
import { Tooltip } from './tooltip';
import { IWrapperTooltip } from './interface';

export const WrapperTooltip: React.FC<IWrapperTooltip> = (props) => {
  const { tip, wrapper, children } = props;

  if (wrapper) {
    return <Tooltip content={tip}>
      {children}
    </Tooltip>;
  }
  return <Fragment>
    {children}
  </Fragment>;
};
