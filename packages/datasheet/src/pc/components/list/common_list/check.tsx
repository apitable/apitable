import { useThemeColors } from '@vikadata/components';
import * as React from 'react';
import IconCheck from 'static/icon/common/common_icon_select.svg';

interface ICheckProps {
  isChecked: boolean;
}

export const Check: React.FC<ICheckProps> = props => {
  const colors = useThemeColors();
  const { isChecked } = props;
  if (isChecked) {
    return <IconCheck width={16} height={16} fill={colors.primaryColor} />;
  }
  return <></>;
};
