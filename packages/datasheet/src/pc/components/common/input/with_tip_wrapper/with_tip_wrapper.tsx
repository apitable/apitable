import { FC } from 'react';
import { ITypographyProps, Typography, useThemeColors } from '@vikadata/components';
import styles from './style.module.less';

export interface IWithTipWrapperProps extends ITypographyProps {
  tip: string;
  // 是否显示滑块验证码容器
  captchaVisible?: boolean;
  captchaId?: string;
}

export const WithTipWrapper: FC<IWithTipWrapperProps> = ({ tip, children, className, captchaVisible, captchaId = '', ...rest }) => {
  const colors = useThemeColors();
  return (
    <div className={className}>
      {children}
      <div className={styles.tip}>
        <Typography color={colors.errorColor} variant="body3" {...rest}>{tip}</Typography>
      </div>
      {/* 滑块验证占位元素 */}
      {captchaVisible && <div className={styles.captchaBox}><div id={captchaId} /></div>}
    </div>
  );
};
