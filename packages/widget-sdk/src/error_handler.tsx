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

import React from 'react';
import { useSelector } from 'react-redux';
import { Selectors, StatusCode, Strings, t } from 'core';
// import { WidgetEmptyPath } from './ui/widget_empty';
import { getWidgetDatasheet } from 'store';
import { IReduxState } from '@apitable/core';
import { useMeta } from 'hooks';
import WidgetNoPermissionLight from 'static/icon/datasheet/dashboard_widget_permission_light.png';
import WidgetNoPermissionDark from 'static/icon/datasheet/dashboard_widget_permission_dark.png';
import Image from 'next/image';
import { ThemeName } from '@apitable/components';

export const ErrorHandler: React.FC<React.PropsWithChildren<unknown>> = props => {
  let errorCode = useSelector(state => {
    const sourceId = state.widget?.snapshot.sourceId;
    const widgetState = state as any as IReduxState;
    if (sourceId?.startsWith('mir')) {
      return Selectors.getMirrorPack(widgetState, sourceId || '')?.errorCode;
    }

    if (state.errorCode) {
      return state.errorCode;
    }

    return null;
  });
  const themeName = useSelector(state => {
    const widgetState = state as any as IReduxState;
    return widgetState.theme;
  });
  const widgetNoPermission = themeName === ThemeName.Light ? WidgetNoPermissionLight : WidgetNoPermissionDark;

  const { sourceId } = useMeta();
  const isLoading = useSelector(state => {
    if (errorCode) {
      return false;
    }
    if (sourceId?.startsWith('mir')) {
      return !state.mirrorMap?.[sourceId]?.mirror || !(getWidgetDatasheet(state) && state.widget?.snapshot);
    }
    return !(getWidgetDatasheet(state) && state.widget?.snapshot);
  });

  // here to intercept the case in the mirror has permission source table without permission,
  // because the loading is completed,
  // but the mirror load causes the source table data to overwrite the errorCode of the datasheet source table resulting in permission penetration
  errorCode = useSelector(state => {
    const datasheet = getWidgetDatasheet(state);
    if (!errorCode && !isLoading && !sourceId?.startsWith('mir') && !datasheet?.permissions.readable) {
      return StatusCode.NODE_NOT_EXIST;
    }
    return errorCode;
  });

  if (isLoading) {
    return <h1
      style={{
        fontSize: 14,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
      }}
    >
      loading……
    </h1>;
  }

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

  if (errorCode) {
    return <div
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
        <Image src={widgetNoPermission} alt='' width={160} height={120} style={{ margin: '0 auto' }} />
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
    </div>;
  }
  return (props.children || null) as any;
};

