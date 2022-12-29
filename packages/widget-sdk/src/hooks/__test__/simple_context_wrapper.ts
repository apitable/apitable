import { noop } from 'lodash';
import { createWidgetContextWrapper } from 'context/__test__/create_widget_context';
import { createMockPermissions, createMockSnapshot } from '__test__/utils';

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
