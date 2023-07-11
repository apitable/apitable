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

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DATASHEET_HTTP_DECORATE, DATASHEET_META_HTTP_DECORATE, USER_HTTP_DECORATE } from '../../../shared/common';
import { ApiException } from '../../../shared/exception';
import { ApiTipConstant } from '@apitable/core';
import { UnitMemberService } from 'unit/services/unit.member.service';
import { Reflector } from '@nestjs/core';
import { DatasheetMetaService } from 'database/datasheet/services/datasheet.meta.service';
import { FastifyRequest } from 'fastify';

export interface IApiDatasheetOptions {
  requireMetadata?: boolean;
  /**
   * If true, only load one view in metadata, either the first view, or the view specified by
   * viewId in query param.
   */
  loadSingleView?: boolean;
}

export const DATASHEET_OPTIONS = 'datasheet';

/**
 * Guards are executed after each middleware, but before any interceptor or pipe.
 * datasheet info validate
 * the path start with:/fusion/v1/datasheets
 */
@Injectable()
export class ApiDatasheetGuard implements CanActivate {
  constructor(
    private readonly memberService: UnitMemberService,
    private readonly reflector: Reflector,
    private readonly metaService: DatasheetMetaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: FastifyRequest = context.switchToHttp().getRequest();
    // check if the datasheet exists
    if (!(request.params as any)?.dstId) {
      throw ApiException.tipError(ApiTipConstant.api_datasheet_not_exist);
    }
    const options = this.reflector.get<IApiDatasheetOptions>(DATASHEET_OPTIONS, context.getHandler());
    const datasheet = request[DATASHEET_HTTP_DECORATE];
    if (!datasheet) {
      throw ApiException.tipError(ApiTipConstant.api_datasheet_not_exist);
    }
    if (options?.requireMetadata) {
      const dstId = (request.params as any).dstId;
      if (options.loadSingleView) {
        const meta = await this.metaService.getMetadataWithViewByDstId(dstId, (request.query as any)?.viewId);
        // If viewId does not exist, meta.views is [null]
        if ((request.query as any)?.viewId && (meta.views.length === 0 || !meta.views[0])) {
          throw ApiException.tipError(ApiTipConstant.api_param_view_not_exists);
        }
        request[DATASHEET_META_HTTP_DECORATE] = meta;
      } else {
        request[DATASHEET_META_HTTP_DECORATE] = await this.metaService.getMetaDataByDstId(dstId);
      }
    }
    const spaceId = datasheet.spaceId!;
    const user = request[USER_HTTP_DECORATE];
    const spaceIds = await this.memberService.selectSpaceIdsByUserId(user.id);
    // no permission of the space
    if (!spaceIds.length || !spaceIds.includes(spaceId)) {
      throw ApiException.tipError(ApiTipConstant.api_datasheet_not_visible);
    }
    return true;
  }
}
