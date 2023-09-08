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

import classNames from 'classnames';
import * as React from 'react';
import { Typography, ITypographyProps, useThemeColors } from '@apitable/components';
import { QuestionCircleOutlined } from '@apitable/icons';
import styles from './style.module.less';

interface IPopUpTitleProps extends Required<Pick<ITypographyProps, 'variant'>> {
  /**
   * @description Title
   */
  title: string;

  /**
   * @description The content to be displayed on the right can be left out
   */
  rightContent?: JSX.Element;

  /**
   * @description The address of the description document, displayed as an icon, immediately above the title
   */
  infoUrl?: string;

  /**
   * @description Format
   */
  className?: string;

  /**
   * @description Format
   */
  style?: React.CSSProperties;
}

export const PopUpTitle: React.FC<React.PropsWithChildren<IPopUpTitleProps>> = (props) => {
  const colors = useThemeColors();
  const { rightContent, title, variant, infoUrl, className, style } = props;
  return (
    <div className={classNames(className, styles.popUpTitle)} style={style}>
      {/* Left side of the display */}
      <div className={styles.leftPos}>
        <Typography variant={variant}>{title}</Typography>
        {infoUrl && (
          <a href={infoUrl} target="_blank" rel="noopener noreferrer">
            <QuestionCircleOutlined color={colors.thirdLevelText} />
          </a>
        )}
      </div>
      {/* Support for customising the display on the right  */}
      {rightContent ? <div className={styles.rightPos}>{rightContent}</div> : null}
    </div>
  );
};
