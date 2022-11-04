import { DataBus } from "@apitable/core/dist/databus";
import { Injectable } from "@nestjs/common";
import { CommandService } from "database/services/command/command.service";
import { DatasheetService } from "database/services/datasheet/datasheet.service";
import { ServerDataLoader } from "./server.data.loader";

@Injectable()
export class DataBusService {
  constructor(
    datasheetService: DatasheetService,
    commandService: CommandService,
  ) {
    DataBus.setDataLoader(new ServerDataLoader(datasheetService))

    DataBus.setCommandHandler(async ({ datasheet, command }) => {
      const { result, changeSets } = commandService.execute(command, datasheet.store)
      return {
        execResult: result,
        extra: {
          changesets: changeSets,
        }
      }
    })
  }

  get databus(): typeof DataBus {
    return DataBus
  }
}