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

import { Tooltip } from 'antd';
import path from 'path-browserify';
import { FC } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useThemeColors } from '@apitable/components';
import { Navigation, StoreActions, Strings, t } from '@apitable/core';
import { GotoOutlined } from '@apitable/icons';
import { Method } from 'pc/components/route_manager/const';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { Router } from 'pc/components/route_manager/router';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from 'pc/utils/dom';
import styles from './style.module.less';

export enum JumpIconMode {
  Badge,
  Normal,
}

interface ILinkJumpProps {
  foreignDatasheetId: string;
  viewId?: string;
  foreignFieldId?: string | null;
  iconColor?: string;
  mode?: JumpIconMode;
  hideOperateBox?: () => void;
}

export const LinkJump: FC<React.PropsWithChildren<ILinkJumpProps>> = (props) => {
  const colors = useThemeColors();
  const { mode = JumpIconMode.Normal, children, foreignDatasheetId, foreignFieldId, viewId, hideOperateBox } = props;
  const { hasShareId, hasTemplateId, isEmbed } = useAppSelector(
    (state) => ({
      hasShareId: Boolean(state.pageParams.shareId),
      hasTemplateId: Boolean(state.pageParams.templateId),
      isEmbed: Boolean(state.pageParams.embedId),
    }),
    shallowEqual,
  );
  const dispatch = useDispatch();

  if (hasShareId || hasTemplateId || isEmbed) {
    return <>{children}</>;
  }

  const handleClick = (e: React.SyntheticEvent) => {
    stopPropagation(e);
    if (!foreignFieldId) {
      const url = new URL(window.location.href);
      url.pathname = path.join('workbench', foreignDatasheetId, viewId || '');
      navigationToUrl(url.href, { method: Method.Push });
      return;
    }
    foreignFieldId && dispatch(StoreActions.setHighlightFieldId(foreignFieldId, foreignDatasheetId));
    hideOperateBox && hideOperateBox();
    Router.push(Navigation.WORKBENCH, { params: { nodeId: foreignDatasheetId, viewId } });
  };

  return (
    <Tooltip title={t(Strings.jump_link_url)}>
      <span className={mode === JumpIconMode.Badge ? styles.textWrapper : styles.iconWrapper} onClick={handleClick}>
        <sup>
          <GotoOutlined color={colors.primaryColor} size={10} />
        </sup>
      </span>
    </Tooltip>
  );
};
