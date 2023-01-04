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

import { Injectable } from '@nestjs/common';
import { IRemoteChangeset } from '@apitable/core';
import { isEmpty } from 'lodash';
import { DatasheetRecordSubscriptionEntity } from './entities/datasheet.record.subscription.entity';

@Injectable()
export class DatasheetRecordSubscriptionBaseService {

  public async subscribeDatasheetRecords(_userId: string, _dstId: string, recordIds: string[], _mirrorId?: string | null) {
    if (isEmpty(recordIds)) return;
    await Promise.resolve();
  }

  public async unsubscribeDatasheetRecords(_userId: string, _dstId: string, recordIds: string[]) {
    if (isEmpty(recordIds)) return;
    await Promise.resolve();
  }

  public async getSubscribedRecordIds(_userId: string, _dstId: string): Promise<string[]> {
    return await Promise.resolve([]);
  }

  public async getSubscriptionsByRecordId(_dstId: string, _recordId: string): Promise<DatasheetRecordSubscriptionEntity[]> {
    return await Promise.resolve([]);
  }

  public async getSubscriptionsByRecordIds(_dstId: string, _recordIds: string[]): Promise<DatasheetRecordSubscriptionEntity[]> {
    return await Promise.resolve([]);
  }

  public async handleChangesets(_changesets: IRemoteChangeset[], _context: any) {
    await Promise.resolve();
  }

}
