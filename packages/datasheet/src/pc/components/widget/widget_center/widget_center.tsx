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

import { Box, Button, IconButton, Skeleton, ThemeProvider, Tooltip, Typography, useThemeColors, ThemeName } from '@apitable/components';
import {
  CollaCommandName, ConfigConstant, Events, ExecuteResult, IMember, IWidget, IWidgetPackage, Player, ResourceType, Selectors,
  StoreActions, Strings, t, UnitItem, WidgetApi, WidgetInstallEnv, WidgetPackageStatus, WidgetReleaseType,
} from '@apitable/core';
import {
  AddOutlined, ColumnUrlOutlined, DefaultFilled, HandoverOutlined, InformationLargeOutlined, MoreOutlined, UnpublishOutlined, WarnFilled,
} from '@apitable/icons';
import { useMount } from 'ahooks';
import { Tabs } from 'antd';
import classNames from 'classnames';
import parser from 'html-react-parser';
import Image from 'next/image';
import { SelectUnitModal, SelectUnitSource } from 'pc/components/catalog/permission_settings/permission/select_unit_modal';
import { Avatar, AvatarSize, Message, UserCardTrigger } from 'pc/components/common';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { useQuery, useRequest } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { getEnvVariables } from 'pc/utils/env';
import * as React from 'react';
import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { createRoot } from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';
import IconAdd from 'static/icon/common/common_icon_add_content.svg';
import WidgetCenterEmptyLight from 'static/icon/datasheet/widget_center_empty_light.png';
import WidgetCenterEmptyDark from 'static/icon/datasheet/widget_center_empty_dark.png';

import { useResourceManageable } from '../hooks';
import { WrapperTooltip } from '../widget_panel/widget_panel_header';
import { ContextMenu, IContextMenuMethods } from './context_menu';
import { expandReviewInfo } from './review_info';
import styles from './style.module.less';
import { expandWidgetCreate } from './widget_create_modal';

const { TabPane } = Tabs;

interface IWidgetCenterModalProps {
  onModalClose(installedWidgetId?: string): void;
  installPosition: InstallPosition;
}

export enum InstallPosition {
  WidgetPanel,
  Dashboard
}

interface IWidgetPackageItemBase {
  installPosition: InstallPosition;
  onModalClose(installedWidgetId?: string): void;
  showMenu?: (e: React.MouseEvent, props: any) => void;
}

export const installWidget = (widgetPackageId: string, nodeId: string, name?: string) => {
  return new Promise<IWidget>(async(resolve, reject) => {
    const res = await WidgetApi.installWidget(nodeId, widgetPackageId, name);
    const { data, success } = res.data;
    if (success) {
      resolve(data);
    }
    reject();
  });
};

export const installToPanel = (data: IWidget, resourceId: string, resourceType: ResourceType.Mirror | ResourceType.Datasheet) => {
  return new Promise<void>((resolve, reject) => {
    const result = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddWidgetToPanel,
      resourceId: resourceId!,
      resourceType: resourceType,
      widgetId: data.id,
    });
    if (result.result === ExecuteResult.Success) {
      store.dispatch(StoreActions.receiveInstallationWidget(data.id, data));
      resolve();
    }
    reject();
  });
};

export const installToDashboard = (data: IWidget, dashboardId: string) => {
  return new Promise<void>((resolve, reject) => {
    const result = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddWidgetToDashboard,
      dashboardId,
      widgetIds: [data.id],
      cols: 12,
    });

    if (result.result === ExecuteResult.Success) {
      store.dispatch(StoreActions.receiveInstallationWidget(data.id, data));
      resolve();
    }
    reject();
  });
};

type IWidgetPackageItemProps = IWidgetPackage & IWidgetPackageItemBase;
type IWidgetPackageListProps = IWidgetPackageItemBase & {
  needPlaceholder: boolean; data: IWidgetPackage[]; releaseType?: WidgetReleaseType, refreshList?(): void
};

