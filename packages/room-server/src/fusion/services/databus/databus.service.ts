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

import { databus, ICollaCommandOptions } from '@apitable/core';
import { RedisService } from '@apitable/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { CommandService } from 'database/command/services/command.service';
import { DatasheetChangesetSourceService } from 'database/datasheet/services/datasheet.changeset.source.service';
import { DatasheetService } from 'database/datasheet/services/datasheet.service';
import { OtService } from 'database/ot/services/ot.service';
import { InjectLogger } from 'shared/common';
import { Logger } from 'winston';
import { IServerDatasheetOptions } from './interfaces';
import { ServerDataLoader } from './server.data.loader';
import { IServerSaveOptions, ServerDataSaver } from './server.data.saver';

@Injectable()
export class DataBusService {
  private readonly databus: databus.DataBus;
  private readonly database: databus.Database;

  constructor(
    datasheetService: DatasheetService,
    commandService: CommandService,
    redisService: RedisService,
    otService: OtService,
    changesetSourceService: DatasheetChangesetSourceService,
    @InjectLogger() private readonly logger: Logger,
  ) {
    this.databus = databus.DataBus.create({
      dataLoader: new ServerDataLoader(datasheetService, redisService, logger, { useCache: false }),
      dataSaver: new ServerDataSaver(otService, changesetSourceService, logger),
      storeProvider: {
        createStore: datasheetPack => Promise.resolve(commandService.fullFillStore(datasheetPack)),
      },
    });
    this.database = this.databus.getDatabase();
  }

  async getDatasheet(dstId: string, options: IServerDatasheetOptions): Promise<databus.Datasheet | null> {
    const datasheet = await this.database.getDatasheet(dstId, options);
    if (datasheet === null) {
      return null;
    }
    datasheet.addEventHandler({
      type: databus.DatasheetEventType.CommandExecuted,
      handle: (event: databus.IDatasheetCommandExecutedEvent) => {
        if ('error' in event) {
          this.logger.error('CommandExecuteError', { error: event.error });
          return Promise.resolve();
        }

        return Promise.resolve();
      },
    });

    return datasheet;
  }

  /**
   * This method is a simple wrapper of the `Datasheet.doCommand` method, providing type safety for `saveOptions`.
   *
   */
  doCommand<R>(dst: databus.Datasheet, command: ICollaCommandOptions, saveOptions: IServerSaveOptions): Promise<databus.ICommandExecutionResult<R>> {
    return dst.doCommand(command, saveOptions);
  }
}
