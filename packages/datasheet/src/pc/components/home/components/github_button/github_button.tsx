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

import { colorVars, Typography, useThemeColors } from '@apitable/components';
import { GithubFilled } from '@apitable/icons';
import { getEnvVariables } from '../../../../utils/env';
import styles from './style.module.less';

export const GithubButton = () => {
  const colors = useThemeColors();
  if (getEnvVariables().LOGIN_SOCIAL_ICONS_DISABLE) {
    return null;
  }
  return (
    <div className={styles.githubBtnBox}>
      <a className={styles.githubBtn} href="https://github.com/apitable/apitable" target="_blank" rel="noreferrer">
        <GithubFilled color={colorVars.textCommonPrimary} size={24} />
        <Typography variant="h7" color={colors.textCommonPrimary}>
          Star us on Github
        </Typography>
      </a>
    </div>
  );
};
