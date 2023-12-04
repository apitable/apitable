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

import { UndoManager } from 'command_manager';
import { CollaCommandName } from 'commands/enum';
import { IJOTAction, ILocalChangeset, IOperation, IRemoteChangeset, jot } from 'engine';
import { ViewPropertyFilter } from 'engine/view_property_filter';
import { FieldType, ModalType, ResourceType } from 'types';
import { ErrorCode, ErrorType, IError } from 'types/error_types';
import { DatasheetApi } from '../exports/api';
import { Strings, t } from '../exports/i18n';
import { IChangesetPack, INetworking } from '../exports/store/interfaces';
import { getSubscriptionsAction } from 'modules/database/store/actions/subscriptions';
import { getFieldMap } from 'modules/database/store/selectors/resource/datasheet/calc';
import { getResourcePack } from 'modules/database/store/selectors/resource';
import { Events, Player } from '../modules/shared/player';
import { BufferStorage, ILsStore } from './buffer_storage';
import { testPath } from '../event_manager';
import { updateRevision } from 'modules/database/store/actions/resource';

export interface IEngineEvent {
  onAcceptSystemOperations: (op: IOperation[]) => void;
  onNewChanges(resourceType: ResourceType, resourceId: string, actions: IJOTAction[]): void;
  onError?(error: IError): void;
  getUndoManager(): UndoManager;
  reloadResourceData(): void;
}

/**
  * Real-time collaboration engine, providing real-time collaboration support for any serializable JSON structure data
  * TODO: Listen to the datasheet loaded event, supplementary check whether the version has fallen behind
  */
export class Engine {
  bufferStorage: BufferStorage;
  resourceId: string;
  resourceType: ResourceType;
  getRevision: () => number;
  getNetworking: () => INetworking;
  event: IEngineEvent;
  // The time when the last departure request was sent.
  latestSendTime = 0;
  cancelQuit: (() => void) | null;
  getState: () => any;
  dispatch: (action: any) => void;
  private prepared = false;
  private readonly viewPropertyFilter?: ViewPropertyFilter;

  constructor(params: {
    resourceId: string,
    resourceType: ResourceType,
    event: IEngineEvent,
    getRevision: () => number,
    getNetworking: () => INetworking,
    getState: () => any,
    lsStore: ILsStore,
    dispatch: (action: any) => void,
  }) {
    const { resourceId, resourceType, getRevision, getNetworking, lsStore, event, getState, dispatch } = params;
    this.resourceId = resourceId;
    this.resourceType = resourceType;
    this.getRevision = getRevision;
    this.getNetworking = getNetworking;
    this.bufferStorage = new BufferStorage(resourceId, resourceType, lsStore);
    this.event = event;
    this.cancelQuit = null;
    void this.prepare();
    this.getState = getState;
    this.dispatch = dispatch;
    if (resourceType === ResourceType.Datasheet) {
      this.viewPropertyFilter = new ViewPropertyFilter(getState, dispatch, resourceId, { onError: this.event.onError });
    }
  }

  /**
   * Push the operation into the send queue, SyncEngine will ensure that the data is sent to the server in version order
   * And provide temporary local persistence capabilities to prevent users from losing data
   * in the case of accidental network disconnection and active refresh
   */
  pushOpBuffer(operation: IOperation) {
    const _actions = this.viewPropertyFilter ?
      this.viewPropertyFilter.parseActions(operation.actions, { commandName: operation.cmd as CollaCommandName }) :
      operation.actions;
    if (_actions.length) {
      this.bufferStorage.pushOpBuffer({
        ...operation,
        actions: _actions,
        revision: this.getRevision(),
        resourceType: this.resourceType
      });
    }
  }

  /**
   * Whether there is still unsent data
   */
  isStorageClear(): boolean {
    if (this.bufferStorage.opBuffer.length > 0 || this.bufferStorage.localPendingChangeset) {
      return false;
    }
    return true;
  }

