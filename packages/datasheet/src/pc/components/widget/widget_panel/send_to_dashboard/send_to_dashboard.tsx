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
import Image from 'next/image';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Button, Skeleton, ThemeName, useThemeColors } from '@apitable/components';
import { Api, CollaCommandName, ConfigConstant, ExecuteResult, Navigation, Selectors, StoreActions, Strings, t, WidgetApi } from '@apitable/core';
import { DashboardOutlined } from '@apitable/icons';
import { copyWidgetsToNode } from 'api/widget/api';
import { Emoji, Message, Modal } from 'pc/components/common';
import { TComponent } from 'pc/components/common/t_component';
import { Router } from 'pc/components/route_manager/router';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import NotDataImgDark from 'static/icon/datasheet/empty_state_dark.png';
import NotDataImgLight from 'static/icon/datasheet/empty_state_light.png';
import styles from './style.module.less';

interface ISentToDashboardProps {
  widgetId: string;

  onModuleDestroy(): void;
}

const SentToDashboard: React.FC<React.PropsWithChildren<ISentToDashboardProps>> = (props) => {
  const { widgetId, onModuleDestroy } = props;
  const [nodeList, setNodeList] = useState<{ nodeName: ''; nodeType: ''; nodeId: ''; icon: '' }[] | null>(null);
  const [loadingOfList, setLoadingOfList] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const dispatch = useAppDispatch();
  const [buttonLoading, setButtonLoading] = useState(false);
  const colors = useThemeColors();

  useEffect(() => {
    setLoadingOfList(true);
    Api.getSpecifyNodeList(ConfigConstant.NodeType.DASHBOARD).then((res) => {
      const { data, success } = res.data;
      setLoadingOfList(false);
      if (success) {
        setNodeList(data);
      }
    });
  }, []);

  const onClick = (nodeId: string) => {
    setSelectedId(nodeId);
  };
  const themeName = useAppSelector((state) => state.theme);
  const templateEmptyPng = themeName === ThemeName.Light ? NotDataImgLight : NotDataImgDark;

  async function copyWidget(dashboardId: string) {
    const copyData = await copyWidgetsToNode(dashboardId, [widgetId]);
    setButtonLoading(false);
    const { success, message, data } = copyData.data;
    if (success) {
      const result = resourceService.instance!.commandManager.execute({
        cmd: CollaCommandName.AddWidgetToDashboard,
        dashboardId: selectedId!,
        widgetIds: data.map((item: { id: string }) => item.id),
        cols: 12,
      });
      if (result.result === ExecuteResult.Success) {
        const openDashboard = () => {
          const spaceId = store.getState().space.activeId;
          Router.redirect(Navigation.WORKBENCH, {
            params: {
              spaceId,
              nodeId: dashboardId,
            },
          });
        };
        Message.success({
          content: (
            <>
              {t(Strings.send_widget_to_dashboard_success)}
              <i onClick={openDashboard}>{t(Strings.to_view_dashboard)}</i>
            </>
          ),
        });
      }
      onModuleDestroy();
    } else {
      Message.warning({
        content: message,
      });
    }
  }

  const sendWidget = () => {
    const dashboardId = selectedId;
    const state = store.getState();
    const dashboard = Selectors.getDashboard(state);
    setButtonLoading(true);
    if (!dashboard || dashboard.id !== dashboardId) {
      dispatch(
        StoreActions.fetchDashboardPack(dashboardId, () => {
          setButtonLoading(false);
          copyWidget(dashboardId);
        }),
      );
      return;
    }
    copyWidget(dashboardId);
  };

  return (
    <Modal
      width={558}
      title={t(Strings.space_exist_dashboard)}
      destroyOnClose
      visible
      onCancel={onModuleDestroy}
      footer={null}
      className={styles.modal}
      centered
    >
      <div className={styles.sendToDashboard}>
        <div className={styles.scroll}>
          {loadingOfList ? (
            <>
              <Skeleton style={{ height: 40 }} className={styles.loading} />
              <Skeleton style={{ height: 40 }} className={styles.loading} />
              <Skeleton style={{ height: 40 }} className={styles.loading} />
            </>
          ) : nodeList?.length ? (
            nodeList?.map((item) => {
              const isActive = selectedId === item.nodeId;
              return (
                <div
                  className={classNames(
                    {
                      [styles.active]: isActive,
                    },
                    styles.nodeItem,
                  )}
                  onClick={() => {
                    onClick(item.nodeId);
                  }}
                  key={item.nodeId}
                >
                  {item.icon ? (
                    <Emoji emoji={item.icon} size={16} set="apple" />
                  ) : (
                    <DashboardOutlined color={isActive ? colors.primaryColor : colors.fourthLevelText} />
                  )}
                  <span>{item.nodeName}</span>
                </div>
              );
            })
          ) : (
            <div className={styles.empty}>
              <div className={styles.emptyImg}>
                <Image src={templateEmptyPng} alt="" width={224} height={168} />
              </div>
              <p>
                <TComponent
                  tkey={t(Strings.empty_dashboard_list)}
                  params={{
                    action: (
                      <a href={t(Strings.intro_dashboard)} target="_blank" className={styles.shareDoc} rel="noreferrer">
                        {t(Strings.way_to_create_dashboard)}
                      </a>
                    ),
                  }}
                />
              </p>
            </div>
          )}
        </div>
        {!loadingOfList && (
          <div className={styles.footer}>
            <Button
              onClick={() => {
                onModuleDestroy();
              }}
            >
              {t(Strings.cancel)}
            </Button>
            <Button disabled={!selectedId} onClick={sendWidget} loading={buttonLoading} color={'primary'}>
              {t(Strings.submit)}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export const openSendToDashboard = (widgetId: string) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const onModalClose = () => {
    root.unmount();
    container.parentElement!.removeChild(container);
  };
  root.render(
    <Provider store={store}>
      <SentToDashboard onModuleDestroy={onModalClose} widgetId={widgetId} />
    </Provider>,
  );
};