const WidgetPackageItemBase = (props: IWidgetPackageItemProps) => {
  const {
    cover, name, releaseType, description, widgetPackageId, installPosition, onModalClose, authorIcon, authorName, icon, showMenu, status,
    ownerUuid, ownerMemberId, extras, version, installEnv,
  } = props;
  const colors = useThemeColors();
  const isOwner = useSelector(state => state.user.info?.uuid === ownerUuid);
  const { dashboardId, datasheetId, mirrorId } = useSelector(state => state.pageParams);
  const spacePermission = useSelector(state => state.spacePermissionManage.spaceResource?.permissions || []);
  const [installing, setInstalling] = useState(false);
  const manageable = useResourceManageable();

  const toInstallWidget = async(widgetPackageId: string) => {
    const nodeId = installPosition === InstallPosition.WidgetPanel ? (mirrorId || datasheetId)! : dashboardId!;
    setInstalling(true);
    const widget = await installWidget(widgetPackageId, nodeId, name);
    setInstalling(false);
    Message.success({
      content: t(Strings.add_widget_success),
    });
    if (installPosition === InstallPosition.WidgetPanel) {
      await installToPanel(widget, nodeId, mirrorId ? ResourceType.Mirror : ResourceType.Datasheet);
      onModalClose(widget.id);
      return;
    }
    await installToDashboard(widget, nodeId);
    onModalClose(widget.id);
  };

  // Check before installing the widget, distinguish between the space station and the official different interactions.
  const installWidgetPre = (widgetPackageId: string) => {
    if (!manageable) {
      return;
    }
    if (releaseType === WidgetReleaseType.Space) {
      Modal.confirm({
        type: 'warning',
        title: t(Strings.widget_center_install_modal_title),
        width: 400,
        icon: <WarnFilled size={24} />,
        content: (
          <div className={styles.spaceWidgetInfoContent}>
            {t(Strings.widget_center_install_modal_content)}
          </div>
        ),
        okText: t(Strings.confirm),
        cancelText: t(Strings.cancel),
        onOk: () => toInstallWidget(widgetPackageId),
        okButtonProps: { className: styles.warningBtn, color: colors.warningColor, size: 'small' },
        cancelButtonProps: { size: 'small' },
      });
      return;
    }
    toInstallWidget(widgetPackageId);
  };

  // Check if the environment supports.
  const onClickInstall = () => {
    const installPosToEnvMap = {
      [InstallPosition.WidgetPanel]: WidgetInstallEnv.Panel,
      [InstallPosition.Dashboard]: WidgetInstallEnv.Dashboard,
    };
    if (installEnv && installEnv.length > 0 && !installEnv.includes(installPosToEnvMap[installPosition])) {
      Modal.confirm({
        type: 'warning',
        title: t(Strings.widget_install_error_title),
        width: 400,
        icon: <WarnFilled size={24} />,
        content: t(Strings.widget_install_error_env, {
          errorEnv: installPosition === InstallPosition.Dashboard ? t(Strings.dashboard) : t(Strings.widget_panel),
          expectEnv: installPosition !== InstallPosition.Dashboard ? t(Strings.dashboard) : t(Strings.widget_panel),
        }),
        okText: t(Strings.confirm),
        okButtonProps: { className: styles.warningBtn, color: colors.warningColor, size: 'small' },
      });
      return;
    }
    installWidgetPre(widgetPackageId);
  };

  const InstallButton = () => (
    <WrapperTooltip style={{ width: '100%' }} wrapper={!manageable} tip={t(Strings.no_permission_add_widget)}>
      <Button
        color='primary'
        prefixIcon={<IconAdd width={16} height={16} fill={'white'} />}
        onClick={onClickInstall}
        loading={installing}
        disabled={!manageable || (installPosition === InstallPosition.Dashboard && status === WidgetPackageStatus.Developing)}
        size='small'
        block
      >
        {t(Strings.install_widget)}
      </Button>
    </WrapperTooltip>
  );

  const isReview = releaseType === WidgetReleaseType.Preview;

  const VikaWidgetPackageItem = () => (
    <div className={styles.widgetPackageItem}>
      <div className={styles.imgBox}>
        <img
          src={cover}
          className={styles.headImg}
          alt={''}
          onClick={() => isReview && expandReviewInfo(props)}
        />
        <div className={styles.authorIconWrap}>
          <div className={styles.arcBoxLeft} />
          <div className={styles.avatarWrap}>
            <Avatar
              className={styles.avatar}
              style={{ border: 0 }}
              id={icon}
              src={icon}
              title={authorName}
              size={AvatarSize.Size24}
            />
          </div>
          <div className={styles.arcBoxRight} />
        </div>
        {extras?.website && <Tooltip content={t(Strings.widget_homepage_tooltip)} placement='top-center'>
          <a href={extras?.website} target='_blank' className={styles.website} rel='noreferrer'>
            <IconButton className={styles.iconButton} icon={() => <ColumnUrlOutlined color={'#696969'} />} variant='background' />
          </a>
        </Tooltip>}
      </div>
      <div className={styles.itemContent}>
        <h3>{name}</h3>
        <p>
          {description}
        </p>
        <div className={styles.developerWrap}>
          <span>{t(Strings.widget_center_publisher)}</span>
          <div className={styles.avatarWrap}>
            <Avatar
              style={{ border: 0 }}
              id={authorIcon}
              src={authorIcon}
              title={authorName}
              size={AvatarSize.Size20}
            />
          </div>
          <span>{authorName}</span>
        </div>
        {isReview && <div>{version}</div>}
        <InstallButton />
      </div>
    </div>
  );
  const ReactMoreOutlined = () => <MoreOutlined size={16} color={colors.thirdLevelText} className={styles.rotateIcon} />;
  const SpaceWidgetPackageItem = () => (
    <div className={classNames(styles.widgetPackageItem, styles.widgetPackageItemSpace)}>
      <div className={styles.headerBox}>
        <span className={styles.widgetIcon}>
          <Image layout={'fill'} src={icon} alt='' />
        </span>
        <h3>{name}</h3>
        {(isOwner || spacePermission.includes(ConfigConstant.PermissionCode.MANAGE_WIDGET)) && <IconButton
          className={styles.hoverShow}
          icon={ReactMoreOutlined}
          onClickCapture={(e) => showMenu && showMenu(e, {
            widgetPackageId,
            widgetPackageName: name,
            authorName,
            ownerMemberId,
          })} />}
      </div>
      <p className={styles.spaceWidgetDesc}>
        {description}
      </p>
      <div className={styles.developerWrap}>
        <span>{t(Strings.widget_center_publisher)}</span>
        <UserCardTrigger
          popupAlign={{
            points: ['bl', 'tl'],
            offset: [0, -8],
          }}
          userId={ownerUuid}
          permissionVisible={false}
        >
          <div className={styles.triggerWrap}>
            <div className={styles.avatarWrap}>
              <Avatar
                style={{ border: 0 }}
                id={ownerUuid}
                src={authorIcon}
                title={authorName}
                size={AvatarSize.Size20}
              />
            </div>
            <span>{authorName}</span>
          </div>
        </UserCardTrigger>
      </div>
      <InstallButton />
    </div>
  );

  return releaseType === WidgetReleaseType.Global || isReview ?
    <VikaWidgetPackageItem /> : <SpaceWidgetPackageItem />;
};
const WidgetPackageItem = React.memo(WidgetPackageItemBase);

