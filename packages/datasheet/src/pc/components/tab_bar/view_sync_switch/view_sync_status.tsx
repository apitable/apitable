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

import { useLocalStorageState } from 'ahooks';
import { Badge } from 'antd';
import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import * as React from 'react';
import { Box, FloatUiTooltip, IOverLayProps, Dropdown, IDropdownControl } from '@apitable/components';
import { Selectors, Strings, t } from '@apitable/core';
import { AutoSaveLottie } from 'pc/components/tab_bar/view_sync_switch/auto_save_lottie';
import { ManualSaveLottie } from 'pc/components/tab_bar/view_sync_switch/manual_save_lottie';
import { PopupContent } from 'pc/components/tab_bar/view_sync_switch/popup_content/pc';
import { useAppSelector } from 'pc/store/react-redux';
import styles from './style.module.less';

const CONST_VIEW_PROPERTY_CONFIGURATION_POPUP = 'view_property_manually_save_popup';

interface IPopupConfigurations {
  [key: string]: Boolean;
}

export const ViewSyncStatus = ({ viewId }: { viewId: string }) => {
  const { datasheetId, shareId } = useAppSelector((state) => state.pageParams)!;

  const [popupConfiguration, setPopupConfiguration] = useLocalStorageState<IPopupConfigurations | undefined>(
    CONST_VIEW_PROPERTY_CONFIGURATION_POPUP,
    {
      defaultValue: {},
    },
  );

  const snapshot = useAppSelector(Selectors.getSnapshot)!;
  const contentRef = useRef<HTMLDivElement | null>(null);
  const currentView = useAppSelector(() => {
    return Selectors.getCurrentViewBase(snapshot, viewId, datasheetId);
  });
  const isViewAutoSave = Boolean(currentView?.autoSave);
  const isViewLock = Boolean(currentView?.lockInfo);

  const dropdownRef = useRef<IDropdownControl>(null);

  useEffect(() => {
    if (!isViewAutoSave && !popupConfiguration?.[viewId]) {
      if (!dropdownRef.current) {
        return;
      }
      dropdownRef.current?.open();
      setPopupConfiguration?.({
        ...(popupConfiguration ?? {}),
        [viewId]: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

  return (
    <FloatUiTooltip
      options={{
        offset: 12,
      }}
      content={isViewAutoSave ? t(Strings.auto_save_has_been_opend) : t(Strings.view_configuration_tooltips)}
    >
      <Box display="flex" alignItems="center">
        <Dropdown
          ref={dropdownRef}
          options={{
            placement: 'bottom',
          }}
          clazz={{
            overlay: styles.overlayStyle,
          }}
          trigger={
            <div
              className={classNames({
                [styles.syncSpan]: currentView?.autoSave,
              })}
              id={'view_item_sync_icon'}
              style={{ margin: '4px', width: 16, height: 16, display: 'flex' }}
            >
              {isViewAutoSave ? (
                <AutoSaveLottie />
              ) : (
                <Badge dot className={styles.badgeIcon}>
                  <ManualSaveLottie />
                </Badge>
              )}
            </div>
          }
        >
          {({ toggle }: IOverLayProps) => {
            return (
              <PopupContent
                autoSave={isViewAutoSave}
                viewId={viewId}
                datasheetId={datasheetId!}
                onClose={toggle}
                contentRef={contentRef}
                shareId={shareId}
                isViewLock={isViewLock}
              />
            );
          }}
        </Dropdown>
      </Box>
    </FloatUiTooltip>
  );
};
