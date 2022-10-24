import { Api, byteMG, IAttachmentValue, Strings, t } from '@apitable/core';
import { Progress } from 'antd';
import { useThemeColors } from '@vikadata/components';
import { stopPropagation } from 'pc/utils';
import { useEffect, useState } from 'react';
import * as React from 'react';
import styles from './styles.module.less';

interface IMemory {
  cellValue: IAttachmentValue[];
}

export const Memory: React.FC<IMemory> = props => {
  const { cellValue } = props;
  const [usedMemory, setUsedMemory] = useState(0);
  const [totalMemory, setTotalMemory] = useState(0);
  const colors = useThemeColors();
  useEffect(() => {
    Api.searchSpaceSize().then(res => {
      const { usedCapacity, totalCapacity } = res.data.data;
      setUsedMemory(usedCapacity);
      setTotalMemory(totalCapacity === -1 ? Number.POSITIVE_INFINITY : totalCapacity);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
