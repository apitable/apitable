import * as React from 'react';
import { StoreActions, Strings, t, TrackEvents } from '@apitable/core';
import { GotoLargeOutlined, CloseMiddleOutlined, FullscreenOutlined, UnfullscreenOutlined } from '@apitable/icons';
import { IconButton, LinkButton } from '@apitable/components';

import { RecordPageTurn } from './record_page_turn/record_page_turn';

import { colorVars } from '@apitable/components';
import styles from './style.module.less';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'antd';
import { tracker } from 'pc/utils/tracker';

interface IRecordOperationArea {
  datasheetId: string;
  viewId: string;
  recordIds: string[];
  activeRecordId: string;
  fromCurrentDatasheet: boolean;
  switchRecord: (index: number) => void;
  gotoSourceDst: () => void;
  modalClose: () => void;
  showPageTurn?: boolean;
}

export const RecordOperationArea: React.FC<IRecordOperationArea> = props => {
  const { datasheetId, activeRecordId, recordIds, fromCurrentDatasheet, modalClose, switchRecord, gotoSourceDst, showPageTurn } = props;
  const dispatch = useDispatch();
  const isRecordFullScreen = useSelector(state => state.space.isRecordFullScreen);
  return (
    <div className={styles.operateAreaWrapper}>
      <div className={styles.operateArea}>
        <span className={styles.divideLine} />
        {!fromCurrentDatasheet && (
          <LinkButton
            underline={false}
            component="button"
            prefixIcon={<GotoLargeOutlined color={colorVars.fc3} />}
            color={colorVars.fc2}
            className={styles.sourceButton}
            onClick={gotoSourceDst}
          >
            {t(Strings.goto_datasheet_record)}
          </LinkButton>
        )}
        {showPageTurn && (
          <RecordPageTurn
            activeRecordId={activeRecordId}
            datasheetId={datasheetId}
            recordIds={recordIds}
            switchRecord={switchRecord}
          />
        )}
        <span className={styles.divideLine} />
      </div>
      <Tooltip title={t(Strings.expand_record_vision_btn_tooltip_full_screen)}>
        <IconButton
          component="button"
          shape="square"
          icon={() => (
            isRecordFullScreen
              ?
              <UnfullscreenOutlined        
                size={16}
                color={colorVars.fc3}
              />
              :
              <FullscreenOutlined
                size={16}
                color={colorVars.fc3}
              />
          )}
          onClick={() => {
            dispatch(StoreActions.toggleRecordFullScreen());
            tracker.track(TrackEvents.RecordCard, {
              recordCardStyle: 'fullScreen'
            });
          }}
          style={{ marginLeft: 4 }}
        />
      </Tooltip>
      <IconButton
        component="button"
        shape="square"
        icon={() => (
          <CloseMiddleOutlined
            size={16}
            color={colorVars.fc3}
          />
        )}
        onClick={() => modalClose()}
        style={{ marginLeft: 8 }}
      />
    </div>
  );
};