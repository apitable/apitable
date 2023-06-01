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
import { Controller, Get, Param, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { SwaggerConstants } from 'shared/common';
import { ApiUsageInterceptor } from 'shared/interceptor/api.usage.interceptor';
import { ApiAuthGuard } from './middleware/guard/api.auth.guard';
import { ApiUsageGuard } from './middleware/guard/api.usage.guard';
import { NodePermissionGuard } from './middleware/guard/node.permission.guard';
import { ApiSpaceGuard } from './middleware/guard/api.space.guard';
import { NodeListQueryRo } from './ros/node.param.ro';
import { ApiResponse } from './vos/api.response';
import { FusionNodeApiService } from './services/fusion.node.api.service';

@ApiTags(SwaggerConstants.TAG)
@Controller('/fusion/v2')
@ApiBearerAuth()
@UseGuards(ApiAuthGuard, ApiUsageGuard, NodePermissionGuard)
@UseInterceptors(ApiUsageInterceptor)
export class FusionApiV2Controller {
  constructor(
    private readonly fusionNodeApiServer: FusionNodeApiService,
  ){}

  @Get('/spaces/:spaceId/nodes')
  @ApiOperation({
    summary: 'Query the list of space station level 1 document nodes',
    description: 'Returns a list of file nodes at the specified space station level. Returns it all at once, without paging.',
    deprecated: false,
  })
  @ApiProduces('application/json')
  @UseGuards(ApiSpaceGuard)
  public async getNodes( @Param('spaceId') spaceId: string, @Query() queryParam: NodeListQueryRo) {
    const { type, permissions, query } = queryParam;
    const uniquePermissions = Array.from(new Set(permissions));
    const nodes = await this.fusionNodeApiServer.getNodeList(spaceId, type, uniquePermissions || [0, 1, 2, 3], query);
    return ApiResponse.success({
      nodes: nodes,
    });
  }
}