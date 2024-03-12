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

import { ApiTipConstant, Field, ICollaCommandOptions, IRemoteChangeset } from '@apitable/core';
import {
  Body,
  CacheTTL,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  SetMetadata,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags
} from '@nestjs/swagger';
import { AttachmentService } from 'database/attachment/services/attachment.service';
import { DatasheetMetaService } from 'database/datasheet/services/datasheet.meta.service';
import { InternalCreateDatasheetVo } from 'database/interfaces';
import { FastifyReply, FastifyRequest } from 'fastify';
import { DatasheetFieldDto } from 'fusion/dtos/datasheet.field.dto';
import { ApiAuthGuard } from 'fusion/middleware/guard/api.auth.guard';
import { ApiDatasheetGuard, DATASHEET_OPTIONS, IApiDatasheetOptions } from 'fusion/middleware/guard/api.datasheet.guard';
import { ApiFieldGuard, FIELD_OPTIONS, IApiFieldOptions } from 'fusion/middleware/guard/api.field.guard';
import { ApiNodeGuard } from 'fusion/middleware/guard/api.node.guard';
import { ApiSpaceGuard } from 'fusion/middleware/guard/api.space.guard';
import { ApiUsageGuard } from 'fusion/middleware/guard/api.usage.guard';
import { NodePermissionGuard } from 'fusion/middleware/guard/node.permission.guard';
import { AttachmentParamRo, AttachmentUploadRo } from 'fusion/ros/attachment.upload.ro';
import { FusionApiService } from 'fusion/services/fusion.api.service';
import { RecordDeleteVo } from 'fusion/vos/record.delete.vo';
import { API_MAX_MODIFY_RECORD_COUNTS, DATASHEET_HTTP_DECORATE, NodePermissions, SwaggerConstants } from 'shared/common';
import { NodePermissionEnum } from 'shared/enums/node.permission.enum';
import { ApiException, CommonException, ServerException } from 'shared/exception';
import { ApiCacheInterceptor, apiCacheTTLFactory } from 'shared/interceptor/api.cache.interceptor';
import { ApiNotifyInterceptor } from 'shared/interceptor/api.notify.interceptor';
import { ApiUsageInterceptor } from 'shared/interceptor/api.usage.interceptor';
import { RestService } from 'shared/services/rest/rest.service';
import { CreateDatasheetPipe } from './middleware/pipe/create.datasheet.pipe';
import { CreateFieldPipe } from './middleware/pipe/create.field.pipe';
import { FieldPipe } from './middleware/pipe/field.pipe';
import { QueryPipe } from './middleware/pipe/query.pipe';
import { AssetUploadQueryRo } from './ros/asset.query';
import { DatasheetCreateRo } from './ros/datasheet.create.ro';
import { FieldCreateRo } from './ros/field.create.ro';
import { FieldDeleteRo } from './ros/field.delete.ro';
import { FieldQueryRo } from './ros/field.query.ro';
import { NodeDetailParamRo, NodeListParamRo, OldNodeDetailParamRo } from './ros/node.param.ro';
import { RecordCreateRo } from './ros/record.create.ro';
import { DeleteRecordParamRo, RecordDeleteRo } from './ros/record.delete.ro';
import { RecordParamRo } from './ros/record.param.ro';
import { RecordQueryRo } from './ros/record.query.ro';
import { RecordUpdateRo } from './ros/record.update.ro';
import { RecordViewQueryRo } from './ros/record.view.query.ro';
import { SpaceParamRo } from './ros/space.param.ro';
import { ViewParamRo } from './ros/view.param.ro';
import { ApiResponse } from './vos/api.response';
import { AssetView, AttachmentVo } from './vos/attachment.vo';
import { DatasheetCreateDto, DatasheetCreateVo, FieldCreateVo } from './vos/datasheet.create.vo';
import { FieldDeleteVo } from './vos/field.delete.vo';
import { FieldListVo } from './vos/field.list.vo';
import { RecordIdListVo, RecordListVo } from './vos/record.list.vo';
import { RecordPageVo } from './vos/record.page.vo';
import { ViewListVo } from './vos/view.list.vo';

/**
 * TODO: cache response data, send notification while member changed, should maintain the data in the same server and cache them
 * Fusion API, about datasheets APIs
 */
@ApiTags(SwaggerConstants.TAG)
@Controller('/fusion/v1')
@ApiBearerAuth()
@UseGuards(ApiAuthGuard, ApiUsageGuard, NodePermissionGuard)
@UseInterceptors(ApiUsageInterceptor)
export class FusionApiController {
  constructor(
    private readonly fusionApiService: FusionApiService,
    private readonly attachService: AttachmentService,
    private readonly restService: RestService,
    private readonly datasheetMetaService: DatasheetMetaService
  ) {
  }

