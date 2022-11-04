import { ICollaCommandOptions } from 'commands';
import { ICollaCommandExecuteResult } from 'command_manager';
import { Database, IDataLoader, Datasheet, DatasheetEventType, IDatabaseOptions } from '.';

export class DataBus {
  public static getInstance(): DataBus {
    if (DataBus._instance == null) DataBus._instance = new DataBus();

    return DataBus._instance;
  }

  private static _instance: DataBus;

  private loader!: IDataLoader;

  private constructor() {}

  async getDatabase(options: IDatabaseOptions): Promise<Database> {
    return new Database(options, this.loader);
  }

  setDataLoader(loader: IDataLoader): void {
    this.loader = loader;
  }

  private _commandHandler?: ICommandHandler;

  setCommandHandler(commandHandler: ICommandHandler) {
    this._commandHandler = commandHandler;
  }

  async doCommand(options: ICommandOptions): Promise<void> {
    if (this._commandHandler) {
      const { execResult, extra } = await this._commandHandler(options);
      await options.datasheet.fireEvent({
        type: DatasheetEventType.CommandExecuted,
        execResult,
        extra,
      });
    }
  }
}

export interface ICommandHandler {
  (options: ICommandOptions): Promise<ICommandHandlerResult>;
}

export interface ICommandOptions {
  datasheet: Datasheet;
  command: ICollaCommandOptions;
}

export interface ICommandHandlerResult {
  execResult: ICollaCommandExecuteResult<unknown>;
  extra: unknown;
}
