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
import { useDispatch } from 'react-redux';
// eslint-disable-next-line no-restricted-imports
import { Select, Typography } from '@apitable/components';
import { RecordVision, StoreActions, Strings, t } from '@apitable/core';
import { useAppSelector } from 'pc/store/react-redux';
import { setStorage, StorageMethod, StorageName } from 'pc/utils/storage';
import styles from './style.module.less';

const options = [
  {
    label: t(Strings.expand_record_vision_setting_center),
    value: RecordVision.Center,
  },
  {
    label: t(Strings.expand_record_vision_setting_side),
    value: RecordVision.Side,
  },
];

export const RecordVisionSetting: FC<React.PropsWithChildren<unknown>> = () => {
  const value = useAppSelector((state) => state.recordVision);

  const dispatch = useDispatch();

  const handleSelected = (option: any) => {
    const newValue: RecordVision = option.value;
    if (newValue === value) {
      return;
    }
    setStorage(StorageName.RecordVision, newValue, StorageMethod.Set);
    dispatch(StoreActions.setRecordVision(newValue));
    dispatch(StoreActions.toggleSideRecord(false));
  };

  return (
    <div className={styles.expandRecordVisionSetting}>
      <Typography variant="h7" className={styles.title}>
        {t(Strings.expand_record_vision_setting)}
      </Typography>
      <Select
        options={options}
        value={value || RecordVision.Center}
        onSelected={handleSelected}
        dropdownMatchSelectWidth
        triggerStyle={{ width: 200 }}
      />
    </div>
  );
};
