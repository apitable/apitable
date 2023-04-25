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

import React, { FC } from 'react';
import { StatusCode, Strings, t } from 'core';
import { ThemeName } from '@apitable/components';
import WidgetNoPermissionLight from './static/dashboard_widget_permission_light.png';
import WidgetNoPermissionDark from './static/dashboard_widget_permission_dark.png';

interface IErrorMessageProps {
  errorCode: number;
  themeName: ThemeName;
}

export const ErrorMessage: FC<IErrorMessageProps> = (props) => {
  const { errorCode, themeName } = props;
  const widgetNoPermission = themeName === ThemeName.Light ? WidgetNoPermissionLight : WidgetNoPermissionDark;

  const getErrorTip = () => {
    switch (errorCode) {
      case StatusCode.NODE_DELETED:
        return t(Strings.widget_datasheet_has_delete);
      case StatusCode.NODE_NOT_EXIST:
        return t(Strings.widget_no_access_datasheet);
      default:
        return t(Strings.widget_unknow_err, {
          info: errorCode,
        });
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '100%',
      }}
    >
      <div style={{
        width: '160px',
        height: '120px',
        margin: '0 auto',
      }}>
        <img src={widgetNoPermission.src} alt='' width={160} height={120} style={{ margin: '0 auto' }} />
      </div>
      
      <p
        style={{
          textAlign: 'center',
          fontSize: 14,
        }}
      >
        {
          getErrorTip()
        }，
        <a href={t(Strings.dashboard_access_denied_help_link)} target="_blank" rel="noopener noreferrer" style={{
          borderBottom: '1px solid',
          paddingBottom: 2,
        }}>
          {t(Strings.know_more)}
        </a>
      </p>
    </div>
  );
};

