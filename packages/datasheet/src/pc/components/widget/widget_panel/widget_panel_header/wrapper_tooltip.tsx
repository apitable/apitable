import { Tooltip } from 'antd';
import { PropsWithChildren } from 'react';

interface IWrapperTooltip {
  wrapper: boolean;
  tip: string;
  style?: React.CSSProperties;
}

export const WrapperTooltip: React.FC<PropsWithChildren<IWrapperTooltip>> = props => {
  const { tip, wrapper, children, style } = props;

  if (wrapper) {
    return (
      <Tooltip title={tip}>
        <span style={{ display: 'inline-block', ...style }}>{children}</span>
      </Tooltip>
    );
  }
  return <>{children}</>;
};
