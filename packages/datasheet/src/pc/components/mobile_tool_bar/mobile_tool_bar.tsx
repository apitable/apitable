import * as React from 'react';
import { IToolBarWrapperProps, ToolBarWrapper } from './tool_bar_wrapper';

interface IMobileHeaderBarProps {
  loading?: boolean;
}

export const MobileToolBar: React.FC<IMobileHeaderBarProps & IToolBarWrapperProps> = props => {
  const { loading, ...rest } = props;
  if (loading) {
    return <></>;
  }
  return (
    <ToolBarWrapper {...rest} />
  );
};