const WidgetPackageList = (props: IWidgetPackageListProps) => {
  const { installPosition, onModalClose, needPlaceholder, data, releaseType, showMenu } = props;
  const dashboardId = useSelector(state => state.pageParams.dashboardId);
  const manageable = useResourceManageable();
  useMount(() => {
    Player.doTrigger(Events.datasheet_widget_center_modal_shown);
  });

  const createWidget = () => {
    expandWidgetCreate({ installPosition, closeModal: onModalClose });
  };

  const canCreateWidget = manageable && !dashboardId;

  return (
    <div className={styles.widgetPackageList}>
      {
        data.map(item => (
          <WidgetPackageItem
            key={item.widgetPackageId}
            {...item}
            installPosition={installPosition}
            onModalClose={onModalClose} showMenu={showMenu}
          />
        ))
      }
      {/* Dashboard does not provide a widget creation portal. */}
      {releaseType === WidgetReleaseType.Space && (
        <WrapperTooltip
          wrapper={!canCreateWidget}
          tip={!manageable ? t(Strings.no_permission_create_widget) : t(Strings.tooltip_cannot_create_widget_from_dashboard)}
        >
          <div className={classNames(
            styles.widgetPackageItem,
            styles.createWidgetWrapper,
            !canCreateWidget && styles.disableCreateWidget,
          )} onClick={() => canCreateWidget && createWidget()}>
            <AddOutlined size={16} />
            <span>{t(Strings.create_widget)}</span>
          </div>
        </WrapperTooltip>
      )}
      {needPlaceholder && <div className={styles.placeholder} />}
    </div>
  );
};

