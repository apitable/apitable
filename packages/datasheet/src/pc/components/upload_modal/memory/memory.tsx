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

import { Progress } from 'antd';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { Api, byteMG, IAttachmentValue, Strings, t } from '@apitable/core';
import { stopPropagation } from 'pc/utils';
import styles from './styles.module.less';

interface IMemory {
  cellValue: IAttachmentValue[];
}

export const Memory: React.FC<React.PropsWithChildren<IMemory>> = (props) => {
  const { cellValue } = props;
  const [usedMemory, setUsedMemory] = useState(0);
  const [totalMemory, setTotalMemory] = useState(0);
  const colors = useThemeColors();
  useEffect(() => {
    Api.searchSpaceSize().then((res) => {
      const { usedCapacity, currentBundleCapacity } = res.data.data;
      setUsedMemory(usedCapacity);
      setTotalMemory(currentBundleCapacity === -1 ? Number.POSITIVE_INFINITY : currentBundleCapacity);
    });
    // eslint-disable-next-line
  }, [cellValue]);

  const usePercent = Math.ceil((usedMemory / totalMemory) * 100);
  const isOverLimit = usedMemory > totalMemory;

  return (
    <div
      style={{
        flex: 1,
        borderTop: !cellValue || cellValue.length === 0 ? 'none' : '',
      }}
      onMouseDown={stopPropagation}
      className={styles.progress}
    >
      <span>{t(Strings.storage_per_space)}：</span>
      <Progress
        percent={usePercent}
        showInfo={false}
        className={styles.progressWrapper}
        strokeColor={isOverLimit ? colors.errorColor : colors.primaryColor}
      />
      <span
        style={{
          color: isOverLimit ? colors.errorColor : '',
        }}
      >
        {byteMG(usedMemory)}/{byteMG(totalMemory)}
      </span>
      {/*{*/}
      {/*  isOverLimit &&*/}
      {/*  <div className={styles.tip}>*/}
      {/*    <IconWord width={16} height={16} fill={colors.warningColor} />*/}
      {/*    {t(Strings.full_memory_tip)}*/}
      {/*  </div>*/}
      {/*}*/}
    </div>
  );
};
