import type { InputRef } from 'antd';
import { Input } from 'antd';
import classNames from 'classnames';
import * as React from 'react';
import { useRef, useState } from 'react';
import { Divider, IconButton, useContextMenu, useThemeColors } from '@apitable/components';
import { CollaCommandName, ResourceType, Selectors, Strings, t, WidgetPackageStatus, WidgetReleaseType } from '@apitable/core';
import { CloseOutlined, DragOutlined, MoreOutlined, ReloadOutlined, SettingOutlined, ExpandOutlined, NarrowOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { useCheckInput } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { closeWidgetRoute, expandWidgetRoute } from '../../expand_widget';
import { useCloudStorage } from '../../hooks/use_cloud_storage';
import { expandWidgetDevConfig } from '../../widget_center/widget_create_modal';
import { WIDGET_MENU } from '../widget_list';
import { IWidgetPropsBase } from './interface';
import { IWidgetBlockRefs } from './widget_block';
import styles from './style.module.less';

interface IWidgetHeaderProps extends IWidgetPropsBase {
  widgetId: string;
  className?: string;
  widgetPanelId?: string;
  displayMode?: 'hover' | 'always';
  closeModal?: () => void;
  isSettingOpened?: boolean;
  toggleSetting?: () => void;
  toggleWidgetDevMode?: () => void;
  dragging: boolean;
  setDragging: Function;
  widgetLoader: React.RefObject<IWidgetBlockRefs>;
  refreshVersion: (delta?: number | undefined) => void;
  isFullScreenWidget: boolean;
  toggleFullScreenWidget: () => void;
}

export const WidgetHeader: React.FC<React.PropsWithChildren<IWidgetHeaderProps>> = (props) => {
  const {
    className,
    widgetId,
    widgetPanelId,
    displayMode = 'hover',
    dragging,
    setDragging,
    config = {},
    closeModal,
    isSettingOpened,
    toggleSetting,
    toggleWidgetDevMode,
    widgetLoader,
    refreshVersion,
    isFullScreenWidget,
    toggleFullScreenWidget,
  } = props;
  const colors = useThemeColors();
  const inputRef = useRef<InputRef>(null);
  const [rename, setRename] = useState(false);
  const { errTip, setErrTip, onCheck } = useCheckInput({
    checkLength: { max: 30, min: 0, tip: t(Strings.widget_name_length_error), trim: true },
  });

  const { show, hideAll } = useContextMenu({ id: WIDGET_MENU });
  const widget = useAppSelector((state) => Selectors.getWidget(state, widgetId));
  const isExpandWidget = useAppSelector((state) => state.pageParams.widgetId === widgetId);
  const [pickerViewId] = useCloudStorage<string | undefined>('_picker_view_id', widgetId);

  const tooltipPlacement = isFullScreenWidget ? 'bottom' : undefined;

  const triggerMenu = (e: React.MouseEvent<HTMLElement>) => {
    show(e, {
      props: {
        widgetId,
        widgetPanelId,
        pickerViewId,
        widget,
        renameCb: () => {
          setRename(true);
        },
        deleteCb: () => {
          closeModal && closeModal();
          isExpandWidget && closeWidgetRoute(widgetId);
        },
        toggleWidgetDevMode: (devWidgetId: string | undefined, setDevWidgetId: (value?: string) => void) => {
          const { setCodeUrl, codeUrl } = widgetLoader?.current || {};
          if (devWidgetId === widgetId) {
            setDevWidgetId(undefined);
            return;
          }
          widget?.widgetPackageId &&
            setCodeUrl &&
            expandWidgetDevConfig({
              codeUrl,
              widgetId,
              onConfirm: (devUrl) => {
                devUrl && setCodeUrl(devUrl);
              },
              widgetPackageId: widget.widgetPackageId,
            });
          toggleWidgetDevMode?.();
        },
        toggleSetting,
        refreshWidget: () => {
          refreshVersion();
          widgetLoader.current?.refresh();
        },
      },
    });
  };

  const saveWidgetName = (e: any) => {
    setDragging(false);
    const value = e.target.value;
    setRename(false);
    setErrTip('');
    if (errTip || value === widget?.snapshot.widgetName) {
      return;
    }
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.SetWidgetName,
      resourceId: widgetId,
      resourceType: ResourceType.Widget,
      newWidgetName: e.target.value,
    });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onCheck(value);
  };

  const expand = () => {
    if (config.hideExpand) {
      return;
    }
    expandWidgetRoute(widgetId);
  };
  const ReactIconExpand = () => <ExpandOutlined size={16} color={colors.thirdLevelText} />;
  const ReactMoreOutlined = () => <MoreOutlined size={16} color={colors.thirdLevelText} className={styles.rotateIcon} />;

  const DividerMargin8 = () => <Divider style={{ margin: '8px' }} orientation="vertical" />;

  const nameMouseUp = (e: React.SyntheticEvent) => {
    setDragging(false);
    const now = new Date();
    // fixme: Here you should find a time less than the native dragstart trigger,
    // the document did not find a temporary first set 200ms,
    // there will be cursor into grabbing a flash of the problem, let go of the slow will not be able to enter the editor.
    if (now.getTime() - window.__pressTimer.getTime() < 200) {
      if (config.hideEditName) {
        return;
      }
      setRename(true);
    } else {
      e.stopPropagation();
    }
  };

  const nameMouseDown = () => (window.__pressTimer = new Date());

  // TODO: The action buttons on the widget header need to be refactored, it's too messy here.
  return (
    <div
      className={classNames(
        styles.widgetHeader,
        config.isDevMode && styles.widgetHeaderDev,
        isExpandWidget && styles.widgetIsExpandHeader,
        className,
        !config.hideDrag && 'dragHandle',
        dragging && styles.dragging,
      )}
    >
      {!config.hideDrag && (
        <span className={classNames(styles.dragHandle, styles.operateButton)}>
          <DragOutlined size={14} color={colors.thirdLevelText} />
        </span>
      )}
      <span className={styles.widgetName}>
        {rename && !config.hideEditName ? (
          <Tooltip title={errTip} visible={Boolean(errTip)} placement={tooltipPlacement}>
            <Input
              defaultValue={widget?.snapshot.widgetName}
              ref={inputRef}
              onPressEnter={saveWidgetName}
              size="small"
              style={{ height: 24, fontSize: '12px' }}
              onBlur={saveWidgetName}
              autoFocus
              onChange={onChange}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              className={classNames({
                [styles.error]: Boolean(errTip),
              })}
            />
          </Tooltip>
        ) : (
          <>
            <span onMouseDown={nameMouseDown} onMouseUp={nameMouseUp} onTouchEnd={nameMouseUp} onTouchStart={nameMouseDown} className={styles.name}>
              {widget?.snapshot.widgetName}
            </span>
            {config.isDevMode ? (
              <span className={classNames(styles.tag, styles.tagSuccess)}>{t(Strings.widget_item_developing)}</span>
            ) : (
              widget?.releaseType === WidgetReleaseType.Space && (
                <span className={classNames(styles.tag, styles.tagPrimary)}>{t(Strings.widget_item_build)}</span>
              )
            )}
          </>
        )}
      </span>
      {!config.hideSetting && (widget?.status !== WidgetPackageStatus.Developing || config.isDevMode) && (
        <span
          className={classNames(
            {
              [styles.npOpacity]: displayMode === 'always' || config.isDevMode || isExpandWidget,
            },
            styles.operateButton,
          )}
          onClick={() => toggleSetting?.()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Tooltip
            title={isSettingOpened ? t(Strings.widget_hide_settings_tooltip) : t(Strings.widget_show_settings_tooltip)}
            placement={tooltipPlacement}
          >
            <IconButton icon={SettingOutlined} active={isSettingOpened} />
          </Tooltip>
        </span>
      )}

      {!config.hideExpand && (
        <span
          className={classNames(
            {
              [styles.npOpacity]: displayMode === 'always' || config.isDevMode,
            },
            styles.operateButton,
            'dragHandleDisabled',
          )}
          onClick={expand}
          onMouseDown={() => {
            hideAll();
          }}
        >
          <Tooltip title={isExpandWidget ? t(Strings.widget_collapse_tooltip) : t(Strings.widget_expand_tooltip)} placement={tooltipPlacement}>
            <IconButton icon={ReactIconExpand} />
          </Tooltip>
        </span>
      )}
      {config.isDevMode && (
        <span
          data-guide-id="WIDGET_ITEM_REFRESH"
          className={classNames(styles.npOpacity, styles.operateButton, 'dragHandleDisabled')}
          onClick={() => {
            refreshVersion();
            widgetLoader?.current?.refresh?.();
          }}
        >
          <Tooltip title={t(Strings.widget_operate_refresh)} placement={tooltipPlacement}>
            <IconButton icon={ReloadOutlined} size="small" />
          </Tooltip>
        </span>
      )}
      {!config.hideMoreOperate && (
        <span
          data-guide-id="WIDGET_ITEM_MORE"
          className={classNames(
            {
              [styles.npOpacity]: displayMode === 'always' || config.isDevMode || isExpandWidget,
            },
            styles.operateButton,
            'dragHandleDisabled',
          )}
          onClick={triggerMenu}
        >
          <Tooltip title={t(Strings.widget_more_settings_tooltip)} placement={tooltipPlacement}>
            <IconButton icon={ReactMoreOutlined} />
          </Tooltip>
        </span>
      )}
      {isExpandWidget && (
        <>
          <DividerMargin8 />
          <Tooltip
            title={isFullScreenWidget ? t(Strings.widget_disable_fullscreen) : t(Strings.widget_enable_fullscreen)}
            placement={tooltipPlacement}
          >
            <IconButton
              icon={isFullScreenWidget ? NarrowOutlined : ExpandOutlined}
              style={{ marginRight: 8 }}
              onClick={() => toggleFullScreenWidget()}
            />
          </Tooltip>
          <IconButton
            icon={CloseOutlined}
            size="small"
            onClick={() => {
              isFullScreenWidget && toggleFullScreenWidget();
              closeWidgetRoute(widgetId);
            }}
          />
        </>
      )}
    </div>
  );
};
