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

import Image from 'next/image';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, IconButton, Skeleton, ThemeName, useThemeColors } from '@apitable/components';
import { integrateCdnHost, IReduxState, Settings, Strings, t, WidgetApi } from '@apitable/core';
import { ChevronRightOutlined, CloseOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Message, Tooltip } from 'pc/components/common';
import { SearchPanel, SecondConfirmType } from 'pc/components/datasheet_search_panel';
import { useAppSelector } from 'pc/store/react-redux';
import { getUrlWithHost } from 'pc/utils';
import NotDataImgDark from 'static/icon/datasheet/empty_state_dark.png';
import NotDataImgLight from 'static/icon/datasheet/empty_state_light.png';
import { ScrollBar } from '../../scroll_bar';
import { createWidgetByExistWidgetId } from '../utils';
import styles from './style.module.less';

interface IRecommendWidgetPanelProps {
  setVisibleRecommend: React.Dispatch<React.SetStateAction<boolean>>;
  visibleRecommend: boolean;
  readonly: boolean;
}

interface IRecentInstalledItem {
  datasheetId: string;
  datasheetName: string;
  widgetId: string;
  widgetName: string;
  widgetPackageCover: string;
  widgetPackageIcon: string;
}

export const RecommendWidgetPanel: React.FC<React.PropsWithChildren<IRecommendWidgetPanelProps>> = (props) => {
  const { setVisibleRecommend, visibleRecommend, readonly } = props;
  const colors = useThemeColors();
  const [loading, setLoading] = useState(false);
  const [installingWidgetIds, setInstallingWidgetIds] = useState<null | string[]>(null);
  const dashboardId = useAppSelector((state) => state.pageParams.dashboardId)!;
  const spaceId = useAppSelector((state) => state.space.activeId);
  const activeNodePrivate = useAppSelector((state) =>
    state.catalogTree.treeNodesMap[dashboardId]?.nodePrivate || state.catalogTree.privateTreeNodesMap[dashboardId]?.nodePrivate
  );
  const [recommendList, serRecommendList] = useState<IRecentInstalledItem[]>([]);
  const [searchPanelVisible, setSearchPanelVisible] = useState(false);
  const rootNodeId = useAppSelector((state: IReduxState) => state.catalogTree.rootId);
  const themeName = useAppSelector((state) => state.theme);
  const templateEmptyPng = themeName === ThemeName.Light ? NotDataImgLight : NotDataImgDark;

  const importWidget = ({ widgetIds }: any) => {
    quoteWidget(widgetIds);
    setVisibleRecommend(false);
    setSearchPanelVisible(false);
  };

  useEffect(() => {
    if (!visibleRecommend) {
      return;
    }
    setLoading(true);
    WidgetApi.getRecentInstalledWidgets(spaceId!, activeNodePrivate ? 3 : 1).then((res) => {
      setLoading(false);
      const { data, success } = res.data;
      if (success) {
        serRecommendList(data);
      }
    });
  }, [visibleRecommend, spaceId, activeNodePrivate]);

  const quoteWidget = async (widgetIds: string[]) => {
    setInstallingWidgetIds(widgetIds);

    try {
      await createWidgetByExistWidgetId(widgetIds[0], dashboardId!);
    } catch (e: any) {
      Message.error({
        content: typeof e === 'string' ? e : e?.message,
      });
      return;
    }
    setInstallingWidgetIds(null);
    Message.success({
      content: t(Strings.import_widget_success),
    });
  };

  return (
    <div className={styles.recommendWidgetPanel}>
      {loading ? (
        <div className={styles.skeleton}>
          <div className={styles.skeletonHeader}>
            <Skeleton style={{ width: 200, height: 30 }} />
          </div>
          <div className={styles.skeletonBody}>
            <Skeleton style={{ width: 248, height: 170 }} />
            <Skeleton style={{ width: 248, height: 170 }} />
          </div>
        </div>
      ) : (
        <>
          <header>
            <span className={styles.title}>{t(Strings.recent_installed_widget, { count: recommendList.length })}</span>
            <IconButton
              onClick={() => {
                setVisibleRecommend(false);
              }}
              className={styles.closeIcon}
              icon={() => <CloseOutlined color={colors.thirdLevelText} />}
            />
          </header>
          <div className={styles.operate}>
            {t(Strings.quick_import_widget)}
            {!readonly && (
              <span
                className={styles.moreWidget}
                onClick={() => {
                  setSearchPanelVisible(true);
                }}
              >
                {t(Strings.more_widget)}
                <ChevronRightOutlined size={16} color={colors.primaryColor} />
              </span>
            )}
          </div>
          <ScrollBar style={{ width: '100%', height: 222 }}>
            <main>
              {recommendList.length ? (
                recommendList.map((item) => {
                  return (
                    <section className={styles.widgetItem} key={item.widgetId}>
                      <div className={styles.widgetContainers}>
                        <div className={styles.widgetIconBox}>
                          <Image src={getUrlWithHost(item.widgetPackageIcon)} alt="" width={16} height={16} />
                        </div>
                        <div className={styles.widgetCover}>
                          <Image
                            src={getUrlWithHost(item.widgetPackageCover) || integrateCdnHost(Settings.widget_default_cover_img.value)}
                            alt=""
                            layout={'fill'}
                          />
                        </div>
                      </div>
                      <Tooltip title={item.widgetName} textEllipsis>
                        <div className={styles.widgetName}>{item.widgetName}</div>
                      </Tooltip>
                      <div className={styles.widgetFrom}>{t(Strings.widget_reference, { dst_name: item.datasheetName })}</div>
                      <Button
                        size="small"
                        color={'primary'}
                        onClick={() => {
                          quoteWidget([item.widgetId]);
                        }}
                        disabled={readonly}
                        loading={installingWidgetIds?.includes(item.widgetId)}
                      >
                        {t(Strings.import)}
                      </Button>
                    </section>
                  );
                })
              ) : (
                <span className={styles.emptyImg}>
                  <Image src={templateEmptyPng} alt="" />
                </span>
              )}
            </main>
          </ScrollBar>
        </>
      )}
      {searchPanelVisible && (
        <SearchPanel
          folderId={rootNodeId}
          secondConfirmType={SecondConfirmType.Widget}
          activeDatasheetId={''}
          setSearchPanelVisible={setSearchPanelVisible}
          onChange={importWidget}
          noCheckPermission
        />
      )}
    </div>
  );
};
