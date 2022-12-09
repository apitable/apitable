import * as React from 'react';
import { IToolBarWrapperProps, ToolBarWrapper } from './tool_bar_wrapper';
import { useSelector } from 'react-redux';

interface IMobileHeaderBarProps {
  loading?: boolean;
}

export const MobileToolBar: React.FC<IMobileHeaderBarProps & IToolBarWrapperProps> = props => {
  const { loading, ...rest } = props;
  const embedId = useSelector(state => state.pageParams);
  if (loading || embedId) {
    return <></>;
  }
  return (
    <ToolBarWrapper {...rest} />
  );
};
