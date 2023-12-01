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

import { readInstallationWidgets } from 'modules/widget/api/widget_api';
import { Events, Player } from 'modules/shared/player';
import { batchActions } from 'redux-batched-actions';
import {
  getLinkId,
} from 'modules/database/store/selectors/resource/datasheet/base';
import { RECEIVE_INSTALLATIONS_WIDGET, RESET_WIDGET } from 'modules/shared/store/action_constants';
import { IReduxState, IUnMountWidget, IWidget } from 'exports/store/interfaces';

export const fetchWidgetsByWidgetIds = (
  widgetIds: string[],
  successCb?: (props: { responseBody: any; dispatch: any, getState: any }) => void
) => {
  return (dispatch: any, getState: () => IReduxState) => {
    // dispatch(setWidgetPanelLoading(true));
    const state = getState();
    const linkId = getLinkId(state);

    readInstallationWidgets(widgetIds, linkId).then(res => {
      return Promise.resolve({ responseBody: res.data, dispatch, getState });
    }).catch(e => {
      // dispatch(setWidgetPanelLoading(false));
      Player.doTrigger(Events.app_error_logger, {
        error: new Error(`widgetMap request error ${widgetIds.join(',')}`),
        metaData: { widgetIds: widgetIds.join(',') },
      });
      throw e;
    }).then(props => {
      fetchInstallationWidgetSuccess(props);
      successCb?.(props);
    }, e => {
      console.error('fetchWidgetsByWidgetIds error', e);
    });
  };
};

export const receiveInstallationWidget = (widgetId: string, widget: IWidget) => {
  return {
    type: RECEIVE_INSTALLATIONS_WIDGET,
    payload: widget,
    widgetId: widgetId,
  };
};

export const fetchInstallationWidgetSuccess = ({ responseBody, dispatch }: { responseBody: any, dispatch: any }) => {
  const { data, success } = responseBody;
  // dispatch(setWidgetPanelLoading(false));
  if (success) {
    const _batchActions: any[] = [];

    for (const v of data) {
      _batchActions.push(
        receiveInstallationWidget(v.id, v)
      );
    }
    dispatch(
      batchActions(_batchActions)
    );
  } else {
    Player.doTrigger(Events.app_error_logger, {
      error: new Error('widgetMap error'),
      metaData: {},
    });
  }
};

export const resetWidget = (widgetIds: string[]): IUnMountWidget => {
  return {
    type: RESET_WIDGET,
    payload: widgetIds,
  };
};
