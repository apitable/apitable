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

import { Badge, Tooltip } from 'antd';
import { Selectors, Strings, t } from '@apitable/core';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import styles from './style.module.less';
import classNames from 'classnames';
import { useThemeColors } from '@apitable/components';
import { AutoSaveLottie } from 'pc/components/tab_bar/view_sync_switch/auto_save_lottie';
import Trigger from 'rc-trigger';
import { useClickAway, useToggle } from 'ahooks';
import { PopupContent } from 'pc/components/tab_bar/view_sync_switch/popup_content';
import { ManualSaveLottie } from 'pc/components/tab_bar/view_sync_switch/manual_save_lottie';

export const ViewSyncStatus = ({ viewId }: { viewId: string }) => {
  const colors = useThemeColors();
  const { datasheetId, shareId } = useSelector(state => state.pageParams)!;
  const snapshot = useSelector(Selectors.getSnapshot)!;
  const [visible, { toggle }] = useToggle(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const currentView = useSelector(() => {
    return Selectors.getCurrentViewBase(snapshot, viewId, datasheetId);
  });
  const isViewAutoSave = Boolean(currentView?.autoSave);
  const isViewLock = Boolean(currentView?.lockInfo);

  useClickAway(() => {
    toggle();
  }, contentRef, 'mousedown');

  return <Tooltip
    title={isViewAutoSave ? t(Strings.auto_save_has_been_opend) : t(Strings.view_configuration_tooltips)}
  >
    <Trigger
      popup={
        <PopupContent
          autoSave={isViewAutoSave}
          viewId={viewId}
          datasheetId={datasheetId!}
          onClose={toggle}
          contentRef={contentRef}
          shareId={shareId}
          isViewLock={isViewLock}
        />
      }
      destroyPopupOnHide
      popupAlign={
        { points: ['tc', 'bc'], offset: [0, 10], overflow: { adjustX: true, adjustY: true }}
      }
      popupStyle={{
        position: 'absolute',
        zIndex: 1000,
        width: 320,
        background: colors.highestBg,
        boxShadow: colors.shadowCommonHighest,
        borderRadius: '4px',
      }}
      popupVisible={visible}
    >
      <div
        className={classNames({
          [styles.syncSpan]: currentView?.autoSave,
        })}
        id={'view_item_sync_icon'}
        style={{ margin: '0px 4px', width: 16, height: 16, display: 'flex' }}
        onClick={() => {
          toggle();
        }}
      >
        {
          isViewAutoSave ? <AutoSaveLottie /> :(
            <Badge dot>
              <ManualSaveLottie />
            </Badge>)
        }
        {
          visible && <span className={styles.arrow} />
        }
      </div>
    </Trigger>
  </Tooltip>;
};
