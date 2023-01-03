import { ApiTipConstant, ICollaCommandOptions } from '@apitable/core';
import { RedisService } from '@apitable/nestjs-redis';
import {
  Body,
  CacheTTL,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiInternalServerErrorResponse, ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { AttachmentDto } from 'database/dtos/attachment.dto';
import { InternalCreateDatasheetVo } from 'database/interfaces';
import { AttachmentUploadRo } from 'database/ros/attachment.upload.ro';
import { AttachmentService } from 'database/services/attachment/attachment.service';
import { FusionApiService } from 'fusion/services/fusion.api.service';
import { RecordDeleteVo } from 'fusion/vos/record.delete.vo';
import { I18nService } from 'nestjs-i18n';
import { API_MAX_MODIFY_RECORD_COUNTS, DATASHEET_HTTP_DECORATE, NodePermissions, SwaggerConstants, USER_HTTP_DECORATE } from 'shared/common';
import { NodePermissionEnum } from 'shared/enums/node.permission.enum';
import { ApiException } from 'shared/exception';
import { RedisLock } from 'shared/helpers/redis.lock';
import { ApiCacheInterceptor, apiCacheTTLFactory } from 'shared/interceptor/api.cache.interceptor';
import { ApiNotifyInterceptor } from 'shared/interceptor/api.notify.interceptor';
import { ApiUsageInterceptor } from 'shared/interceptor/api.usage.interceptor';
import { IFileInterface } from 'shared/interfaces/file.interface';
import { ApiAuthGuard } from 'shared/middleware/guard/api.auth.guard';
import { ApiDatasheetGuard } from 'shared/middleware/guard/api.datasheet.guard';
import { ApiFieldGuard } from 'shared/middleware/guard/api.field.guard';
import { ApiNodeGuard } from 'shared/middleware/guard/api.node.guard';
import { ApiSpaceGuard } from 'shared/middleware/guard/api.space.guard';
import { ApiUsageGuard } from 'shared/middleware/guard/api.usage.guard';
import { NodePermissionGuard } from 'shared/middleware/guard/node.permission.guard';
import { CreateDatasheetPipe } from 'shared/middleware/pipe/create.datasheet.pipe';
import { CreateFieldPipe } from 'shared/middleware/pipe/create.field.pipe';
import { FieldPipe } from 'shared/middleware/pipe/field.pipe';
import { QueryPipe } from 'shared/middleware/pipe/query.pipe';
import { RestService } from 'shared/services/rest/rest.service';
import { promisify } from 'util';
import { AssetUploadQueryRo } from './ros/asset.query';
import { DatasheetCreateRo } from './ros/datasheet.create.ro';
import { FieldCreateRo } from './ros/field.create.ro';
import { FieldDeleteRo } from './ros/field.delete.ro';
import { FieldQueryRo } from './ros/field.query.ro';
import { NodeDetailParamRo, NodeListParamRo, OldNodeDetailParamRo } from './ros/node.param.ro';
import { RecordCreateRo } from './ros/record.create.ro';
import { RecordDeleteRo } from './ros/record.delete.ro';
import { RecordParamRo } from './ros/record.param.ro';
import { RecordQueryRo } from './ros/record.query.ro';
import { RecordUpdateRo } from './ros/record.update.ro';
import { RecordViewQueryRo } from './ros/record.view.query.ro';
import { SpaceParamRo } from './ros/space.param.ro';
import { ApiResponse } from './vos/api.response';
import { AssetView, AttachmentVo } from './vos/attachment.vo';
import { DatasheetCreateDto, DatasheetCreateVo, FieldCreateVo } from './vos/datasheet.create.vo';
import { FieldDeleteVo } from './vos/field.delete.vo';
import { FieldListVo } from './vos/field.list.vo';
import { RecordListVo } from './vos/record.list.vo';
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
    private readonly redisService: RedisService,
    private readonly i18n: I18nService,
  ) {}

  @Get('/datasheets/:datasheetId/records')
  @ApiOperation({
    summary: 'Query datasheet records',
    description: 'Get multiple records of a datasheet',
    deprecated: false,
  })
  @ApiProduces('application/json')
  @UseGuards(ApiDatasheetGuard)
  @UseInterceptors(ApiCacheInterceptor)
  @CacheTTL(apiCacheTTLFactory)
  public async findAll(@Param() param: RecordParamRo, @Query(QueryPipe) query: RecordQueryRo, @Req() request): Promise<RecordPageVo> {
    const pageVo = await this.fusionApiService.getRecords(param.datasheetId, query, { token: request.headers.authorization });
    return ApiResponse.success(pageVo);
  }

  @Post('/datasheets/:datasheetId/records')
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
  async addRecords(@Param() param: RecordParamRo, @Query() query: RecordViewQueryRo, @Body(FieldPipe) body: RecordCreateRo): Promise<RecordListVo> {
    await this.fusionApiService.checkDstRecordCount(param.datasheetId, body);
    const client = this.redisService.getClient();
    const lock = promisify<string | string[], number, () => void>(RedisLock(client as any));
    /*
     * Add locks to resources, api of the same resource can only be consumed sequentially.
     * Solve the problem of concurrent writing of link fields and incomplete data of associated tables, 120 seconds timeout
     */
    const unlock = await lock('api.add.' + param.datasheetId, 120 * 1000);
    try {
      const res = await this.fusionApiService.addRecords(param.datasheetId, body, query.viewId);
      return ApiResponse.success(res);
    } finally {
      await unlock();
    }
  }

  @Get('/datasheets/:datasheetId/attachments/presignedUrl')
  @ApiOperation({
    summary: 'Get the pre-signed URL of the datasheet attachment',
    description: '',
    deprecated: false,
  })
  @ApiProduces('application/json')
  @NodePermissions(NodePermissionEnum.EDITABLE)
  @UseGuards(ApiDatasheetGuard)
  public async getPresignedUrl(@Query() query: AssetUploadQueryRo, @Req() req): Promise<AssetView> {
    // check space capacity
    const datasheet = req[DATASHEET_HTTP_DECORATE];
    const spaceCapacityOverLimit = await this.restService.capacityOverLimit({ token: req.headers.authorization }, datasheet.spaceId);
    if (spaceCapacityOverLimit) {
      const error = ApiException.tipError(ApiTipConstant.api_space_capacity_over_limit);
      return Promise.reject(error);
    }
    const results = await this.restService.getUploadPresignedUrl({ token: req.headers.authorization }, datasheet.nodeId, query.count);
    return ApiResponse.success({ results });
  }

  @Post('/datasheets/:datasheetId/attachments')
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
  public async addAttachment(@Param() param: RecordParamRo, @Req() req, @Res() reply): Promise<AttachmentVo> {
    // check space capacity
    const datasheet = req[DATASHEET_HTTP_DECORATE];
    const spaceCapacityOverLimit = await this.restService.capacityOverLimit({ token: req.headers.authorization }, datasheet.spaceId);
    if (spaceCapacityOverLimit) {
      const error = ApiException.tipError(ApiTipConstant.api_space_capacity_over_limit);
      return Promise.reject(error);
    }
    const service = this.attachService;
    const i18nService = this.i18n;
    const dtos: AttachmentDto[] = [];
    const newFiles: IFileInterface[] = [];
    const handler = this.attachService.getFileUploadHandler(param.datasheetId, newFiles, req, reply);
    await req.multipart(handler, onEnd);

    // Uploading finished
    async function onEnd(err: any) {
      let localError;
      if (err) {
        if (err instanceof ApiException) {
          localError = err;
        } else {
          localError = ApiException.tipError(ApiTipConstant.api_upload_attachment_error);
        }
      }
      if (newFiles.length > 1) {
        localError = ApiException.tipError(ApiTipConstant.api_upload_attachment_exceed_limit);
      }
      if (localError) {
        reply.statusCode = localError.getTip().statusCode;
        const errMsg = await i18nService.translate(localError.message, {
          lang: req[USER_HTTP_DECORATE]?.locale,
        });
        return reply.send(ApiResponse.error(errMsg, localError.getTip().code));
      }
      try {
        const dto = await service.uploadAttachment(param.datasheetId, newFiles[0], { token: req.headers.authorization });
        return reply.send(ApiResponse.success(dto));
      } catch (e) {
        reply.statusCode = HttpStatus.OK;
        const errMsg = await i18nService.translate(e.message, {
          lang: req[USER_HTTP_DECORATE]?.locale,
          args: e.getExtra(),
        });
        return reply.send(ApiResponse.error(errMsg, e.getTip().code));
      }
    }

    return ApiResponse.success(dtos[0]);
  }

  @Patch('/datasheets/:datasheetId/records')
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
  public async updateRecord(
    @Param() param: RecordParamRo,
    @Query() query: RecordViewQueryRo,
    @Body(FieldPipe) body: RecordUpdateRo,
  ): Promise<RecordListVo> {
    const listVo = await this.fusionApiService.updateRecords(param.datasheetId, body, query.viewId);
    return ApiResponse.success(listVo);
  }

  @Put('/datasheets/:datasheetId/records')
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
  public async updateRecordOfPut(
    @Param() param: RecordParamRo,
    @Query() query: RecordViewQueryRo,
    @Body(FieldPipe) body: RecordUpdateRo,
  ): Promise<RecordListVo> {
    const listVo = await this.fusionApiService.updateRecords(param.datasheetId, body, query.viewId);
    return ApiResponse.success(listVo);
  }

  @Delete('/datasheets/:datasheetId/records')
  @ApiOperation({
    summary: 'Delete records',
    description: 'Delete a number of records from a datasheet',
    deprecated: false,
  })
  @ApiProduces('application/json')
  @UseGuards(ApiDatasheetGuard)
  public async deleteRecord(@Param() param: RecordParamRo, @Query(QueryPipe) query: RecordDeleteRo): Promise<RecordDeleteVo> {
    if (!query.recordIds) {
      throw ApiException.tipError(ApiTipConstant.api_params_empty_error, { property: 'recordIds' });
    }
    if (query.recordIds.length > API_MAX_MODIFY_RECORD_COUNTS) {
      throw ApiException.tipError(ApiTipConstant.api_params_records_max_count_error, { count: API_MAX_MODIFY_RECORD_COUNTS });
    }
    const result = await this.fusionApiService.deleteRecord(param.datasheetId, Array.from(new Set(query.recordIds)));
    if (result) {
      return ApiResponse.success(undefined);
    }
    throw ApiException.tipError(ApiTipConstant.api_delete_error);
  }

  @Get('/datasheets/:datasheetId/fields')
  @ApiOperation({
    summary: 'Query all fields of a datasheet',
    description: 'All fields of the datasheet, without paging',
    deprecated: false,
  })
  @ApiProduces('application/json')
  @UseGuards(ApiDatasheetGuard)
  public async datasheetFields(@Param() param: RecordParamRo, @Query() query: FieldQueryRo): Promise<FieldListVo> {
    // FIXME: types
    const metaFields: any = await this.fusionApiService.getFieldList(param.datasheetId, query);
    if (metaFields) {
      return ApiResponse.success({ fields: metaFields });
    }
    throw ApiException.tipError(ApiTipConstant.api_server_error);
  }

  @Get('/datasheets/:datasheetId/views')
  @ApiOperation({
    summary: 'Query all views of a datasheet',
    description: 'A datasheet can create up to 30 views and return them all at once when requesting a view, without paging.',
    deprecated: false,
  })
  @ApiProduces('application/json')
  @UseGuards(ApiDatasheetGuard)
  public async datasheetViews(@Param() param: RecordParamRo): Promise<ViewListVo> {
    // FIXME: types
    const metaViews: any = await this.fusionApiService.getViewList(param.datasheetId);
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
  public async spaceList() {
    // This interface does not count API usage for now
    const spaceList = await this.fusionApiService.getSpaceList();
    return ApiResponse.success({
      spaces: spaceList,
    });
  }

  @Post('/spaces/:spaceId/datasheets/:datasheetId/fields')
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
  public async createField(
    @Param('spaceId') spaceId: string,
    @Param('datasheetId') datasheetId: string,
    @Body(CreateFieldPipe) createRo: FieldCreateRo,
  ): Promise<FieldCreateVo> {
    const metaFields: any = await this.fusionApiService.getFieldList(datasheetId, { viewId: '' });
    const duplicatedName = metaFields.filter(field => field.name === createRo.name);
    if (duplicatedName.length > 0) {
      throw ApiException.tipError(ApiTipConstant.api_params_must_unique, { property: 'name' });
    }
    const fieldCreateDto = await this.fusionApiService.addField(datasheetId, createRo);
    return ApiResponse.success(fieldCreateDto);
  }

  @Delete('/spaces/:spaceId/datasheets/:datasheetId/fields/:fieldId')
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
    @Param('spaceId') spaceId: string,
    @Param('datasheetId') datasheetId: string,
    @Param('fieldId') fieldId: string,
    @Body() fieldDeleteRo: FieldDeleteRo,
  ): Promise<FieldDeleteVo> {
    const metaFields: any = await this.fusionApiService.getFieldList(datasheetId, { viewId: '' });
    const existFieldId = metaFields.filter(field => field.id === fieldId);
    if (existFieldId.length === 0) {
      throw ApiException.tipError(ApiTipConstant.api_params_not_exists, { property: 'fieldId', value: fieldId });
    }
    if (metaFields[0].id === fieldId) {
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
    @Req() request,
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
  public async nodeList(@Param() param: NodeListParamRo) {
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
  public async _nodeDetail(@Param() param: OldNodeDetailParamRo) {
    const { nodeId } = param;
    const nodeInfo = await this.fusionApiService.getNodeDetail(nodeId);
    return ApiResponse.success(nodeInfo);
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

  /**
   * Hidden Interface
   */
  @Post('datasheets/:datasheetId/executeCommand')
  @ApiOperation({
    summary: 'Create the op of the resource',
    description: 'For flexibility reasons and for internal automation testing, provide an interface to freely create commands',
    deprecated: false,
  })
  @ApiProduces('application/json')
  public async executeCommand(@Body() body: ICollaCommandOptions, @Param('datasheetId') datasheetId: string, @Req() request) {
    const commandBody = body;
    const token = request.headers.authorization;
    return await this.fusionApiService.executeCommand(datasheetId, commandBody, { token });
  }
}
