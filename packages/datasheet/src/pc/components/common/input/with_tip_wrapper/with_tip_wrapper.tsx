/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { FC } from 'react';
import { ITypographyProps, Typography, useThemeColors } from '@apitable/components';
import styles from './style.module.less';

export interface IWithTipWrapperProps extends ITypographyProps {
  tip: string;
  captchaVisible?: boolean;
  captchaId?: string;
}

export const WithTipWrapper: FC<React.PropsWithChildren<IWithTipWrapperProps>> = ({
  tip,
  children,
  className,
  captchaVisible,
  captchaId = '',
  ...rest
}) => {
  const colors = useThemeColors();
  return (
    <div className={className}>
      {children}
      <div className={styles.tip}>
        <Typography color={colors.errorColor} variant="body3" {...rest}>
          {tip}
        </Typography>
      </div>
      {captchaVisible && (
        <div className={styles.captchaBox}>
          <div id={captchaId} />
        </div>
      )}
    </div>
  );
};