  getNextChangeset(): ILocalChangeset | null {
    const revision = this.getRevision();
    if (revision == null) {
      const error = new Error(t(Strings.error_revision_does_not_exist));
      Player.doTrigger(Events.app_error_logger, {
        error,
        metaData: JSON.stringify({
          resourceId: this.resourceId,
          resourceType: this.resourceType,
          engine: this,
          resourceExist: Boolean(getResourcePack(this.getState(), this.resourceId, this.resourceType)),
        }),
      });
      throw error;
    }

    this.bufferStorage.deOpBuffer(revision);

    if (!this.bufferStorage.localPendingChangeset) {
      return null;
    }

    this.latestSendTime = Date.now();

    return this.bufferStorage.localPendingChangeset;
  }

  getLocalPendingChangeset() {
    return this.bufferStorage.localPendingChangeset;
  }

  getOpBuffer() {
    return this.bufferStorage.opBuffer;
  }

  // clear changeset pending confirmation
  clearLocalPendingChangeset() {
    this.bufferStorage.clearLocalPendingChangeset();
  }

  // clear ops waiting to be sent
  clearOpBuffer() {
    this.bufferStorage.clearOpBuffer();
  }

  /**
   * Initialization preparations
   * 1. Check if there are any missing versions, and supplement if there are any.
   * 2. Check whether there are unsynchronized changesets locally, and if so, perform necessary transforms to keep revision and snapshot aligned
   * 3. Each engine will be prepared when it is first instantiated and watched
   *
   * checkVersion does not exist when instantiated
   */
  async prepare(checkVersion?: number) {
    try {
      await this.checkLocalDiffChanges(checkVersion);
      this.prepared = true;
    } catch (error) {
      Player.doTrigger(Events.app_error_logger, {
        error,
        metaData: {
          localPendingChangeset: this.bufferStorage.localPendingChangeset,
          opBuffer: this.bufferStorage.opBuffer,
        },
      });

      // clear the local cache to prevent the problem from happening again
      this.bufferStorage.clearLocalPendingChangeset();
      this.bufferStorage.clearOpBuffer();

      this.event.onError && this.event.onError({
        type: ErrorType.CollaError,
        code: ErrorCode.EngineCreateFailed,
        message: t(Strings.local_data_conflict),
        modalType: ModalType.Info
      });
    }
  }

  /**
   * Completed the version supplement of local resources, and can perform collaborative data synchronization operations
   */
  waitPrepareComplete() {
    return new Promise<boolean>((resolve) => {
      if (this.prepared) {
        return resolve(true);
      }

      const timer = setInterval(() => {
        if (this.prepared) {
          clearInterval(timer);
          return resolve(true);
        }
      }, 30);
    });
  }

  /**
   * Member remote changeset update record subscriptions
   * @param remoteChangeset
   */
  handleSubscriptions(remoteChangeset: IRemoteChangeset) {
    let hasCreatedFieldWithSubscription = false;
    let otherCmdTriggerSubscription = false;

    const fieldMap = getFieldMap(this.getState(), this.resourceId);
    remoteChangeset.operations.forEach(op => {
      // AddRecords
      if (op.cmd === CollaCommandName.AddRecords) {
        if (fieldMap && Object.values(fieldMap).some(field => field.type === FieldType.CreatedBy && field.property.subscription)) {
          hasCreatedFieldWithSubscription = true;
          return;
        }
      } else {
        // other command
        op.actions.map(action => {
          const path = testPath(action.p, ['recordMap', ':recordId', 'data', ':fieldId']);
          if (path.pass) {
            const field = fieldMap?.[path.fieldId];
            if (field?.type === FieldType.Member && Boolean(field.property.subscription)) {
              otherCmdTriggerSubscription = true;
              return;
            }
          }
        });
      }
    });

    if (hasCreatedFieldWithSubscription || otherCmdTriggerSubscription) {
      this.dispatch(getSubscriptionsAction(this.resourceId));
    }
  }

