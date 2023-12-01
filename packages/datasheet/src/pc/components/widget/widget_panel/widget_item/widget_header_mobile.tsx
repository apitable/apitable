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

import type { InputRef } from 'antd';
import { Input } from 'antd';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import { IconButton, useContextMenu, useThemeColors } from '@apitable/components';
import { CollaCommandName, ResourceType, Selectors, Strings, t, WidgetReleaseType } from '@apitable/core';
import { DragOutlined, ExpandOutlined, MoreOutlined, NarrowOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { useCheckInput } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { closeWidgetRoute, expandWidgetRoute } from '../../expand_widget';
import { WIDGET_MENU } from '../widget_list';
import { IWidgetPropsBase } from './interface';
import styles from './style.module.less';

interface IWidgetHeaderProps extends IWidgetPropsBase {
  widgetId: string;
  className?: string;
  widgetPanelId?: string;
  displayMode?: 'hover' | 'always';
  dragging: boolean;
}

export const WidgetHeaderMobile: React.FC<React.PropsWithChildren<IWidgetHeaderProps>> = (props) => {
  const { className, widgetId, widgetPanelId, displayMode = 'always', dragging, config = {} } = props;
  const colors = useThemeColors();
  const inputRef = useRef<InputRef>(null);
  const [rename, setRename] = useState(false);
  const { errTip, setErrTip, onCheck } = useCheckInput({
    checkLength: { max: 30, min: 0, tip: t(Strings.widget_name_length_error), trim: true },
  });

  const { show, hideAll } = useContextMenu({ id: WIDGET_MENU });
  const widget = useAppSelector((state) => {
    return Selectors.getWidget(state, widgetId);
  });
  const isExpandWidget = useAppSelector((state) => state.pageParams.widgetId === widgetId);

  const triggerMenu = (e: React.MouseEvent<HTMLElement>) => {
    show(e, {
      props: {
        widgetId,
        widgetPanelId,
        widget,
      },
    });
  };

  const saveWidgetName = (e: any) => {
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

  const nameMouseUp = (e: React.SyntheticEvent) => {
    if (!dragging && !config.hideEditName) {
      setRename(true);
    } else {
      e.stopPropagation();
    }
  };

  if (isExpandWidget) {
    return (
      <div className={classNames(styles.widgetExpandHeaderMobile)}>
        <NarrowOutlined className={styles.closeIcon} color={colors.firstLevelText} onClick={() => closeWidgetRoute(widgetId)} />
        <h2>{widget?.snapshot.widgetName}</h2>
      </div>
    );
  }

  return (
    <div
      className={classNames(
        styles.widgetHeader,
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
          <Tooltip title={errTip} visible={Boolean(errTip)}>
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
            <span onMouseUp={nameMouseUp} onTouchEnd={nameMouseUp} className={styles.name}>
              {widget?.snapshot.widgetName}
            </span>
            {widget?.releaseType === WidgetReleaseType.Space && (
              <span className={classNames(styles.tag, styles.tagPrimary)}>{t(Strings.widget_item_build)}</span>
            )}
          </>
        )}
      </span>

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
          <Tooltip title={isExpandWidget ? t(Strings.widget_collapse_tooltip) : t(Strings.widget_expand_tooltip)}>
            <IconButton icon={ReactIconExpand} />
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
          <Tooltip title={t(Strings.widget_more_settings_tooltip)}>
            <IconButton icon={ReactMoreOutlined} />
          </Tooltip>
        </span>
      )}
    </div>
  );
};
