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

export const RecordOperationArea: React.FC<React.PropsWithChildren<IRecordOperationArea>> = props => {
  const { datasheetId, activeRecordId, recordIds, fromCurrentDatasheet, modalClose, switchRecord, gotoSourceDst, showPageTurn } = props;
  const dispatch = useDispatch();
  const isEmbed = useSelector(state => Boolean(state.pageParams.embedId));
  const isRecordFullScreen = useSelector(state => state.space.isRecordFullScreen);
  const showLinkBtn = !fromCurrentDatasheet && !isEmbed;
  const showOperateArea = showLinkBtn || showPageTurn; 
  return (
    <div className={styles.operateAreaWrapper}>
      {showOperateArea && <div className={styles.operateArea}>
        <span className={styles.divideLine} />
        {showLinkBtn && (
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
      </div>}
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