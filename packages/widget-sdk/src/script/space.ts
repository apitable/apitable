import { IReduxState, Selectors } from '@apitable/core';
import { IWidgetContext } from 'interface';
import { widgetMessage } from 'message';
import { Datasheet } from './datasheet';

export class Space {
  /**
   * @hidden
   */
  constructor(private wCtx: IWidgetContext) {}

  /**
   * The unique ID of the space.
   * @returns
   *
   * #### Example
   * ```js
   * console.log(space.id); // => 'spcxxxxxx'
   * ```
   */
  public get id() {
    const state = this.wCtx.widgetStore.getState();
    return state.user?.spaceId;
  }

  /**
   * The name of the space.
   * @returns
   *
   * #### Example
   * ```js
   * console.log(space.name); // => 'Test Space'
   * ```
   */
  public get name() {
    const state = this.wCtx.widgetStore.getState();
    return state.user?.spaceName;
  }

  /**
   * Get the active datasheet for the space.
   * 
   * @returns
   *
   * #### Example
   * ```js
   * const activeDatasheet = await space.getActiveDatasheetAsync();
   * console.log(activeDatasheet); // => Datasheet
   * ```
   */
  public async getActiveDatasheetAsync(): Promise<Datasheet> {
    const state = this.wCtx.widgetStore.getState() as unknown as IReduxState;
    const activeDatasheetId = Selectors.getActiveDatasheetId(state);
    if (activeDatasheetId == null) {
      throw new Error('There are currently no active datasheet');
    }
    await widgetMessage.fetchDatasheet({ datasheetId: activeDatasheetId });
    return new Datasheet(activeDatasheetId, this.wCtx);
  }

  /**
   * Get the specified datasheet in the space.
   * 
   * @param datasheetId The ID of the datasheet.
   * @returns
   *
   * #### Example
   * ```js
   * const datasheet = await space.getDatasheetAsync('dstxxxxxx');
   * console.log(datasheet); // => Datasheet
   * ```
   */
  public async getDatasheetAsync(datasheetId: string): Promise<Datasheet> {
    const state = this.wCtx.widgetStore.getState() as unknown as IReduxState;
    const activeDatasheetId = Selectors.getActiveDatasheetId(state);
    const overWrite = activeDatasheetId !== datasheetId;
    await widgetMessage.fetchDatasheet({ datasheetId, overWrite });
    return new Datasheet(datasheetId, this.wCtx);
  }

  /**
   * @hidden
   */
  // public async createDatasheetAsync() {
  //   return null;
  // }

  /**
   * @hidden
   */
  // public async getMemberAsync(unitNameOrEmailOrId: string) {
  //   return null;
  // }

  /**
   * @hidden
   */
  // public async getMembersAsync(unitNameOrEmailOrIds: string[]) {
  //   return null;
  // }
}