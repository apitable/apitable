import { DataBus } from 'fusion/databus';
import * as dbus from 'fusion/databus';
import { Injectable, Logger } from '@nestjs/common';
import { CommandService } from 'database/services/command/command.service';
import { DatasheetService } from 'database/services/datasheet/datasheet.service';
import { ServerDataLoader } from './server.data.loader';
import { IServerDatasheetOptions } from './interfaces';
import { InjectLogger } from 'shared/common';
import { generateRandomString, ILocalChangeset, resourceOpsToChangesets, Selectors, StoreActions } from '@apitable/core';

@Injectable()
export class DataBusService {
  private readonly database: dbus.Database;

  constructor(datasheetService: DatasheetService, commandService: CommandService, @InjectLogger() private readonly logger: Logger) {
    this.database = DataBus.getDatabase();

    this.database.setDataLoader(new ServerDataLoader(datasheetService));

    this.database.setStoreProvider({
      createStore: async datasheetPack => commandService.fullFillStore(datasheetPack),
    });
  }

  async getDatasheet(dstId: string, options: IServerDatasheetOptions): Promise<dbus.Datasheet> {
    const datasheet = await this.database.getDatasheet(dstId, options);
    datasheet.addEventHandler({
      type: dbus.DatasheetEventType.CommandExecuted,
      handle: async (event: dbus.IDatasheetCommandExecutedEvent) => {
        if ('error' in event) {
          this.logger.error('CommandExecuteError', { error: event.error });
          return;
        }

        const { store, collectedResourceOps } = event;
        const changesets = resourceOpsToChangesets(collectedResourceOps, store.getState());
        changesets.forEach(cs => {
          store.dispatch(StoreActions.applyJOTOperations(cs.operations, cs.resourceType, cs.resourceId));
        });

        event.setExtra(changesets);
      },
    });

    return datasheet;
  }
}
