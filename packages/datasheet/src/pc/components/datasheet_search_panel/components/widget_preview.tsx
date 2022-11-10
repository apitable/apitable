import { Button, useThemeColors } from '@vikadata/components';
import { integrateCdnHost, Settings, Strings, t, widget } from '@apitable/core';
import { CheckOutlined } from '@vikadata/icons';
import classNames from 'classnames';
import { difference } from 'lodash';
import Image from 'next/image';
import { Tooltip } from 'pc/components/common';
import * as React from 'react';
import { useState } from 'react';
import templateEmptyPng from 'static/icon/template/template_img_empty.png';
import { INodeInstalledWidget } from '../interface';
import styles from './style.module.less';

interface IWidgetPreviewProps {
  onChange(result: { datasheetId?: string; viewId?: string; widgetIds?: string[] });
  installedWidgets: INodeInstalledWidget[];
}
export const WidgetPreview: React.FC<IWidgetPreviewProps> = props => {
  const { onChange, installedWidgets } = props;
  const [selectedWidgetIds, setSelectedWidgetIds] = useState<string[]>([]);
  const colors = useThemeColors();
  const selected = (id: string) => {
    if (selectedWidgetIds.includes(id)) {
      setSelectedWidgetIds(difference(selectedWidgetIds, [id]));
    } else {
      setSelectedWidgetIds([...selectedWidgetIds, id]);
    }
  };

  return (
    <div className={styles.widgetList}>
      <h2>{t(Strings.datasheet_exist_widget)}</h2>
      <div className={styles.widgetListWrap}>
        <div className={styles.scroll}>
          {installedWidgets.length ? (
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
                      <Image src={item.widgetPackageIcon} alt="" width={16} height={16} />
                    </div>
                    <Image
                      src={item.widgetPackageCover || integrateCdnHost(Settings.widget_default_cover.value)}
                      alt=""
                      width={'100%'}
                      height={100}
                    />
                  </div>
                  <div className={styles.checked}>
                    <CheckOutlined color={colors.defaultBg} size={16} />
                  </div>
                </div>
              );
            })
          ) : (
            <Image src={templateEmptyPng} alt="" className={styles.emptyImg} />
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
