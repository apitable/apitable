import {
  IDashboardWidgetMap,
  IPermissions,
  IServerDashboardPack,

} from 'exports/store/interfaces';
import { Role } from 'config/constant';
import {
  WidgetPackageStatus,
  WidgetPackageType,
  WidgetReleaseType
} from 'modules/database/store/interfaces/resource/widget';

export const mockWidgetMap: IDashboardWidgetMap = {
  wdt1: {
    id: 'wdt1',
    revision: 13,
    authorEmail: '1@x.com',
    authorIcon: 'http://a.x/icon1',
    authorLink: 'http://a.x',
    authorName: 'A',
    packageType: WidgetPackageType.Custom,
    releaseType: WidgetReleaseType.Global,
    status: WidgetPackageStatus.Published,
    releaseCodeBundle: '123',
    widgetPackageId: 'wpk1',
    widgetPackageName: 'WIDGET 1',
    widgetPackageIcon: 'http://widget/icon',
    widgetPackageVersion: '1.1',
    sandbox: false,
    snapshot: {
      widgetName: 'WIDGET 1',
      storage: {},
    },
  },
  wdt2: {
    id: 'wdt2',
    revision: 184,
    authorEmail: '2@x.com',
    authorIcon: 'http://a.x/icon2',
    authorLink: 'http://a.x',
    authorName: 'BA',
    packageType: WidgetPackageType.Custom,
    releaseType: WidgetReleaseType.Global,
    status: WidgetPackageStatus.Published,
    releaseCodeBundle: '123',
    widgetPackageId: 'wpk2',
    widgetPackageName: 'WIDGET 2',
    widgetPackageIcon: 'http://widget/icon',
    widgetPackageVersion: '1.3',
    sandbox: false,
    snapshot: {
      widgetName: 'WIDGET 2',
      storage: {},
    },
  },
  wdt3: {
    id: 'wdt3',
    revision: 184,
    authorEmail: '2@x.com',
    authorIcon: 'http://a.x/icon2',
    authorLink: 'http://a.x',
    authorName: 'BA',
    packageType: WidgetPackageType.Custom,
    releaseType: WidgetReleaseType.Global,
    status: WidgetPackageStatus.Published,
    releaseCodeBundle: '123',
    widgetPackageId: 'wpk2',
    widgetPackageName: 'WIDGET 2',
    widgetPackageIcon: 'http://widget/icon',
    widgetPackageVersion: '1.3',
    sandbox: false,
    snapshot: {
      widgetName: 'WIDGET 2',
      storage: {},
    },
  },
};

export const mockDashboardMap: Record<string, IServerDashboardPack> = {
  dsb1: {
    dashboard: {
      id: 'dsb1',
      name: 'Dashboard 1',
      description: 'dsb desc 1',
      parentId: 'fod17ajf',
      icon: 'smile',
      nodeShared: false,
      nodePermitSet: false,
      spaceId: 'spc1',
      role: Role.Editor,
      permissions: {} as IPermissions,
      revision: 177,
      snapshot: {
        widgetInstallations: {},
      },
    },
    widgetMap: {
      wdt1: mockWidgetMap['wdt1']!,
      wdt2: mockWidgetMap['wdt2']!,
    },
  },
  dsb2: {
    dashboard: {
      id: 'dsb2',
      name: 'Dashboard 2',
      description: 'dsb desc 2',
      parentId: 'fod17ajf',
      icon: 'smile',
      nodeShared: true,
      nodePermitSet: false,
      spaceId: 'spc1',
      role: Role.Reader,
      permissions: {} as IPermissions,
      revision: 80,
      snapshot: {
        widgetInstallations: {
          layout: [
            {
              id: 'wdt2',
              row: 0,
              column: 0,
              widthInColumns: 3,
              heightInRoes: 3,
            },
            {
              id: 'wdt1',
              row: 0,
              column: 3,
              widthInColumns: 3,
              heightInRoes: 3,
            },
          ],
        },
      },
    },
    widgetMap: {
      wdt1: mockWidgetMap['wdt1']!,
      wdt2: mockWidgetMap['wdt2']!,
    },
  },
};
