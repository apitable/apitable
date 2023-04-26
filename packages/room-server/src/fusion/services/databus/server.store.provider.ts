import { IReduxState, IServerDashboardPack, IServerDatasheetPack, databus } from '@apitable/core';
import { CommandService } from 'database/command/services/command.service';
import { Store } from 'redux';

export class ServerStoreProvider implements databus.IStoreProvider {
  constructor(private readonly commandService: CommandService) {}

  createDatasheetStore(datasheetPack: IServerDatasheetPack): Promise<Store<IReduxState>> {
    return Promise.resolve(this.commandService.fullFillStore(datasheetPack));
  }

  createDashboardStore(dashboardPack: IServerDashboardPack): Promise<Store<IReduxState>> {
    const store = this.commandService.fillDashboardStore(dashboardPack);
    return Promise.resolve(store);
  }
}
