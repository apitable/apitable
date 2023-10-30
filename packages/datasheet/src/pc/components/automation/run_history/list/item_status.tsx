import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { CheckCircleFilled, CheckCircleOutlined, PlayFilled, PlayOutlined, WarnCircleFilled, WarnCircleOutlined } from '@apitable/icons';

import { RobotRunStatusEnums } from '../../../robot/interface';

export const ItemStatus = ({ status, variant = 'outlined' }: { status: RobotRunStatusEnums; variant: 'outlined' | 'filled' }) => {
  const colors = useThemeColors();
  if (variant === 'outlined') {
    switch (status) {
      case RobotRunStatusEnums.SUCCESS:
        return <CheckCircleOutlined color={colors.textSuccessDefault} size={16} />;
      case RobotRunStatusEnums.ERROR:
      case RobotRunStatusEnums.LIMIT:
        return <WarnCircleOutlined color={colors.textWarnDefault} size={16} />;
      case RobotRunStatusEnums.RUNNING:
        return <PlayOutlined color={colors.textBrandDefault} size={16} />;
      default: {
        return <PlayOutlined color={colors.textBrandDefault} size={16} />;
      }
    }
  }

  return (
    <>
      {status === RobotRunStatusEnums.RUNNING && <PlayFilled color={colors.textBrandDefault} size={16} />}
      {status === RobotRunStatusEnums.SUCCESS && <CheckCircleFilled color={colors.textSuccessDefault} size={16} />}
      {(status === RobotRunStatusEnums.ERROR || status === RobotRunStatusEnums.LIMIT) && (
        <WarnCircleFilled color={colors.textWarnDefault} size={16} />
      )}
    </>
  );
};
