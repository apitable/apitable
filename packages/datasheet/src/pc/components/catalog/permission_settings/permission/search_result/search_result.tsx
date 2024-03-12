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

import Image from 'next/image';
import { FC } from 'react';
import { ThemeName } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { useAppSelector } from 'pc/store/react-redux';
import NotDataImgDark from 'static/icon/datasheet/empty_state_dark.png';
import NotDataImgLight from 'static/icon/datasheet/empty_state_light.png';
import styles from './style.module.less';

export interface ISearchResultProps {
  isEmpty?: boolean;
}

export const SearchResult: FC<React.PropsWithChildren<ISearchResultProps>> = ({ isEmpty, children }) => {
  const themeName = useAppSelector((state) => state.theme);
  const NotDataImg = themeName === ThemeName.Light ? NotDataImgLight : NotDataImgDark;
  if (isEmpty) {
    return (
      <div className={styles.notData}>
        <span style={{ marginTop: 40 }}>
          <Image src={NotDataImg} alt={t(Strings.no_search_result)} width={160} height={120} />
        </span>
        <div className={styles.tip}>{t(Strings.no_search_result)}</div>
      </div>
    );
  }

  return <div className={styles.searchResult}>{children}</div>;
};