  /**
    * The submitted changeset is accepted by the service
    */
  async handleAcceptCommit(remoteChangeset: IRemoteChangeset) {
    // Check version continuity, if not, add it first.
    await this.checkMissChanges(remoteChangeset.revision);
    const revision = this.getRevision();
    // This may happen when entering the table for the first time.
    // The client detects that there is still local content that cannot be sent, so it re-sends
    if (!this.bufferStorage.localPendingChangeset) {
      Player.doTrigger(Events.app_error_logger, {
        error: new Error('missing localChangeset when receiving ACK'),
      });
      return;
    }
    if (
      revision != null &&
      remoteChangeset?.messageId === this.bufferStorage.localPendingChangeset?.messageId &&
      remoteChangeset?.revision === revision + 1
    ) {
      const filteredOperations = remoteChangeset.operations.filter(op => {
        return (op.cmd === CollaCommandName.SystemSetRecords || op.cmd === CollaCommandName.SystemSetFieldAttr);
      });

      if (filteredOperations.length) {
        this.event.onAcceptSystemOperations(filteredOperations);
      }
      this.handleSubscriptions(remoteChangeset);

      this.dispatch(updateRevision(revision + 1, this.resourceId, this.resourceType));
      return;
    }
    console.error('ACK data error', { revision, ack: remoteChangeset, localChangeset: this.bufferStorage.localPendingChangeset });
    throw new Error('Data returned in wrong format, please refresh and try again');
  }

  /**
   * @param startRevision inclusive
   * @param endRevision   exclusive
   */
  private async fetchMissVersion(startRevision: number, endRevision: number): Promise<IRemoteChangeset[]> {
    console.log('fetchingMissVersion', this.resourceId, startRevision, endRevision);
    const result = await DatasheetApi.fetchChangesets<IChangesetPack>(this.resourceId, this.resourceType,
      startRevision, endRevision, this.getState().pageParams.nodeId, this.getState().pageParams.shareId);
    if (result.data.success) {
      console.log('fetchMissVersion success: ', result.data.data);

      if (endRevision - startRevision !== result.data.data.length) {
        throw new Error(t(Strings.error_the_length_of_changeset_is_inconsistent));
      }
      return result.data.data;
    }

    throw new Error(t(Strings.error_occurred_while_requesting_the_missing_version));
  }

  /**
   * The backend actively pushes changesets submitted by others
   * Or actively compensate for missing versions of changeset
   */
  async handleNewChanges(data: IRemoteChangeset) {
    console.log('Received remote Changeset: ', { data });
    const loading = this.getNetworking().loading;
    if (loading) {
      Player.doTrigger(Events.app_error_logger, {
        error: new Error('receive newChanges while datasheet loading, ignored'),
      });
      return;
    }

    await this.checkMissChanges(data.revision);
    this.applyNewChanges(data);
  }

  private applyNewChanges(cs: IRemoteChangeset) {
    // Receive newChanges from itself. This happens because the client disconnects and reconnects,
    // and the reconnected client is considered a collaborator.
    // At this time, the changeset sent by yourself will be broadcast to yourself as newChanges again.
    // So we have to first judge the equality of messageId
    // If messageId is equal, it is regarded as ACK.
    if (this.bufferStorage.localPendingChangeset && cs.messageId === this.bufferStorage.localPendingChangeset.messageId) {
      console.error('messageId in newChanges is equal to localChangeset and has been converted to ACK');
      void this.handleAcceptCommit(cs);
      return;
    }

    const revision = this.getRevision();
    // must ensure that data.revision does not jump carry
    if (cs.revision > revision + 1) {
      console.log('revision error', revision, cs.revision);
      throw new Error('miss changes didn\'t well prepared');
    }

    // Changesets smaller than the current version are ignored directly
    if (cs.revision <= revision) {
      console.warn('older changeset received and ignored');
      return;
    }

    if (revision == null || cs.revision !== +revision + 1) {
      console.error('currentRevision', revision, cs);
      throw new Error('wrong changeset revision');
    }

    const nextRevision = +revision + 1;

    const remoteActions = this.doTransform(cs);

    const _remoteActions = this.viewPropertyFilter ? this.viewPropertyFilter.parseActions(remoteActions, { fromServer: true }) : remoteActions;

    this.dispatch(updateRevision(nextRevision, this.resourceId, this.resourceType));

    this.event.onNewChanges(this.resourceType, this.resourceId, _remoteActions);

    return _remoteActions;
  }