  @Get('/datasheets/:dstId/records')
  @ApiOperation({
    summary: 'Query datasheet records',
    description: 'Get multiple records of a datasheet',
    deprecated: false,
  })
  @ApiProduces('application/json')
  @UseGuards(ApiDatasheetGuard)
  @UseInterceptors(ApiCacheInterceptor)
  @CacheTTL(apiCacheTTLFactory)
  @SetMetadata(DATASHEET_OPTIONS, { requireMetadata: true, loadSingleView: true } as IApiDatasheetOptions)
  public async getRecords(
    @Param() param: RecordParamRo,
    @Query(QueryPipe) query: RecordQueryRo,
    @Req() request: FastifyRequest,
  ): Promise<RecordPageVo> {
    const pageVo = await this.fusionApiService.getRecords(param.dstId, query, { token: request.headers.authorization });
    return ApiResponse.success(pageVo);
  }

  @Post('/datasheets/:dstId/records')
  @ApiOperation({
    summary: 'Add multiple rows to a specified datasheet',
    description:
      'Up to 10 records can be created in a single request.' +
      'You need to bring `Content-Type: application/json` in the Request Header to submit data in raw json format. \n' +
      'The POST data is a JSON object, which should contain an array: `records`, the records array contains multiple records to be created. \n' +
      'The object `fields` contains the values of the fields to be created in a record,' +
      'and can contain any number of field values, not necessarily all of them. If there are field defaults set,' +
      'field values that are not passed in will be saved according to the default values at the time the fields were set.',
    deprecated: false,
  })
  @ApiBody({
    description: 'Add record parameters',
    type: RecordCreateRo,
  })
  @ApiProduces('application/json')
  @ApiConsumes('application/json')
  @UseGuards(ApiDatasheetGuard)
  @UseInterceptors(ApiNotifyInterceptor)
  @SetMetadata(DATASHEET_OPTIONS, { requireMetadata: true } as IApiDatasheetOptions)
  async addRecords(@Param() param: RecordParamRo, @Query() query: RecordViewQueryRo, @Body(FieldPipe) body: RecordCreateRo): Promise<RecordListVo> {
    const res = await this.fusionApiService.addRecords(param.dstId, body, query.viewId!);
    return ApiResponse.success(res);
  }

  @Get('/datasheets/:dstId/attachments/presignedUrl')
  @ApiOperation({
    summary: 'Get the pre-signed URL of the datasheet attachment',
    description: '',
    deprecated: false,
  })
  @ApiProduces('application/json')
  @NodePermissions(NodePermissionEnum.EDITABLE)
  @UseGuards(ApiDatasheetGuard)
  public async getPresignedUrl(@Query() query: AssetUploadQueryRo, @Req() req: FastifyRequest): Promise<AssetView> {
    await this.checkSpaceCapacity(req);
    const datasheet = req[DATASHEET_HTTP_DECORATE];
    const results = await this.restService.getUploadPresignedUrl({ token: req.headers.authorization }, datasheet.nodeId, query.count);
    return ApiResponse.success({ results });
  }

  private async checkSpaceCapacity(req: FastifyRequest) {
    const datasheet = req[DATASHEET_HTTP_DECORATE];
    const spaceCapacityOverLimit = await this.restService.capacityOverLimit({ token: req.headers.authorization }, datasheet.spaceId);
    if (spaceCapacityOverLimit) {
      const error = ApiException.tipError(ApiTipConstant.api_space_capacity_over_limit);
      return Promise.reject(error);
    }
    return;
  }

