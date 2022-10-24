import React, { FC } from 'react';
import { colors, IconButton } from '@vikadata/components';
import { Tooltip } from 'pc/components/common';
import { IIconProps, MiddlescreenOutlined, SidescreenOutlined } from '@vikadata/icons';
import styles from './style.module.less';
import { useDispatch, useSelector } from 'react-redux';
import { RecordVision, StoreActions, Strings, t, TrackEvents } from '@apitable/core';
import { setStorage, StorageMethod, StorageName } from 'pc/utils/storage';
import { tracker } from 'pc/utils/tracker';

interface IIconButtonProps {
  active: boolean,
  tooltipText: string,
  onClick: () => void,
  icon: React.FC<IIconProps>
}

const OptionButton = ({ active, onClick, tooltipText, icon: Icon }: IIconButtonProps): JSX.Element => {
  return (
    <Tooltip title={tooltipText}>
      <IconButton
        component="button"
        shape="square"
        className={active ? styles.activeIcon : styles.icon}
        icon={() => <Icon size={16} color={active ? colors.fc0 : colors.fc3} />}
        onClick={() => onClick()}
      />
    </Tooltip>
  );
};

const ExpandRecordVisionOptionBase: FC = () => {
  const recordVision = useSelector(state => state.recordVision);
  const dispatch = useDispatch();
  const isRecordFullScreen = useSelector(state => state.space.isRecordFullScreen);

  return (
    <div className={styles.visionOptionWrap}>
      <div className={styles.visionOption}>
        <span className={styles.divideLine} />
        <OptionButton
          active={!isRecordFullScreen && recordVision === RecordVision.Center}
          tooltipText={t(Strings.expand_record_vision_btn_tooltip_center)}
          icon={MiddlescreenOutlined}
          onClick={() => {
            setStorage(StorageName.RecordVision, RecordVision.Center, StorageMethod.Set);
            dispatch(StoreActions.setRecordVision(RecordVision.Center));
            tracker.track(TrackEvents.RecordCard, {
              recordCardStyle: RecordVision.Center
            });
            dispatch(StoreActions.toggleSideRecord(false));
            dispatch(StoreActions.toggleRecordFullScreen(false));
          }}
        />
        <OptionButton
          active={!isRecordFullScreen && recordVision === RecordVision.Side}
          tooltipText={t(Strings.expand_record_vision_btn_tooltip_side)}
          icon={SidescreenOutlined}
          onClick={() => {
            setStorage(StorageName.RecordVision, RecordVision.Side, StorageMethod.Set);
            dispatch(StoreActions.setRecordVision(RecordVision.Side));
            tracker.track(TrackEvents.RecordCard, {
              recordCardStyle: RecordVision.Side
            });
            dispatch(StoreActions.toggleSideRecord(true));
            // setIsFullScreen(false);
            dispatch(StoreActions.toggleRecordFullScreen(false));
          }}
        />
      </div>
    </div>
  );
};

export const ExpandRecordVisionOption = React.memo(ExpandRecordVisionOptionBase);
