/**
 * Basic message of node change
 */
export class NodeChangeRo {
  readonly spaceId: string;
  readonly type: string;
  /**
   * Client operator socketId, used to filter messages
   */
  readonly socketId: string;
  readonly data: any;
  readonly uuid?: string;
}
