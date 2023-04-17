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
import { useMeta } from 'hooks';
import { getWidgetDatasheet } from 'store';
import { Selectors, StatusCode } from 'core';
import { IReduxState } from '@apitable/core';
import { ErrorMessage } from './error_message';

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

  if (errorCode) {
    return (
      <ErrorMessage 
        errorCode={errorCode}
        themeName={themeName}
      />
    );
  }
  return (props.children || null) as any;
};

