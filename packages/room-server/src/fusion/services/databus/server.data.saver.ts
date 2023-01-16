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

import { ApiTipConstant, databus, ILocalChangeset, IOperation, IResourceOpsCollect, resourceOpsToChangesets, StoreActions } from '@apitable/core';
import { IInternalFix } from '@apitable/core/dist/commands/common/field';
import { DatasheetChangesetSourceService } from 'database/datasheet/services/datasheet.changeset.source.service';
import { OtService } from 'database/ot/services/ot.service';
import { pick } from 'lodash';
import { SourceTypeEnum } from 'shared/enums/changeset.source.type.enum';
import { ApiException } from 'shared/exception';
import { IAuthHeader } from 'shared/interfaces';
import { Logger } from 'winston';

export class ServerDataSaver implements databus.IDataSaver {
  constructor(
    private readonly otService: OtService,
    private readonly changesetSourceService: DatasheetChangesetSourceService,
    private readonly logger: Logger,
  ) {}

  saveOps(ops: IResourceOpsCollect[], options: IServerSaveOpsOptions): Promise<any> {
    const { prependOps, store, datasheet, auth, internalFix, applyChangesets = true } = options;
    const changesets = resourceOpsToChangesets(ops, store.getState());
    changesets.forEach(cs => {
      store.dispatch(StoreActions.applyJOTOperations(cs.operations, cs.resourceType, cs.resourceId));
    });

    if (prependOps) {
      this.combChangeSetsOp(changesets, datasheet.id, prependOps);
    }

    if (applyChangesets) {
      return this.applyChangeSet(datasheet.id, changesets, auth, internalFix);
    }

    return Promise.resolve(changesets);
  }

  private combChangeSetsOp(changeSets: ILocalChangeset[], dstId: string, updateFieldOperations: IOperation[]) {
    // If nothing is changed, changeSets is an empty array. There is nothing to do.
    if (!changeSets.length) {
      return;
    }
    const thisResourceChangeSet = changeSets.find(cs => cs.resourceId === dstId);
    if (updateFieldOperations && updateFieldOperations.length) {
      if (!thisResourceChangeSet) {
        // Why can't I find resources?
        this.logger.error('API_INFO', {
          changeSets,
          dstId,
          updateFieldOperations,
        });
        throw ApiException.tipError(ApiTipConstant.api_insert_error);
      }
      thisResourceChangeSet.operations = [...updateFieldOperations, ...thisResourceChangeSet.operations];
    }
  }

  /**
   * Call otServer to apply changeSet
   *
   * @param dstId         datasheet id
   * @param changesets    array of changesets
   * @param auth          authorization info (developer token)
   * @param internalFix   [optional] use when repairing data
   */
  private async applyChangeSet(dstId: string, changesets: ILocalChangeset[], auth: IAuthHeader, internalFix?: IInternalFix): Promise<string> {
    this.logger.info('API:ApplyChangeSet');
    const applyChangeSetProfiler = this.logger.startTimer();
    let applyAuth = auth;
    const message = {
      roomId: dstId,
      changesets,
      sourceType: SourceTypeEnum.OPEN_API,
    };
    if (internalFix) {
      if (internalFix.anonymouFix) {
        // Internal repair: anonymous repair
        message['internalAuth'] = { userId: null, uuid: null };
        applyAuth = { internal: true };
      } else if (internalFix.fixUser) {
        // Internal fix: Designated user
        message['internalAuth'] = pick(internalFix.fixUser, ['userId', 'uuid']);
        applyAuth = { internal: true };
      }
    }
    const changeResult = await this.otService.applyRoomChangeset(message, applyAuth);
    await this.changesetSourceService.batchCreateChangesetSource(changeResult, SourceTypeEnum.OPEN_API);
    // Notify Socket Service Broadcast
    await this.otService.nestRoomChange(dstId, changeResult);

    applyChangeSetProfiler.done({
      message: `applyChangeSet ${dstId} profiler`,
    });

    return changeResult && changeResult[0]!.userId!;
  }
}

export interface IServerSaveOptions extends databus.ISaveOptions {
  /**
   * The operation that will be prepend to the changeset of the datasheet.
   */
  prependOps?: IOperation[];

  internalFix?: IInternalFix;

  /**
   * If this field is true, the changesets are saved into the database and the userId is returned in `result.saveResult`,
   * otherwise the changesets are simply returned in `result.saveResult` without saving. Defaults to true.
   */
  applyChangesets?: boolean;

  auth: IAuthHeader;
}

export interface IServerSaveOpsOptions extends IServerSaveOptions, databus.ISaveOpsOptions {
}
