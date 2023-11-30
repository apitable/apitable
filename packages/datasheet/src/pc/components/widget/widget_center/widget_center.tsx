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

import { Tabs } from 'antd';
import classNames from 'classnames';
import parser from 'html-react-parser';
import Image from 'next/image';
import * as React from 'react';
import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
// eslint-disable-next-line no-restricted-imports
import { Scrollbars } from 'react-custom-scrollbars';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Box, Button, Skeleton, ThemeName, ThemeProvider, Tooltip, Typography, useThemeColors } from '@apitable/components';
import { IMember, IWidgetPackage, Selectors, Strings, t, UnitItem, WidgetApi, WidgetReleaseType } from '@apitable/core';
import { InfoCircleOutlined, TransferOutlined, QuestionCircleOutlined, UnpublishOutlined, WarnFilled, AddOutlined } from '@apitable/icons';
import { SelectUnitModal, SelectUnitSource } from 'pc/components/catalog/permission_settings/permission/select_unit_modal';
import { Message } from 'pc/components/common';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { InstallPosition } from 'pc/components/widget/widget_center/enum';
import { WidgetPackageList } from 'pc/components/widget/widget_center/widget_package_list';
import { useQuery, useRequest } from 'pc/hooks';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import WidgetCenterEmptyDark from 'static/icon/datasheet/widget_center_empty_dark.png';
import WidgetCenterEmptyLight from 'static/icon/datasheet/widget_center_empty_light.png';
import { ScrollBar } from '../../scroll_bar';
import { useResourceManageable } from '../hooks';
import { WrapperTooltip } from '../widget_panel/widget_panel_header';
import { ContextMenu, IContextMenuMethods } from './context_menu';
import { expandWidgetCreate } from './widget_create_modal';
import styles from './style.module.less';

const { TabPane } = Tabs;

interface IWidgetCenterModalProps {
  onModalClose(installedWidgetId?: string): void;
  installPosition: InstallPosition;
}

