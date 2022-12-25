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

import { Strings, t } from '@apitable/core';
import Image from 'next/image';
import { FC } from 'react';
import SearchImage from 'static/icon/common/common_img_search_default.png';
import styles from './style.module.less';

export const SearchEmpty: FC = () => {
  return (
    <div className={styles.searchEmpty}>
      <span className={styles.img}>
        <Image src={SearchImage} alt={t(Strings.no_search_result)} width={150} height={113} />
      </span>
      <span>{t(Strings.no_search_result)}</span>
    </div>
  );
};
