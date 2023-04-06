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

import { Button, IconButton, Skeleton, useThemeColors, ThemeName } from '@apitable/components';
import { CollaCommandName, ExecuteResult, integrateCdnHost, IReduxState, Settings, StoreActions, Strings, t, WidgetApi } from '@apitable/core';
import { ChevronRightOutlined, CloseOutlined } from '@apitable/icons';
import Image from 'next/image';
import { Message, Tooltip } from 'pc/components/common';
import { SearchPanel, SubColumnType } from 'pc/components/datasheet_search_panel';
import { resourceService } from 'pc/resource_service';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDispatch, useSelector } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import NotDataImgDark from 'static/icon/datasheet/empty_state_dark.png';
import NotDataImgLight from 'static/icon/datasheet/empty_state_light.png';
import styles from './style.module.less';
import { getUrlWithHost } from 'pc/utils';

interface IRecommendWidgetPanelProps {
  setVisibleRecommend: React.Dispatch<React.SetStateAction<boolean>>;
  visibleRecommend: boolean;
  readonly: boolean;
  installedWidgetHandle(widgetId: string): void;
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
  const { setVisibleRecommend, visibleRecommend, readonly, installedWidgetHandle } = props;
  const colors = useThemeColors();
  const [loading, setLoading] = useState(false);
  const [installingWidgetIds, setInstallingWidgetIds] = useState<null | string[]>(null);
  const dashboardId = useSelector(state => state.pageParams.dashboardId)!;
  const spaceId = useSelector(state => state.space.activeId);
  const [recommendList, serRecommendList] = useState<IRecentInstalledItem[]>([]);
  const [searchPanelVisible, setSearchPanelVisible] = useState(false);
  const rootNodeId = useSelector((state: IReduxState) => state.catalogTree.rootId);
  const dispatch = useDispatch();
  const themeName = useSelector(state => state.theme);
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
    WidgetApi.getRecentInstalledWidgets(spaceId!).then(res => {
      setLoading(false);
      const { data, success } = res.data;
      if (success) {
        serRecommendList(data);
      }
    });
  }, [visibleRecommend, spaceId]);

  const quoteWidget = (widgetIds: string[]) => {
    setInstallingWidgetIds(widgetIds);
    WidgetApi.copyWidgetsToDashboard(dashboardId!, widgetIds).then(res => {
      setInstallingWidgetIds(null);
      const { success, data, message } = res.data;
      if (success) {
        const importWidgetIds = data.map((item: any) => item.id);
        const result = resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.AddWidgetToDashboard,
          dashboardId: dashboardId!,
          widgetIds: importWidgetIds,
          cols: 12
        });
        if (result.result === ExecuteResult.Success) {
          const _batchActions: any[] = [];
          data.forEach((item: any) => {
            _batchActions.push(StoreActions.receiveInstallationWidget(item.id, item));
          });
          dispatch(batchActions(_batchActions));
          Message.info({
            content: t(Strings.import_widget_success)
          });
          installedWidgetHandle(data[data.length - 1].id);
        }
      } else {
        Message.warning({
          content: message
        });
      }
    });
  };

  return <div className={styles.recommendWidgetPanel}>
    {
      loading ? <div className={styles.skeleton}>
        <div className={styles.skeletonHeader}>
          <Skeleton style={{ width: 200, height: 30 }} />
        </div>
        <div className={styles.skeletonBody}>
          <Skeleton style={{ width: 248, height: 170 }} />
          <Skeleton style={{ width: 248, height: 170 }} />
        </div>
      </div> :
        <>
          <header>
            <span className={styles.title}>
              {
                t(Strings.recent_installed_widget, { count: recommendList.length })
              }
            </span>
            <IconButton
              onClick={() => { setVisibleRecommend(false); }}
              className={styles.closeIcon}
              icon={() => <CloseOutlined color={colors.thirdLevelText} />}
            />
          </header>
          <div className={styles.operate}>
            {t(Strings.quick_import_widget)}
            {
              !readonly &&
              <span
                className={styles.moreWidget}
                onClick={() => { setSearchPanelVisible(true); }}
              >
                {t(Strings.more_widget)}
                <ChevronRightOutlined size={16} color={colors.primaryColor} />
              </span>
            }
          </div>
          <Scrollbars style={{ width: '100%', height: 222 }}>
            <main>
              {
                recommendList.length ? recommendList.map(item => {
                  return <section className={styles.widgetItem} key={item.widgetId}>
                    <div className={styles.widgetContainers}>
                      <div className={styles.widgetIconBox}>
                        <Image src={getUrlWithHost(item.widgetPackageIcon)} alt='' width={16} height={16} />
                      </div>
                      <div className={styles.widgetCover}>
                        <Image
                          src={getUrlWithHost(item.widgetPackageCover) || integrateCdnHost(Settings.widget_default_cover_img.value)}
                          alt=''
                          layout={'fill'}
                        />
                      </div>
                    </div>
                    <Tooltip title={item.widgetName} textEllipsis>
                      <div className={styles.widgetName}>{item.widgetName}</div>
                    </Tooltip>
                    <div className={styles.widgetFrom}>
                      {
                        t(Strings.widget_reference, { dst_name: item.datasheetName })
                      }
                    </div>
                    <Button
                      size='small'
                      color={'primary'}
                      onClick={() => {
                        quoteWidget([item.widgetId]);
                      }}
                      disabled={readonly}
                      loading={installingWidgetIds?.includes(item.widgetId)}
                    >
                      {t(Strings.import)}
                    </Button>
                  </section>;
                }) :
                  <span className={styles.emptyImg}>
                    <Image src={templateEmptyPng} alt='' />
                  </span>
              }
            </main>
          </Scrollbars>
        </>
    }
    {
      searchPanelVisible && <SearchPanel
        folderId={rootNodeId}
        subColumnType={SubColumnType.Widget}
        activeDatasheetId={''}
        setSearchPanelVisible={setSearchPanelVisible}
        onChange={importWidget}
        noCheckPermission
      />
    }
  </div>;
};
