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

import { noop } from 'lodash';
import { createWidgetContextWrapper } from 'context/__tests__/create_widget_context';
import { createMockPermissions, createMockSnapshot } from '__tests__/utils';

export const createSimpleWrapper = () => createWidgetContextWrapper({
  isFullscreen: true,
  isShowingSettings: false,
  toggleFullscreen: noop,
  toggleSettings: noop,
  expandRecord: noop,
  mountId: 'mountId',
}, {
  widget: {
    id: 'wdtMock',
    revision: 1,
    widgetPackageId: 'string',
    widgetPackageName: 'string',
    widgetPackageIcon: 'string',
    widgetPackageVersion: 'string',
    authorEmail: 'string',
    authorIcon: 'string',
    authorLink: 'string',
    authorName: 'string',
    packageType: 0,
    releaseType: 0,
    status: 3,
    releaseCodeBundle: 'string',
    sandbox: false,
    snapshot: {
      widgetName: 'widget1',
      datasheetId: 'dstMock',
      storage: {
      },
    },
  },
  errorCode: null,
  datasheetMap: {
    dstMock: {
      datasheet: {
        id: 'dstMock',
        datasheetId: 'dstMock',
        datasheetName: 'datasheet1',
        permissions: createMockPermissions(),
        snapshot: createMockSnapshot(),
      },
      client: {
        collaborators: [],
        selection: null,
      }
    }
  },
  dashboard: null,
  unitInfo: null,
  widgetConfig: {
    isShowingSettings: false,
    isFullscreen: false
  },
  labs: [],
  pageParams: {},
  share: {},
  user: null
});
