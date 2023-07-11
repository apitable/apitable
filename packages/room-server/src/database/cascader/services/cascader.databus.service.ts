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

import { databus, Field, IFieldPermissionMap, Selectors, ViewFilterDerivate } from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { CommandService } from 'database/command/services/command.service';
import { DatasheetService } from 'database/datasheet/services/datasheet.service';
import { CascaderDataStorageProvider } from './cascader.data.storage.provider';
import { IAuthHeader } from 'shared/interfaces';
import { RestService } from 'shared/services/rest/rest.service';
import { IFieldMethods } from '../utils/cell.value.to.string';
import { UnitService } from 'unit/services/unit.service';

@Injectable()
export class CascaderDatabusService {
  private readonly databus: databus.DataBus;
  private readonly database: databus.Database;

  constructor(readonly datasheetService: DatasheetService,
              readonly unitService: UnitService,
              private readonly restService: RestService,
              readonly commandService: CommandService) {
    this.databus = databus.DataBus.create({
      dataStorageProvider: new CascaderDataStorageProvider(datasheetService, unitService),
      storeProvider: {
        createDatasheetStore: datasheetPack => Promise.resolve(commandService.fullFillStore(datasheetPack)),
        createDashboardStore: dashboardPack => {
          throw new Error('unreachable ' + dashboardPack.dashboard.id);
        },
      },
    });

    this.database = this.databus.getDatabase();
  }

  public async getDatasheet(dstId: string): Promise<databus.Datasheet | null> {
    const datasheet = await this.database.getDatasheet(dstId, {} as databus.IDatasheetOptions);
    if (datasheet === null) {
      return null;
    }

    return datasheet;
  }

  public async getView(datasheet: databus.Datasheet, option: ICascaderViewOption): Promise<CascaderSourceDataView | null> {
    const { auth, viewId } = option;
    const fieldPermissionMap: IFieldPermissionMap = await this.restService.getFieldPermission(auth, datasheet.id);
    const fieldMethods: IFieldMethods = {};
    const selectedView = await datasheet.getView({
      getViewInfo: state => {
        const datasheetState = Selectors.getDatasheet(state, datasheet.id);
        const snapshot = Selectors.getSnapshot(state, datasheet.id)!;
        // The fieldMap after permission processing
        const fieldMap = Selectors.getFieldMapBase(datasheetState, fieldPermissionMap)!;
        const view = Selectors.getViewById(snapshot, viewId);
        if (!view) {
          return null;
        }
        const viewFilterDerivate = new ViewFilterDerivate(state, datasheet.id);
        const rows = viewFilterDerivate.getFilteredRows(view);
        for (const key in fieldMap) {
          fieldMethods[key] = Field.bindContext(fieldMap[key]!, state);
        }
        return {
          property: {
            ...view,
            rows,
          },
          fieldMap,
        };
      },
    });
    if (!selectedView) {
      return null;
    }
    return {
      view: selectedView,
      fieldMethods,
    };
  }
}

export interface ICascaderViewOption {
  auth: IAuthHeader;
  viewId: string;
}

export type CascaderSourceDataView = {
  view: databus.View;
  fieldMethods: IFieldMethods;
};