export const WidgetCenterModal: React.FC<React.PropsWithChildren<IWidgetCenterModalProps>> = (props) => {
  const colors = useThemeColors();
  const { onModalClose, installPosition } = props;
  const [tabActiveKey, setTabActiveKey] = useState<WidgetReleaseType>(WidgetReleaseType.Global);
  const [loading, setLoading] = useState<boolean>();
  const { run: unpublishWidget } = useRequest(WidgetApi.unpublishWidget, { manual: true });
  const curOperationProps = useRef<any>();
  const { dashboardId } = useAppSelector((state) => state.pageParams);
  const manageable = useResourceManageable();
  const contextMenuRef = useRef<IContextMenuMethods>(null);
  const [selectMemberModal, setSelectMemberModal] = useState(false);
  const listStatus = useRef<WidgetReleaseType[]>([]);
  const [packageListMap, setPackageListMap] = useState<Record<WidgetReleaseType, IWidgetPackage[]> | {}>({});
  const query = useQuery();
  const showPreview = query.get('widget_preview');
  const fetchPackageList = useCallback(
    async (type: WidgetReleaseType = WidgetReleaseType.Global, refresh?: boolean) => {
      if (!refresh && packageListMap?.[type]) {
        return;
      }
      setLoading(true);
      const res = await WidgetApi.getWidgetCenterList(type);
      setLoading(false);
      const { data, success } = res.data;
      if (success) {
        setPackageListMap({ ...packageListMap, [type]: data });
      }
      listStatus.current = [...listStatus.current, type];
    },
    [packageListMap],
  );
  const needPlaceholder = (packageListMap?.[WidgetReleaseType.Global]?.length ?? 0) % 2 !== 0;

  const themeName = useAppSelector((state) => state.theme);
  const widgetCenterEmpty = themeName === ThemeName.Light ? WidgetCenterEmptyLight : WidgetCenterEmptyDark;

  useEffect(() => {
    fetchPackageList(tabActiveKey);
  }, [tabActiveKey, fetchPackageList]);

  const Title = () => {
    return (
      <div className={styles.modalHeader}>
        <Typography variant={'h4'} component={'span'} ellipsis style={{ marginRight: '4px' }}>
          {t(Strings.widget_center)}
        </Typography>
        <Tooltip content={t(Strings.widget_center_help_tooltip)} placement="right-center">
          <a href={getEnvVariables().WIDGET_CENTER_HELP_URL} target="_blank" className={styles.helpIcon} rel="noreferrer">
            <QuestionCircleOutlined size={24} color={colors.fc3} />
          </a>
        </Tooltip>
      </div>
    );
  };

  const renderTabBar = (props: any, DefaultTabBar: any) => <DefaultTabBar {...props} className={styles.tabNav} />;

  const TabItemIntroduction = ({ introduction }: { introduction: string }) => (
    <div className={styles.tabItemTips}>
      {getEnvVariables().WIDGET_CENTER_OFFICIAL_TIP_VISIBLE && (
        <>
          <InfoCircleOutlined size={16} color={colors.textCommonTertiary} />
          <span>{introduction}</span>
        </>
      )}
    </div>
  );

  const createWidget = () => {
    expandWidgetCreate({ installPosition, closeModal: onModalClose });
  };

  const menuData = [
    {
      icon: <TransferOutlined color={colors.thirdLevelText} />,
      name: t(Strings.widget_center_menu_transfer),
      onClick: (props: any) => {
        curOperationProps.current = props;
        setSelectMemberModal(true);
      },
    },
    {
      icon: <UnpublishOutlined color={colors.thirdLevelText} />,
      name: t(Strings.widget_center_menu_unpublish),
      onClick: (props: any) => {
        curOperationProps.current = props;
        Modal.confirm({
          type: 'danger',
          title: t(Strings.warning),
          content: t(Strings.widget_unpublish_modal_content),
          onOk: () =>
            unpublishWidget(props.widgetPackageId).then(() => {
              fetchPackageList(WidgetReleaseType.Space, true);
              Message.success({ content: `${t(Strings.widget_center_menu_unpublish)}${t(Strings.success)}` });
            }),
        });
      },
    },
  ];

  const showMenu = useCallback((e: React.MouseEvent, props: any) => {
    contextMenuRef && contextMenuRef.current?.show(e, props);
    e.nativeEvent.stopImmediatePropagation();
  }, []);

  const selectMemberSubmit = (checkedList: UnitItem[]) => {
    if (checkedList.length === 0) {
      return;
    }
    const selectMember = checkedList[0] as IMember;
    // Handover widget.
    Modal.warning({
      title: t(Strings.widget_transfer_modal_title, {
        widgetPackageName: curOperationProps.current.widgetPackageName,
      }),
      icon: <WarnFilled size={24} />,
      content: (
        <div className={styles.transferWidgetWrap}>
          {parser(
            t(Strings.widget_transfer_modal_content, {
              oldOwner: curOperationProps.current.authorName,
              newOwner: selectMember.memberName,
            }),
          )}
        </div>
      ),
      onOk: () => transferWidget(selectMember.memberId),
      okButtonProps: { className: styles.colorWhite, color: colors.warningColor },
      closable: true,
    });
  };

  const transferWidget = (memberId: string) => {
    WidgetApi.transferWidget(curOperationProps.current.widgetPackageId, memberId).then(() => {
      Message.success({ content: t(Strings.widget_transfer_success) });
      fetchPackageList(WidgetReleaseType.Space, true);
    });
  };

  const renderThumb = ({ style, ...props }: { style: CSSProperties }) => {
    const thumbStyle = {
      right: 4,
      borderRadius: 'inherit',
      background: 'var(--bgScrollbarDefault)',
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  const EmptyButtonWrapper = ({ children }: { children: JSX.Element }) => {
    if (!manageable) {
      return (
        <WrapperTooltip style={{ width: '100%' }} wrapper tip={t(Strings.no_permission_create_widget)}>
          {children}
        </WrapperTooltip>
      );
    }
    if (dashboardId) {
      return (
        <WrapperTooltip style={{ width: '100%' }} wrapper tip={t(Strings.tooltip_cannot_create_widget_from_dashboard)}>
          {children}
        </WrapperTooltip>
      );
    }
    return children;
  };

  return (
    <Modal
      title={<Title />}
      className={classNames(styles.widgetCenterWrap)}
      visible
      width={'856px'}
      footer={null}
      destroyOnClose
      bodyStyle={{ padding: 0 }}
      onCancel={() => onModalClose()}
      centered
    >
      <div className={styles.widgetCenterModal}>
        <Tabs
          activeKey={tabActiveKey.toString()}
          onChange={(value) => setTabActiveKey(value as any as WidgetReleaseType)}
          renderTabBar={renderTabBar}
          className={styles.widgetCenterModalTab}
        >
          <TabPane tab={t(Strings.widget_center_tab_official)} key={WidgetReleaseType.Global}>
            <ScrollBar style={{ width: '100%', height: '100%' }}>
              <TabItemIntroduction introduction={t(Strings.widget_center_official_introduction)} />
              {loading ? (
                <div className={styles.skeletonWrap}>
                  <Skeleton count={1} width="38%" />
                  <Skeleton count={2} />
                  <Skeleton count={1} width="61%" />
                </div>
              ) : (
                <WidgetPackageList
                  needPlaceholder={needPlaceholder}
                  installPosition={installPosition}
                  data={packageListMap[WidgetReleaseType.Global] ?? []}
                  onModalClose={onModalClose}
                  showMenu={showMenu}
                />
              )}
            </ScrollBar>
          </TabPane>
          {getEnvVariables().CUSTOM_WIDGET_VISIBLE && (
            <TabPane tab={<WidgetBeta text={t(Strings.widget_center_tab_space)} />} key={WidgetReleaseType.Space}>
              <Scrollbars renderThumbVertical={renderThumb} style={{ width: '100%', height: '100%' }}>
                {(packageListMap?.[WidgetReleaseType.Space]?.length || loading) && (
                  <TabItemIntroduction introduction={t(Strings.widget_center_space_introduction)} />
                )}
                {loading ? (
                  <div className={styles.skeletonWrap}>
                    <Skeleton />
                  </div>
                ) : packageListMap?.[WidgetReleaseType.Space]?.length ? (
                  <WidgetPackageList
                    needPlaceholder={needPlaceholder}
                    installPosition={installPosition}
                    data={packageListMap[WidgetReleaseType.Space] ?? []}
                    onModalClose={onModalClose}
                    releaseType={WidgetReleaseType.Space}
                    refreshList={fetchPackageList}
                    showMenu={showMenu}
                  />
                ) : (
                  <div className={styles.listEmpty}>
                    <Image src={widgetCenterEmpty} alt="" width={240} height={180} />
                    <p className={styles.emptyTitle}>{t(Strings.is_empty_widget_center_space)}</p>
                    <p className={styles.emptyDesc}>{t(Strings.widget_center_space_introduction)}</p>
                    <div className={styles.emptyFooter}>
                      <EmptyButtonWrapper>
                        <Button color="primary" disabled={!manageable || Boolean(dashboardId)} onClick={createWidget} block>
                          <div className={styles.buttonWrap}>
                            <AddOutlined size={16} color={'white'} />
                            {t(Strings.create_widget)}
                          </div>
                        </Button>
                      </EmptyButtonWrapper>
                    </div>
                  </div>
                )}
              </Scrollbars>
            </TabPane>
          )}

          {showPreview && (
            <TabPane key={WidgetReleaseType.Preview} tab={'Preview'}>
              <Scrollbars renderThumbVertical={renderThumb} style={{ width: '100%', height: '100%' }}>
                <TabItemIntroduction
                  introduction={
                    'Review the list of widget, ' +
                    'install the preview to clear the widget installed in the panel or dashboard after processing the review results.'
                  }
                />
                {loading ? (
                  <div className={styles.skeletonWrap}>
                    <Skeleton />
                  </div>
                ) : (
                  <WidgetPackageList
                    needPlaceholder={needPlaceholder}
                    installPosition={installPosition}
                    data={packageListMap[WidgetReleaseType.Preview] ?? []}
                    onModalClose={onModalClose}
                    showMenu={showMenu}
                  />
                )}
              </Scrollbars>
            </TabPane>
          )}
        </Tabs>
      </div>
      <ContextMenu ref={contextMenuRef} menuData={menuData} />
      {selectMemberModal && (
        <SelectUnitModal
          isSingleSelect
          source={SelectUnitSource.Admin}
          onSubmit={selectMemberSubmit}
          onCancel={() => setSelectMemberModal(false)}
          disableIdList={curOperationProps.current?.ownerMemberId ? [curOperationProps.current?.ownerMemberId] : []}
        />
      )}
    </Modal>
  );
};

const WidgetCenterModalWithTheme: React.FC<React.PropsWithChildren<IWidgetCenterModalProps>> = (props) => {
  const cacheTheme = useAppSelector(Selectors.getTheme);
  return (
    <ThemeProvider theme={cacheTheme}>
      <WidgetCenterModal {...props} />
    </ThemeProvider>
  );
};

export const expandWidgetCenter = (
  installPosition: InstallPosition,
  option: {
    closeModalCb?(): void;
    installedWidgetHandle?(widgetId: string): void;
  } = {},
) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const { closeModalCb, installedWidgetHandle } = option;
  const root = createRoot(container);
  const onModalClose = (installedWidgetId?: string) => {
    root.unmount();
    container.parentElement!.removeChild(container);
    closeModalCb?.();
    installedWidgetId && installedWidgetHandle && installedWidgetHandle(installedWidgetId);
  };

  root.render(
    <Provider store={store}>
      <WidgetCenterModalWithTheme onModalClose={onModalClose} installPosition={installPosition} />
    </Provider>,
  );
};

const WidgetBeta = (props: { text: string }) => {
  const colors = useThemeColors();
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {props.text}
      <Box display="flex" background={colors.rainbowPurple1} borderRadius="2px" padding="1px 4px" marginLeft="8px" alignItems="center">
        <Typography variant="h9" color={colors.rainbowPurple5}>
          BETA
        </Typography>
      </Box>
    </div>
  );
};