  @Post('/datasheets/:dstId/attachments')
  @ApiOperation({
    summary: 'Upload datasheet attachment',
    description:
      'You need to bring `Content-Type: multipart/form-data` in the Request Header to submit data as a form. \n' +
      'The POST data is a `formData` object. \n' +
      'Upload attachment interface, only one attachment is allowed to be received at a time. ' +
      'If you need to upload more than one file, you need to call this interface repeatedly.',
    deprecated: true,
  })
  @ApiBody({
    description: 'attachment',
    type: AttachmentUploadRo,
  })
  @ApiInternalServerErrorResponse()
  @ApiConsumes('multipart/form-data')
  @ApiProduces('application/json')
  @NodePermissions(NodePermissionEnum.EDITABLE)
  @UseGuards(ApiDatasheetGuard)
  // TODO: Waiting for nestjs official inheritance multi and fastify
  public async addAttachment(@Param() param: AttachmentParamRo, @Req() req: FastifyRequest, @Res() reply: FastifyReply): Promise<AttachmentVo> {
    await this.checkSpaceCapacity(req);
    const handler = await this.attachService.getFileUploadHandler(param.dstId, req, reply);
    await req.multipart(handler as (...args: Parameters<typeof handler>) => void, function (err: Error) {
      if (err instanceof ServerException) {
        reply.statusCode = err.getStatusCode();
        void reply.send(ApiResponse.error(err.getMessage(), err.getCode()));
      }
      if (err) {
        void reply.send(ApiResponse.error(CommonException.SERVER_ERROR.message, CommonException.SERVER_ERROR.code));
      }
    });
    return ApiResponse.success({} as any);
  }

  @Patch('/datasheets/:dstId/records')
  @ApiOperation({
    summary: 'Update Records',
    description:
      'Update several records of a datasheet. ' +
      'When submitted using the PUT method, only the fields that are specified will have their data updated, ' +
      'and fields that are not specified will retain their old values.',
    deprecated: false,
  })
  @ApiBody({
    description: 'Update record parameters',
    type: RecordUpdateRo,
  })
  @ApiProduces('application/json')
  @ApiConsumes('application/json')
  @UseGuards(ApiDatasheetGuard)
  @UseInterceptors(ApiNotifyInterceptor)
  @SetMetadata(DATASHEET_OPTIONS, { requireMetadata: true } as IApiDatasheetOptions)
  public async updateRecords(
    @Param() param: RecordParamRo,
    @Query() query: RecordViewQueryRo,
    @Body(FieldPipe) body: RecordUpdateRo,
  ): Promise<RecordListVo> {
    const listVo = await this.fusionApiService.updateRecords(param.dstId, body, query.viewId!);
    return ApiResponse.success(listVo);
  }

  @Put('/datasheets/:dstId/records')
  @ApiOperation({
    summary: 'Update Records',
    description:
      'Update several records of a datasheet. ' +
      'When submitted using the PUT method, only the fields that are specified will have their data updated, ' +
      'and fields that are not specified will retain their old values.',
    deprecated: false,
  })
  @ApiBody({
    description: 'Update record parameters',
    type: RecordUpdateRo,
  })
  @ApiProduces('application/json')
  @ApiConsumes('application/json')
  @UseGuards(ApiDatasheetGuard)
  @UseInterceptors(ApiNotifyInterceptor)
  @SetMetadata(DATASHEET_OPTIONS, { requireMetadata: true } as IApiDatasheetOptions)
  public updateRecordsByPut(
    @Param() param: RecordParamRo,
    @Query() query: RecordViewQueryRo,
    @Body(FieldPipe) body: RecordUpdateRo,
  ): Promise<RecordListVo> {
    return this.updateRecords(param, query, body);
  }

  @Delete('/datasheets/:dstId/records')
  @ApiOperation({
    summary: 'Delete records',
    description: 'Delete a number of records from a datasheet',
    deprecated: false,
  })
  @ApiProduces('application/json')
  @UseGuards(ApiDatasheetGuard)
  public async deleteRecords(@Param() param: DeleteRecordParamRo, @Query(QueryPipe) query: RecordDeleteRo): Promise<RecordDeleteVo> {
    if (!query.recordIds) {
      throw ApiException.tipError(ApiTipConstant.api_params_empty_error, { property: 'recordIds' });
    }
    if (query.recordIds.length > API_MAX_MODIFY_RECORD_COUNTS) {
      throw ApiException.tipError(ApiTipConstant.api_params_records_max_count_error, { count: API_MAX_MODIFY_RECORD_COUNTS });
    }
    const result = await this.fusionApiService.deleteRecord(param.dstId, Array.from(new Set(query.recordIds)));
    if (result) {
      return ApiResponse.success(undefined);
    }
    throw ApiException.tipError(ApiTipConstant.api_delete_error);
  }

  @Get('/datasheets/:dstId/fields')
  @ApiOperation({
    summary: 'Query all fields of a datasheet',
    description: 'All fields of the datasheet, without paging',
    deprecated: false,
  })
  @ApiOkResponse({
    description: 'Get successful',
    type: FieldListVo,
  })
  @ApiProduces('application/json')
  @UseGuards(ApiDatasheetGuard)
  public async getFields(@Param() param: RecordParamRo, @Query() query: FieldQueryRo): Promise<FieldListVo> {
    const fields = await this.fusionApiService.getFieldList(param.dstId, query);
    const fieldDtos = fields.map((field) =>
      field.getViewObject((f, { state }) => Field.bindContext(f, state).getApiMeta(param.dstId) as DatasheetFieldDto),
    );
    return ApiResponse.success({ fields: fieldDtos });
  }

