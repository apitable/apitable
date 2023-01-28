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

import { IDatasheetPermission } from 'core';
import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IWidgetContext } from 'interface';
import { WidgetContext } from '../../context';
import { useMeta } from 'hooks/use_meta';
import { Selectors } from '@apitable/core';

/**
 * Permissions for the widget creation, deletion, renaming, location change, etc.
 * are dependent on the datasheet or dashboard where the widget is located.
 * Permission judgments for those operations have already been handled at the top level.
 * The widget itself has only one permission to write data to the storage.
 * The permission is dynamically calculated based on the environment the widget is currently in.
 */
interface IWidgetPermission {
  storage: {
    editable: boolean; // is it possible to edit
  },
  datasheet?: IDatasheetPermission;
}

/**
 * @private
 * Only exposed for use by hooks in sdk.
 */
export const usePermission = () => {
  const context = useContext<IWidgetContext>(WidgetContext);
  const globalState = context.globalStore.getState();
  const datasheetId = useSelector(state => state.widget?.snapshot.datasheetId)!;
  const { sourceId } = useMeta();
  const dstPermission = useSelector(() => {
    return Selectors.getPermissions(
      globalState,
      datasheetId,
      undefined,
      (sourceId?.startsWith('mir') && sourceId) || globalState.pageParams.mirrorId
    );
  });
  // FIXME: when the dashboard permissions changed, it will be refreshed in instantly, but writing data will be checked
  // when you leave the dashboard, the dashboardPack is not destroyed, so here we need add an extra layer of judgment
  const dashboardPermission = useSelector(state => state.dashboard?.permissions);

  return useMemo(() => {
    const permission: IWidgetPermission = {
      storage: {
        editable: Boolean(dstPermission?.editable),
      },
      datasheet: dstPermission,
    };

    if (dashboardPermission) {
      permission.storage.editable = Boolean(dstPermission?.readable && dashboardPermission?.editable);
    }
    return permission;
  }, [dstPermission, dashboardPermission]);
};