  // Check the missing version of the remote changeset, and if there is one, directly fill in the missing changeset and apply it to the snapshot.
  async checkMissChanges(revisionUpgradeTo: number) {
    const revision = this.getRevision();

    /**
     * The remote newChange version needs to be exactly equal to the version + 1 to go through the normal process.
     * If the version gap is greater than 1, you need to fill in the intermediate version
     */
    if (revisionUpgradeTo === revision + 1) {
      return;
    }
    if (revisionUpgradeTo <= revision) {
      return;
    }

    const changesetList = await this.fetchMissVersion(revision + 1, revisionUpgradeTo);
    changesetList.forEach(cs => {
      this.applyNewChanges(cs);
    });
  }

  // Check the version gap between the local snapshot and the local changeset.
  // If there is a gap, transform and rebase the localChangeset.
  async checkLocalDiffChanges(checkVersion?: number) {
    if (!this.bufferStorage.localPendingChangeset) {
      checkVersion != null && this.checkMissChanges(checkVersion);
      return;
    }

    Player.doTrigger(Events.app_error_logger, {
      error: new Error(t(Strings.error_an_unsynchronized_changeset_is_detected)),
      metaData: this.bufferStorage.localPendingChangeset,
    });
    const revision = this.getRevision();
    const baseRevision = this.bufferStorage.localPendingChangeset.baseRevision;

    if (baseRevision > revision) {
      throw new Error('localRevision greater than remoteRevision');
    }

    console.log('checkLocalDiffChanges: ', { baseRevision, revision });

    if (baseRevision < revision) {
      let changesetList = await this.fetchMissVersion(baseRevision + 1, revision + 1);
      /**
        * Check if localChangeset is already in changesetList, if so
        * 1. It means that localChangeset has been applied to the snapshot, so it does not need to be sent locally
        * 2. This changeset before this needs to be transformed, and the latter does not need to be transformed
        */
      const transformEndIndex = changesetList.findIndex(changeset => {
        return changeset.messageId === this.bufferStorage.localPendingChangeset!.messageId;
      });

      changesetList = changesetList.slice(0, transformEndIndex);

      if (transformEndIndex >= 0) {
        // 1. Discard localChangeset.
        // 2. opBuffer becomes the new localChangeset, and baseRevision is set to the revision
        // in the changesetList where the original localChangeset is located.
        console.log('Detected that the local localPendingChangeset has been consumed, delete it directly', this.bufferStorage.localPendingChangeset);
        this.bufferStorage.deOpBuffer(revision);
        console.log('The local opBuffer enters localPendingChangeset', this.bufferStorage.localPendingChangeset);
      }

      changesetList.forEach(changeset => {
        this.doTransform(changeset);
      });
    }
  }

  private doTransform(cs: IRemoteChangeset) {
    let remoteActions = cs.operations.reduce<IJOTAction[]>((pre, op) => {
      pre.push(...op.actions);
      return pre;
    }, []);

    this.event.getUndoManager().doTransform(remoteActions);

    // localChangeset needs to be transformed and updated to the latest version
    if (this.bufferStorage.localPendingChangeset) {
      console.log(
        'localPendingChangeset before transform:',
        { localChangeset: this.bufferStorage.localPendingChangeset, remoteActions },
      );
      const newOperations = this.bufferStorage.localPendingChangeset.operations.map(op => {
        const [leftOp, rightOp] = jot.transformX(op.actions, remoteActions);
        remoteActions = rightOp;
        return {
          cmd: op.cmd,
          actions: leftOp,
        };
      });
      this.bufferStorage.localPendingChangeset = {
        ...this.bufferStorage.localPendingChangeset,
        operations: newOperations,
        baseRevision: cs.revision,
      };
      console.log(
        'localChangeset after transformed: ',
        { localChangeset: this.bufferStorage.localPendingChangeset, remoteActions },
      );
    }

    if (this.bufferStorage.opBuffer.length) {
      console.log(
        'opBuffer before transform:',
        { localChangeset: this.bufferStorage.localPendingChangeset, remoteActions },
      );
      this.bufferStorage.opBuffer = this.bufferStorage.opBuffer.map(op => {
        const [leftOp, rightOp] = jot.transformX(op.actions, remoteActions);
        remoteActions = rightOp;
        return {
          cmd: op.cmd,
          actions: leftOp,
        };
      });
      console.log(
        'opBuffer after transformed: ',
        { localPendingChangeset: this.bufferStorage.localPendingChangeset, serverOperations: remoteActions },
      );
    }

    return remoteActions;
  }
}