export const WidgetCenterModal: React.FC<React.PropsWithChildren<IWidgetCenterModalProps>> = (props) => {
  const colors = useThemeColors();
  const { onModalClose, installPosition } = props;
  const [tabActiveKey, setTabActiveKey] = useState<WidgetReleaseType>(WidgetReleaseType.Global);
  const [loading, setLoading] = useState<boolean>();
  const { run: unpublishWidget } = useRequest(WidgetApi.unpublishWidget, { manual: true });
  const curOperationProps = useRef<any>();
  const { dashboardId } = useSelector(state => state.pageParams);
  const manageable = useResourceManageable();
  const contextMenuRef = useRef<IContextMenuMethods>(null);
  const [selectMemberModal, setSelectMemberModal] = useState(false);
  const listStatus = useRef<WidgetReleaseType[]>([]);
  const [packageListMap, setPackageListMap] = useState<{ [key in WidgetReleaseType]?: IWidgetPackage[] }>({});
  const query = useQuery();
  const showPreview = query.get('widget_preview');
  const fetchPackageList = useCallback(async(type: WidgetReleaseType = WidgetReleaseType.Global, refresh?: boolean) => {
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
  }, [packageListMap]);
  const needPlaceholder = (packageListMap?.[WidgetReleaseType.Global]?.length ?? 0) % 2 !== 0;

  const themeName = useSelector(state => state.theme);
  const widgetCenterEmpty = themeName === ThemeName.Light ? WidgetCenterEmptyLight : WidgetCenterEmptyDark;

  useEffect(() => {
    fetchPackageList(tabActiveKey);
  }, [tabActiveKey, fetchPackageList]);

  const Title = () => {
    return <div className={styles.modalHeader}>
      <Typography variant={'h4'} component={'span'} ellipsis style={{ marginRight: '4px' }}>{t(Strings.widget_center)}</Typography>
      <Tooltip content={t(Strings.widget_center_help_tooltip)} placement='right-center'>
        <a href={getEnvVariables().WIDGET_CENTER_HELP_URL} target='_blank' className={styles.helpIcon} rel='noreferrer'>
          <InformationLargeOutlined size={24} color={colors.fc3} />
        </a>
      </Tooltip>
    </div>;
  };

  const renderTabBar = (props: any, DefaultTabBar: any) => (
    <DefaultTabBar {...props} className={styles.tabNav} />
  );

  const TabItemIntroduction = ({ introduction }: { introduction: string }) => (
    <div className={styles.tabItemTips}>
      {
        getEnvVariables().WIDGET_CENTER_OFFICIAL_TIP_VISIBLE && <>
          <DefaultFilled size={16} color={colors.thirdLevelText} />
          <span>{introduction}</span>
        </>
      }
    </div>
  );

  const createWidget = () => {
    expandWidgetCreate({ installPosition, closeModal: onModalClose });
  };

  const menuData = [
    {
      icon: <HandoverOutlined color={colors.thirdLevelText} />,
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
          onOk: () => unpublishWidget(props.widgetPackageId).then(() => {
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
          {parser(t(Strings.widget_transfer_modal_content, {
            oldOwner: curOperationProps.current.authorName,
            newOwner: selectMember.memberName,
          }))}
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

  const renderThumb = ({ style, ...props }: {
    style: CSSProperties
  }) => {
    const thumbStyle = {
      right: 4,
      borderRadius: 'inherit',
      backgroundColor: 'rgba(0,0,0,0.2)',
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

  return <Modal
    title={<Title />}
    className={classNames(
      styles.widgetCenterWrap,
    )}
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
          <Scrollbars renderThumbVertical={renderThumb} style={{ width: '100%', height: '100%' }}>

            <TabItemIntroduction introduction={t(Strings.widget_center_official_introduction)} />

            {
              loading ? <div className={styles.skeletonWrap}>
                <Skeleton count={1} width='38%' />
                <Skeleton count={2} />
                <Skeleton count={1} width='61%' />
              </div> : <WidgetPackageList
                needPlaceholder={needPlaceholder}
                installPosition={installPosition}
                data={packageListMap[WidgetReleaseType.Global] ?? []}
                onModalClose={onModalClose}
                showMenu={showMenu}
              />
            }
          </Scrollbars>
        </TabPane>
        {
          getEnvVariables().CUSTOM_WIDGET_VISIBLE &&
          <TabPane tab={<WidgetBeta text={t(Strings.widget_center_tab_space)} />} key={WidgetReleaseType.Space}>
            <Scrollbars renderThumbVertical={renderThumb} style={{ width: '100%', height: '100%' }}>
              {
                (packageListMap?.[WidgetReleaseType.Space]?.length || loading)
                && <TabItemIntroduction introduction={t(Strings.widget_center_space_introduction)} />
              }
              {loading ? <div className={styles.skeletonWrap}><Skeleton /></div> :
                (packageListMap?.[WidgetReleaseType.Space]?.length ?
                  <WidgetPackageList
                    needPlaceholder={needPlaceholder}
                    installPosition={installPosition}
                    data={packageListMap[WidgetReleaseType.Space] ?? []}
                    onModalClose={onModalClose}
                    releaseType={WidgetReleaseType.Space}
                    refreshList={fetchPackageList}
                    showMenu={showMenu}
                  /> :
                  <div className={styles.listEmpty}>
                    <Image src={widgetCenterEmpty} alt='' width={240} height={180} />
                    <p className={styles.emptyTitle}>{t(Strings.is_empty_widget_center_space)}</p>
                    <p className={styles.emptyDesc}>{t(Strings.widget_center_space_introduction)}</p>
                    <div className={styles.emptyFooter}>
                      <EmptyButtonWrapper>
                        <Button
                          color='primary'
                          disabled={!manageable || Boolean(dashboardId)}
                          onClick={createWidget}
                          block
                        >
                          <div className={styles.buttonWrap}>
                            <IconAdd width={16} height={16} fill={'white'} />
                            {t(Strings.create_widget)}
                          </div>
                        </Button>
                      </EmptyButtonWrapper>
                    </div>
                  </div>
                )
              }
            </Scrollbars>
          </TabPane>
        }

        {showPreview && <TabPane key={WidgetReleaseType.Preview} tab={'Preview'}>
          <Scrollbars renderThumbVertical={renderThumb} style={{ width: '100%', height: '100%' }}>
            <TabItemIntroduction
              introduction={
                'Review the list of widget, ' +
                'install the preview to clear the widget installed in the panel or dashboard after processing the review results.'
              }
            />
            {loading ? <div className={styles.skeletonWrap}><Skeleton /></div> : <WidgetPackageList
              needPlaceholder={needPlaceholder}
              installPosition={installPosition}
              data={packageListMap[WidgetReleaseType.Preview] ?? []}
              onModalClose={onModalClose}
              showMenu={showMenu}
            />}
          </Scrollbars>
        </TabPane>}
      </Tabs>
    </div>
    <ContextMenu ref={contextMenuRef} menuData={menuData} />
    {
      selectMemberModal &&
      (
        <SelectUnitModal
          isSingleSelect
          source={SelectUnitSource.Admin}
          onSubmit={selectMemberSubmit}
          onCancel={() => setSelectMemberModal(false)}
          disableIdList={curOperationProps.current?.ownerMemberId ? [curOperationProps.current?.ownerMemberId] : []}
        />
      )
    }
  </Modal>;
};

const WidgetCenterModalWithTheme: React.FC<React.PropsWithChildren<IWidgetCenterModalProps>> = (props) => {
  const cacheTheme = useSelector(Selectors.getTheme);
  return (
    <ThemeProvider theme={cacheTheme}>
      <WidgetCenterModal
        {...props}
      />
    </ThemeProvider>
  );
};

export const expandWidgetCenter = (
  installPosition: InstallPosition,
  option: {
    closeModalCb?(): void;
    installedWidgetHandle?(widgetId: string): void
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

  root.render((
    <Provider store={store}>
      <WidgetCenterModalWithTheme
        onModalClose={onModalClose}
        installPosition={installPosition}
      />
    </Provider>
  ));
};

const WidgetBeta = (props: { text: string }) => {
  const colors = useThemeColors();
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {props.text}
      <Box
        display='flex'
        background={colors.deepPurple[50]}
        borderRadius='2px'
        padding='1px 4px'
        marginLeft='8px'
        alignItems='center'
      >
        <Typography variant='h9' color={colors.fc0}>
          BETA
        </Typography>
      </Box>
    </div>
  );
};