  @Get('/datasheets/:dstId/views')
  @ApiOperation({
    summary: 'Query all views of a datasheet',
    description: 'A datasheet can create up to 30 views and return them all at once when requesting a view, without paging.',
    deprecated: false,
  })
  @ApiProduces('application/json')
  @UseGuards(ApiDatasheetGuard)
  public async getViews(@Param() param: ViewParamRo): Promise<ViewListVo> {
    const metaViews = await this.fusionApiService.getViewList(param.dstId);
    if (metaViews) {
      return ApiResponse.success({ views: metaViews });
    }
    throw ApiException.tipError(ApiTipConstant.api_server_error);
  }

  @Get('/spaces')
  @ApiOperation({
    summary: 'Query space list',
    description: 'Returns a list of spaces for the current user. Returns it all at once, without paging.',
    deprecated: false,
  })
  @ApiProduces('application/json')
  public async getSpaces() {
    // This interface does not count API usage for now
    const spaceList = await this.fusionApiService.getSpaceList();
    return ApiResponse.success({
      spaces: spaceList,
    });
  }

  @Post('/spaces/:spaceId/datasheets/:dstId/fields')
  @ApiOperation({
    summary: 'New field',
    description: 'New field',
    deprecated: false,
  })
  @ApiBody({
    description: 'New field',
    type: FieldCreateRo,
  })
  @ApiProduces('application/json')
  @ApiConsumes('application/json')
  @UseGuards(ApiFieldGuard)
  @SetMetadata(FIELD_OPTIONS, { requireFieldMap: true } as IApiFieldOptions)
  public async createField(
    @Param('spaceId') _spaceId: string,
    @Param('dstId') datasheetId: string,
    @Body(CreateFieldPipe) createRo: FieldCreateRo,
  ): Promise<FieldCreateVo> {
    if (await this.datasheetMetaService.isFieldNameExist(datasheetId, createRo.name)) {
      throw ApiException.tipError(ApiTipConstant.api_params_must_unique, { property: 'name' });
    }
    const fieldCreateDto = await this.fusionApiService.addField(datasheetId, createRo);
    return ApiResponse.success(fieldCreateDto);
  }

  @Delete('/spaces/:spaceId/datasheets/:dstId/fields/:fieldId')
  @ApiOperation({
    summary: 'Delete field',
    description: 'Delete field',
    deprecated: false,
  })
  @ApiBody({
    description: 'Delete field',
    type: FieldCreateRo,
  })
  @ApiProduces('application/json')
  @ApiConsumes('application/json')
  @UseGuards(ApiFieldGuard)
  public async deleteField(
    @Param('spaceId') _spaceId: string,
    @Param('dstId') datasheetId: string,
    @Param('fieldId') fieldId: string,
    @Body() fieldDeleteRo: FieldDeleteRo,
  ): Promise<FieldDeleteVo> {
    // TODO only fetch field ids
    const fields = await this.fusionApiService.getFieldList(datasheetId, { viewId: '' });
    const existFieldId = fields.filter((field) => field.id === fieldId);
    if (existFieldId.length === 0) {
      throw ApiException.tipError(ApiTipConstant.api_params_not_exists, { property: 'fieldId', value: fieldId });
    }
    if (fields[0]!.id === fieldId) {
      throw ApiException.tipError(ApiTipConstant.api_params_primary_field_not_allowed_to_delete, { property: 'name' });
    }
    await this.fusionApiService.deleteField(datasheetId, fieldId, fieldDeleteRo.conversion);
    return ApiResponse.success({});
  }

