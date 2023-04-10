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
import { UserService } from 'user/services/user.service';
import { CacheKeys, SwaggerConstants } from 'shared/common';
import { ApiCookieAuth, ApiOkResponse, ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { Controller, Delete, Get, Headers, Param, Put, Query } from '@nestjs/common';
import { DatasheetFieldCascaderService } from '../services/datasheet.field.cascader.service';
import { CascaderParam } from '../ros/cascader.param';
import { CascaderQueryRo } from '../ros/cascader.query.ro';
import { CascaderVo } from '../vos/cascader.vo';
import { DatasheetFieldCascaderSnapshotService } from '../services/datasheet.field.cascader.snapshot.service';
import { CascaderSnapshotVo } from '../vos/cascader.snapshot.vo';
import { CascaderSnapshotQueryRo } from '../ros/cascader.snapshot.query.ro';
import { CascaderSnapshotParam } from '../ros/cascader.snapshot.param';
import { CascaderSnapshotPutRo } from '../ros/cascader.snapshot.put.ro';
import { NodeService } from 'node/services/node.service';
import { RedisService } from '@apitable/nestjs-redis';
import util from 'util';

@ApiTags(SwaggerConstants.DATASHEET_TAG)
@Controller('nest/v1')
@ApiCookieAuth()
export class CascaderController {
  constructor(
    private readonly userService: UserService,
    private readonly datasheetFieldCascaderService: DatasheetFieldCascaderService,
    private readonly datasheetFieldCascaderSnapshotService: DatasheetFieldCascaderSnapshotService,
    private readonly nodeService: NodeService,
    private readonly redisService: RedisService,
  ) {}

  @Get(['spaces/:spaceId/datasheets/:datasheetId/cascader'])
  @ApiOperation({
    summary: 'Get datasheet cascader data struct',
  })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: CascaderVo })
  public async cascader(@Headers('cookie') cookie: string, @Param() param: CascaderParam, @Query() query: CascaderQueryRo): Promise<CascaderVo> {
    const { userId } = await this.userService.getMe({ cookie });
    return await this.datasheetFieldCascaderService.cascaderPack({ cookie, userId }, param.datasheetId, query.linkedViewId, query.linkedFieldIds);
  }

  @Get(['spaces/:spaceId/datasheets/:datasheetId/fields/:fieldId/cascader-snapshot'])
  @ApiOperation({
    summary: 'Get datasheet snapshot cascader data struct',
  })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: CascaderSnapshotVo })
  public async cascaderSnapshot(
    @Headers('cookie') cookie: string,
    @Param() param: CascaderSnapshotParam,
    @Query() query: CascaderSnapshotQueryRo
  ): Promise<CascaderSnapshotVo> {
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, param.datasheetId);
    const client = this.redisService.getClient();
    const cacheKey = util.format(CacheKeys.DATASHEET_CASCADER_TREE, param.datasheetId, param.fieldId);
    const cache = await client.get(cacheKey);
    const depth = query.linkedFieldIds.reduce((result, linkedFieldId) => {
      result += linkedFieldId;
      return result;
    }, '');
    if (cache) {
      const cacheObject = JSON.parse(cache);
      if(cacheObject.depth === depth) {
        return cacheObject.treeSelects;
      }
    }
    const cascader = await this.datasheetFieldCascaderSnapshotService.getCascaderSnapshot({
      spaceId: param.spaceId,
      datasheetId: param.datasheetId,
      fieldId: param.fieldId,
      linkedFieldIds: query.linkedFieldIds,
    });
    client.setex(cacheKey, 60, JSON.stringify({
      depth,
      treeSelects: cascader,
    }));
    return cascader;
  }

  @Put(['spaces/:spaceId/datasheets/:datasheetId/fields/:fieldId/cascader-snapshot'])
  @ApiOperation({
    summary: 'Update datasheet snapshot cascader data',
  })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: Boolean })
  public async updateCascaderSnapshot(
    @Headers('cookie') cookie: string,
    @Param() param: CascaderSnapshotParam,
    @Query() put: CascaderSnapshotPutRo,
  ): Promise<boolean> {
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, param.datasheetId);
    const client = this.redisService.getClient();
    const cacheKey = util.format(CacheKeys.DATASHEET_CASCADER_TREE, param.datasheetId, param.fieldId);
    await client.del(cacheKey);
    return await this.datasheetFieldCascaderSnapshotService.updateCascaderSnapshot({ userId, cookie }, userId, {
      spaceId: param.spaceId,
      datasheetId: param.datasheetId,
      fieldId: param.fieldId,
      linkedDatasheetId: put.linkedDatasheetId,
      linkedViewId: put.linkedViewId,
    });
  }

  @Delete(['spaces/:spaceId/datasheets/:datasheetId/fields/:fieldId/cascader-snapshot'])
  @ApiOperation({
    summary: 'Update datasheet snapshot cascader data',
  })
  @ApiProduces('application/json')
  @ApiOkResponse({ type: Boolean })
  public async deleteCascaderSnapshot(
    @Headers('cookie') cookie: string,
    @Param() param: CascaderSnapshotParam,
  ): Promise<boolean> {
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, param.datasheetId);
    const client = this.redisService.getClient();
    const cacheKey = util.format(CacheKeys.DATASHEET_CASCADER_TREE, param.datasheetId, param.fieldId);
    await client.del(cacheKey);
    return await this.datasheetFieldCascaderSnapshotService.deleteCascaderSnapshot({
      spaceId: param.spaceId,
      datasheetId: param.datasheetId,
      fieldId: param.fieldId,
    });
  }
}
