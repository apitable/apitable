import { Placement } from '@floating-ui/react';
import React, { PropsWithChildren } from 'react';
import { FloatUiTooltip as Tooltip } from '@apitable/components';

export interface IWrapperTooltip {
  tooltipEnable?: boolean;
  tooltip?: string;

  placement?: Placement;
  className?: string;
  options?: {
    offset?: number;
  };
  arrow?: boolean;
}

export const OrTooltip: React.FC<React.PropsWithChildren<PropsWithChildren<IWrapperTooltip>>> = (props) => {
  const { tooltip, placement, options, children, tooltipEnable } = props;

  if (tooltipEnable && tooltip) {
    return (
      <Tooltip content={tooltip} placement={placement} options={options}>
        <span>{children}</span>
      </Tooltip>
    );
  }
  return <>{children}</>;
};