  @Post('/spaces/:spaceId/datasheets')
  @ApiOperation({
    summary: 'Create Datasheet',
    description: 'Create Datasheet and their fields',
    deprecated: false,
  })
  @ApiBody({
    description: 'Create Datasheet',
    type: DatasheetCreateRo,
  })
  @ApiProduces('application/json')
  @ApiConsumes('application/json')
  @UseGuards(ApiSpaceGuard)
  public async createDatasheet(
    @Param() param: SpaceParamRo,
    @Body(CreateDatasheetPipe) createRo: DatasheetCreateRo,
    @Req() request: FastifyRequest,
  ): Promise<DatasheetCreateVo> {
    const { spaceId } = param;
    const authHeader = { token: request.headers.authorization };
    const vo: InternalCreateDatasheetVo = await this.restService.createDatasheet(spaceId, authHeader, createRo);
    if (!createRo.fields || createRo.fields.length === 0) {
      const fields = await this.fusionApiService.getFieldCreateDtos(vo.datasheetId);
      const data: DatasheetCreateDto = { id: vo.datasheetId, createdAt: vo.createdAt, fields };
      return ApiResponse.success(data);
    }
    try {
      const datasheetCreateDto = await this.fusionApiService.addDatasheetFields(vo.datasheetId, createRo);
      datasheetCreateDto.createdAt = vo.createdAt;
      return ApiResponse.success(datasheetCreateDto);
    } catch (err) {
      await this.restService.deleteNode(spaceId, vo.datasheetId, authHeader);
      throw err;
    }
  }

  @Get('/spaces/:spaceId/nodes')
  @ApiOperation({
    summary: 'Query the list of space station level 1 document nodes',
    description: 'Returns a list of file nodes at the specified space station level. Returns it all at once, without paging.',
    deprecated: false,
  })
  @ApiProduces('application/json')
  @UseGuards(ApiSpaceGuard)
  public async getNodes(@Param() param: NodeListParamRo) {
    const { spaceId } = param;
    const nodeList = await this.fusionApiService.getNodeList(spaceId);
    return ApiResponse.success({
      nodes: nodeList,
    });
  }

  /**
   * @deprecated No spacesId can also directly query node details, first compatible with the reservation. Delete here after no route request.
   */
  @Get('/spaces/:spaceId/nodes/:nodeId')
  @ApiOperation({
    summary: 'Query Node Details',
    description: 'Query the details of the specified file node',
    deprecated: true,
  })
  @ApiProduces('application/json')
  @UseGuards(ApiSpaceGuard)
  public _nodeDetail(@Param() param: OldNodeDetailParamRo) {
    return this.nodeDetail(param);
  }

  @Get('/nodes/:nodeId')
  @ApiOperation({
    summary: 'Query Node Details',
    description: 'Query the details of the specified file node',
    deprecated: false,
  })
  @ApiProduces('application/json')
  @UseGuards(ApiNodeGuard)
  public async nodeDetail(@Param() param: NodeDetailParamRo) {
    const { nodeId } = param;
    const nodeInfo = await this.fusionApiService.getNodeDetail(nodeId);
    return ApiResponse.success(nodeInfo);
  }

  @Get('/timemachine/:dstId')
  @ApiOperation({
    summary: 'get all deleted record by time machine',
    description: 'via time machine api',
    deprecated: false,
  })
  @ApiProduces('application/json')
  @UseGuards(ApiDatasheetGuard)
  @UseInterceptors(ApiCacheInterceptor)
  @CacheTTL(apiCacheTTLFactory)
  @SetMetadata(DATASHEET_OPTIONS, { requireMetadata: true, loadSingleView: true } as IApiDatasheetOptions)
  public async getDeletedRecords(
      @Param() param: RecordParamRo,
  ): Promise<RecordIdListVo> {
    const pageVo = await this.fusionApiService.getDeletedRecords(param.dstId);
    return ApiResponse.success(pageVo);
  }

  /**
   * Hidden Interface
   */
  @Post('datasheets/:dstId/executeCommand')
  @ApiOperation({
    summary: 'Create the op of the resource',
    description: 'For flexibility reasons and for internal automation testing, provide an interface to freely create commands',
    deprecated: false,
  })
  @ApiProduces('application/json')
  public async executeCommand(@Body() body: ICollaCommandOptions, @Param('dstId') datasheetId: string, @Req() request: FastifyRequest) {
    const commandBody = body;
    const token = request.headers.authorization;
    return await this.fusionApiService.executeCommand(datasheetId, commandBody, { token });
  }

  /**
   * Hidden Interface
   */
  @Post('datasheets/:dstId/executeCommandFromRust')
  @ApiOperation({
    summary: 'Create the op of the resource',
    description: 'For flexibility reasons and for internal automation testing, provide an interface to freely create commands',
    deprecated: false,
  })
  @ApiProduces('application/json')
  public async executeCommandFromRust(@Body() body: IRemoteChangeset[], @Param('dstId') datasheetId: string, @Req() request: FastifyRequest) {
    const commandBody = body;
    const token = request.headers.authorization;
    return await this.fusionApiService.executeCommandFromRust(datasheetId, commandBody, { token });
  }
}
