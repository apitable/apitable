import { CollaCommandName } from "../../commands";
import { ExecuteFailReason, ExecuteResult, ExecuteType } from "../../command_manager";
import { ResourceType } from "../../types";
import { ICommandHandler } from "../databus.manager";
import { MockDataLoader } from "./mock.data.loader";

export function mockCommandHandler(loader: MockDataLoader): ICommandHandler {
  return async ({ datasheet, command }) => {
    if (!loader.datasheets.hasOwnProperty(datasheet.id)) {
      return {
        execResult: {
          resourceId: datasheet.id,
          resourceType: ResourceType.Datasheet,
          result: ExecuteResult.Fail,
          reason: ExecuteFailReason.ActionError,
        },
        extra: undefined,
      };
    }

    switch (command.cmd) {
      case CollaCommandName.AddRecords: {
        // @ts-ignore
        declare const command: IAddRecordsOptions;
        const snapshot = loader.datasheets[datasheet.id].snapshot;
        const view = snapshot.meta.views.find(view => view.id === command.viewId);
        if (!view) {
          return {
            execResult: {
              resourceId: datasheet.id,
              resourceType: ResourceType.Datasheet,
              result: ExecuteResult.Fail,
              reason: ExecuteFailReason.ActionError,
            },
            extra: undefined,
          };
        }
        const recordIds = Array(command.count)
          .fill(0)
          .map((_x, i) => 'rec' + (i + view.rows.length + 1));
        view.rows.push(...recordIds.map(recordId => ({ recordId })));
        for (const i in recordIds) {
          snapshot.recordMap[recordIds[i]] = {
            id: recordIds[i],
            data: command.cellValues ? command.cellValues[i] : {},
            commentCount: 0,
          };
        }
      }
    }
    return {
      execResult: {
        resourceId: datasheet.id,
        resourceType: ResourceType.Datasheet,
        result: ExecuteResult.Success,
        data: undefined,
        operation: {
          cmd: command.cmd,
          actions: [],
        },
        executeType: ExecuteType.Execute,
      },
      extra: undefined,
    };
  };
}