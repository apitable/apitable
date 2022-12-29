import { FC } from 'react';
import { Select, Typography } from '@apitable/components';
import styles from './style.module.less';
import { RecordVision, StoreActions, Strings, t, TrackEvents } from '@apitable/core';
import { useDispatch, useSelector } from 'react-redux';
import { setStorage, StorageMethod, StorageName } from 'pc/utils/storage';
import { tracker } from 'pc/utils/tracker';

const options = [
  {
    label: t(Strings.expand_record_vision_setting_center),
    value: RecordVision.Center
  }, {
    label: t(Strings.expand_record_vision_setting_side),
    value: RecordVision.Side
  }
];

export const RecordVisionSetting: FC = () => {
  const value = useSelector(state => state.recordVision);

  const dispatch = useDispatch();

  const handleSelected = (option) => {
    const newValue: RecordVision = option.value;
    if (newValue === value) {
      return;
    }
    setStorage(StorageName.RecordVision, newValue, StorageMethod.Set);
    dispatch(StoreActions.setRecordVision(newValue));
    dispatch(StoreActions.toggleSideRecord(false));
    tracker.track(TrackEvents.RecordCard, {
      recordCardStyle: newValue
    });
  };

  return (
    <div className={styles.expandRecordVisionSetting}>
      <Typography variant="h7" className={styles.title}>{t(Strings.expand_record_vision_setting)}</Typography>
      <Select
        options={options}
        value={value || RecordVision.Center}
        onSelected={handleSelected}
        dropdownMatchSelectWidth
        triggerStyle={{ width: 200 }}
      />
    </div >
  );
};
