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

import classNames from 'classnames';
import { difference } from 'lodash';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Button, ThemeName, useThemeColors } from '@apitable/components';
import { integrateCdnHost, Settings, Strings, t, WidgetApi } from '@apitable/core';
import { CheckOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { useAppSelector } from 'pc/store/react-redux';
import NotDataImgDark from 'static/icon/datasheet/empty_state_dark.png';
import NotDataImgLight from 'static/icon/datasheet/empty_state_light.png';
import styles from './style.module.less';

interface IWidgetPreviewProps {
  onChange(result: { datasheetId?: string; viewId?: string; widgetIds?: string[] }): void;

  datasheetId: string;
}

export interface INodeInstalledWidget {
  datasheetId: string;
  datasheetName: string;
  widgetId: string;
  widgetName: string;
  widgetPackageCover: string;
  widgetPackageIcon: string;
}

export const WidgetPreview: React.FC<React.PropsWithChildren<IWidgetPreviewProps>> = props => {
  const { onChange, datasheetId } = props;
  const [installedWidgets, setInstalledWidgets] = useState<INodeInstalledWidget[] | null>(null);
  const [selectedWidgetIds, setSelectedWidgetIds] = useState<string[]>([]);
  const colors = useThemeColors();

  const searchDatasheetInstalledWidget = (datasheetId: string) => {
    if (!datasheetId) {
      return;
    }
    WidgetApi.getWidgetsInfoByNodeId(datasheetId).then(res => {
      const { data, success } = res.data;
      if (success) {
        setInstalledWidgets(data);
      }
    });
  };

  useEffect(() => {
    setInstalledWidgets(null);
    searchDatasheetInstalledWidget(datasheetId);
    // eslint-disable-next-line
  }, [datasheetId]);

  const selected = (id: string) => {
    if (selectedWidgetIds.includes(id)) {
      setSelectedWidgetIds(difference(selectedWidgetIds, [id]));
    } else {
      setSelectedWidgetIds([...selectedWidgetIds, id]);
    }
  };
  const themeName = useAppSelector(state => state.theme);
  const templateEmptyPng = themeName === ThemeName.Light ? NotDataImgLight : NotDataImgDark;
  return (
    <div className={styles.widgetList}>
      <h2>{t(Strings.datasheet_exist_widget)}</h2>
      <div className={styles.widgetListWrap}>
        <div className={styles.scroll}>
          {installedWidgets?.length ? (
            installedWidgets.map(item => {
              return (
                <div
                  key={item.widgetId}
                  className={classNames(
                    {
                      [styles.selected]: selectedWidgetIds.includes(item.widgetId),
                    },
                    styles.widgetItem,
                  )}
                  onClick={() => {
                    selected(item.widgetId);
                  }}
                >
                  <Tooltip title={item.widgetName} textEllipsis>
                    <h4 style={{ marginBottom: 4 }}>{item.widgetName}</h4>
                  </Tooltip>
                  <div style={{ borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                    <div className={styles.widgetIconBox}>
                      <Image src={item.widgetPackageIcon} alt="" width={16} height={16}/>
                    </div>
                    <img
                      src={item.widgetPackageCover || integrateCdnHost(Settings.widget_default_cover_img.value)}
                      alt=""
                      width={'100%'}
                    />
                  </div>
                  <div className={styles.checked}>
                    <CheckOutlined color={colors.defaultBg} size={16}/>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.emptyImg}>
              <Image src={templateEmptyPng} width={160} objectFit="contain" alt=""/>
            </div>
          )}
        </div>
      </div>
      <div style={{ position: 'relative', flexShrink: 0, zIndex: 1 }}>
        <Button
          color="primary"
          block
          disabled={!selectedWidgetIds.length}
          onClick={() => {
            onChange({ widgetIds: selectedWidgetIds });
          }}
        >
          {t(Strings.import_widget)}
        </Button>
      </div>
    </div>
  );
};
