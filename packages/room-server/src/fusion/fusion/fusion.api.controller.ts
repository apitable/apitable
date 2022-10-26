import {
  Body, CacheTTL, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put, Query, Req, Res, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiInternalServerErrorResponse, ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { ICollaCommandOptions } from '@apitable/core';
import { RedisService } from '@vikadata/nestjs-redis';
import { DATASHEET_HTTP_DECORATE, NodePermissions, SwaggerConstants, USER_HTTP_DECORATE } from 'common';
import { NodePermissionEnum } from 'enums/node.permission.enum';
import { ApiTipIdEnum } from 'enums/string.enum';
import { ApiException } from 'exception/api.exception';
import { RedisLock } from 'helpers/redis.lock';
import { ApiCacheInterceptor, apiCacheTTLFactory } from 'interceptor/api.cache.interceptor';
import { ApiNotifyInterceptor } from 'interceptor/api.notify.interceptor';
import { ApiUsageInterceptor } from 'interceptor/api.usage.interceptor';
import { IFileInterface } from 'interfaces/file.interface';
import { ApiAuthGuard } from 'middleware/guard/api.auth.guard';
import { ApiDatasheetGuard } from 'middleware/guard/api.datasheet.guard';
import { ApiFieldGuard } from 'middleware/guard/api.field.guard';
import { ApiNodeGuard } from 'middleware/guard/api.node.guard';
import { ApiSpaceGuard } from 'middleware/guard/api.space.guard';
import { ApiUsageGuard } from 'middleware/guard/api.usage.guard';
import { NodePermissionGuard } from 'middleware/guard/node.permission.guard';
import { CreateDatasheetPipe } from 'middleware/pipe/create.datasheet.pipe';
import { CreateFieldPipe } from 'middleware/pipe/create.field.pipe';
import { FieldPipe } from 'middleware/pipe/field.pipe';
import { QueryPipe } from 'middleware/pipe/query.pipe';
import { ApiResponse } from 'model/api.response';
import { AttachmentDto } from 'model/dto/attachment/attachment.dto';
import { AttachmentUploadRo } from 'model/ro/attachment/attachment.upload.ro';
import { AssetUploadQueryRo } from 'model/ro/fusion/asset.query';
import { DatasheetCreateRo } from 'model/ro/fusion/datasheet.create.ro';
import { FieldCreateRo } from 'model/ro/fusion/field.create.ro';
import { FieldDeleteRo } from 'model/ro/fusion/field.delete.ro';
import { FieldQueryRo } from 'model/ro/fusion/field.query.ro';
import { NodeDetailParamRo, NodeListParamRo, OldNodeDetailParamRo } from 'model/ro/fusion/node.param.ro';
import { RecordCreateRo } from 'model/ro/fusion/record.create.ro';
import { RecordDeleteRo } from 'model/ro/fusion/record.delete.ro';
import { RecordParamRo } from 'model/ro/fusion/record.param.ro';
import { RecordQueryRo } from 'model/ro/fusion/record.query.ro';
import { RecordUpdateRo } from 'model/ro/fusion/record.update.ro';
import { RecordViewQueryRo } from 'model/ro/fusion/record.view.query.ro';
import { SpaceParamRo } from 'model/ro/fusion/space.param.ro';
import { AssetView, AttachmentVo } from 'model/vo/fusion/attachment.vo';
import { DatasheetCreateDto, DatasheetCreateVo, FieldCreateVo } from 'model/vo/fusion/datasheet.create.vo';
import { FieldDeleteVo } from 'model/vo/fusion/field.delete.vo';
import { FieldListVo } from 'model/vo/fusion/field.list.vo';
import { RecordDeleteVo } from 'model/vo/fusion/record.delete.vo';
import { RecordListVo } from 'model/vo/fusion/record.list.vo';
import { RecordPageVo } from 'model/vo/fusion/record.page.vo';
import { ViewListVo } from 'model/vo/fusion/view.list.vo';
import { InternalCreateDatasheetVo } from 'models';
import { RestService } from 'modules/rest/rest.service';
import { AttachmentService } from 'modules/services/attachment/attachment.service';
import { FusionApiService } from 'fusion/impl/fusion.api.service';
import { I18nService } from 'nestjs-i18n';
import { promisify } from 'util';

/**
 * <p>
 *  todo 2. 返回信息缓存 3. 成员change发送消息, 理想状态下，数据应该放在一个服务里面维护，这样方便利用缓存
 * fusionApi数表相关接口的控制器
 * </p>
 * @author Zoe zheng
 * @date 2020/8/15 6:58 下午
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
  ) {
  }

  @Get('/datasheets/:datasheetId/records')
  @ApiOperation({
    summary: '查询表格记录',
    description: '获取某个维格表的N条记录',
    deprecated: false,
    })
  @ApiProduces('application/json')
  @UseGuards(ApiDatasheetGuard)
  @UseInterceptors(ApiCacheInterceptor)
  @CacheTTL(apiCacheTTLFactory)
  public async findAll(@Param() param: RecordParamRo, @Query(QueryPipe) query: RecordQueryRo, @Req() request): Promise<RecordPageVo> {
    const pageVo = await this.fusionApiService.getRecords(param.datasheetId, query, { token: request.headers.authorization });
    if (pageVo) {
      return ApiResponse.success(pageVo);
    }
    return ApiResponse.success({
      pageSize: 0,
      records: [],
      pageNum: 1,
      total: 0,
    });
  }

  @Post('/datasheets/:datasheetId/records')
  @ApiOperation({
    summary: '给指定的维格表插入多条记录',
    description:
    '单次请求可最多创建10条记录。在Request Header中需带上`Content-Type：application/json`，以raw json的格式提交数据。\n' +
    'POST数据是一个JSON对象，其中需包含一个数组：`records`，records数组包含多条将要创建的记录。\n' +
    '对象`fields`包含一条记录中要新建的字段值，可以包含任意数量的字段值，不一定要包含全部字段。如果有设置字段默认值，没有传入的字段值将根据设置字段时的默认值进行保存',
    deprecated: false,
    })
  @ApiBody({ description: '添加记录参数', type: RecordCreateRo })
  @ApiProduces('application/json')
  @ApiConsumes('application/json')
  @UseGuards(ApiDatasheetGuard)
  @UseInterceptors(ApiNotifyInterceptor)
  async addRecords(@Param() param: RecordParamRo, @Query() query: RecordViewQueryRo, @Body(FieldPipe) body: RecordCreateRo): Promise<RecordListVo> {
    await this.fusionApiService.checkDstRecordCount(param.datasheetId, body);
    const client = this.redisService.getClient();
    const lock = promisify<string | string[], number, () => void>(RedisLock(client as any));
    // 对资源加锁，同一个资源的api 只能依次进行消费。解决并发写入link字段，关联表数据不完整的问题，120秒超时
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
    summary: '获取维格附件的预签名URL',
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
      const error = ApiException.tipError('api_space_capacity_over_limit');
      return Promise.reject(error);
    }
    const results = await this.restService.getUploadPresignedUrl({ token: req.headers.authorization }, datasheet.nodeId, query.count);
    return ApiResponse.success({ results });
  }

  @Post('/datasheets/:datasheetId/attachments')
  @ApiOperation({
    summary: '上传维格附件',
    description:
    '在Request Header中需带上`Content-Type：multipart/form-data`，以form的形式提交数据。\n' +
    'POST数据是一个`formData`对象。\n' +
    '上传附件接口，每次仅允许接收一个附件。如果需要上传多份文件，需要重复调用此接口。',
    deprecated: true,
    })
  @ApiBody({
    description: '附件',
    type: AttachmentUploadRo,
    })
  @ApiInternalServerErrorResponse()
  @ApiConsumes('multipart/form-data')
  @ApiProduces('application/json')
  @NodePermissions(NodePermissionEnum.EDITABLE)
  @UseGuards(ApiDatasheetGuard)
  // todo 等待nestjs官方继承multi和fastify
  public async addAttachment(@Param() param: RecordParamRo, @Req() req, @Res() reply): Promise<AttachmentVo> {
    // check space capacity
    const datasheet = req[DATASHEET_HTTP_DECORATE];
    const spaceCapacityOverLimit = await this.restService.capacityOverLimit({ token: req.headers.authorization }, datasheet.spaceId);
    if (spaceCapacityOverLimit) {
      const error = ApiException.tipError('api_space_capacity_over_limit');
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
          localError = ApiException.tipError('api_upload_attachment_error');
        }
      }
      if (newFiles.length > 1) {
        localError = ApiException.tipError('api_upload_attachment_exceed_limit');
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
    summary: '更新记录',
    description: '更新某个维格表的若干条记录。使用PATCH方法提交，只有被指定的字段才会更新数据，没有被指定的字段会保留旧值。',
    deprecated: false,
    })
  @ApiBody({
    description: '修改记录参数',
    type: RecordUpdateRo,
    })
  @ApiProduces('application/json')
  @ApiConsumes('application/json')
  @UseGuards(ApiDatasheetGuard)
  @UseInterceptors(ApiNotifyInterceptor)
  public async updateRecord(
    @Param() param: RecordParamRo,
    @Query() query: RecordViewQueryRo,
    @Body(FieldPipe) body: RecordUpdateRo
  ): Promise<RecordListVo> {
    const listVo = await this.fusionApiService.updateRecords(param.datasheetId, body, query.viewId);
    return ApiResponse.success(listVo);
  }

  @Put('/datasheets/:datasheetId/records')
  @ApiOperation({
    summary: '更新记录',
    description: '更新某个维格表的若干条记录。使用PUT方法提交，只有被指定的字段才会更新数据，没有被指定的字段会保留旧值。',
    deprecated: false,
    })
  @ApiBody({
    description: '修改记录参数',
    type: RecordUpdateRo,
    })
  @ApiProduces('application/json')
  @ApiConsumes('application/json')
  @UseGuards(ApiDatasheetGuard)
  @UseInterceptors(ApiNotifyInterceptor)
  public async updateRecordOfPut(
    @Param() param: RecordParamRo,
    @Query() query: RecordViewQueryRo,
    @Body(FieldPipe) body: RecordUpdateRo
  ): Promise<RecordListVo> {
    const listVo = await this.fusionApiService.updateRecords(param.datasheetId, body, query.viewId);
    return ApiResponse.success(listVo);
  }

  @Delete('/datasheets/:datasheetId/records')
  @ApiOperation({
    summary: '删除记录',
    description: '删除某个维格表的若干条记录',
    deprecated: false,
    })
  @ApiProduces('application/json')
  @UseGuards(ApiDatasheetGuard)
  public async deleteRecord(@Param() param: RecordParamRo, @Query() query: RecordDeleteRo): Promise<RecordDeleteVo> {
    const result = await this.fusionApiService.deleteRecord(param.datasheetId, query.recordIds);
    if (result) {
      return ApiResponse.success(undefined);
    }
    throw ApiException.tipError('api_delete_error');
  }

  @Get('/datasheets/:datasheetId/fields')
  @ApiOperation({
    summary: '查询表格的所有字段',
    description: '表格的所有字段，不分页',
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
    throw ApiException.tipError('api_server_error');
  }

  @Get('/datasheets/:datasheetId/views')
  @ApiOperation({
    summary: '查询表格的所有视图',
    description: '一张维格表可以建立最多 30 张视图。请求视图时一次性返回，不分页。',
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
    throw ApiException.tipError('api_server_error');
  }

  @Get('/spaces')
  @ApiOperation({
    summary: '查询空间列表',
    description: '返回当前用户的空间列表。一次性返回，不分页。',
    deprecated: false,
    })
  @ApiProduces('application/json')
  // 这个接口暂时不统计 API 使用量
  public async spaceList() {
    const spaceList = await this.fusionApiService.getSpaceList();
    return ApiResponse.success({
      spaces: spaceList,
    });
  }

  @Post('/spaces/:spaceId/datasheets/:datasheetId/fields')
  @ApiOperation({
    summary: '新增字段',
    description: '新增字段',
    deprecated: false,
    })
  @ApiBody({
    description: '新增字段',
    type: FieldCreateRo,
    })
  @ApiProduces('application/json')
  @ApiConsumes('application/json')
  @UseGuards(ApiFieldGuard)
  public async createField(@Param('spaceId') spaceId: string
    , @Param('datasheetId') datasheetId: string
    , @Body(CreateFieldPipe) createRo: FieldCreateRo): Promise<FieldCreateVo> {
    const metaFields: any = await this.fusionApiService.getFieldList(datasheetId, { viewId: '' });
    const duplicatedName = metaFields.filter(field => field.name === createRo.name);
    if (duplicatedName.length > 0) {
      throw ApiException.tipError(ApiTipIdEnum.apiParamsMustUnique, { property: 'name' });
    }
    const fieldCreateDto = await this.fusionApiService.addField(datasheetId, createRo);
    return ApiResponse.success(fieldCreateDto);
  }

  @Delete('/spaces/:spaceId/datasheets/:datasheetId/fields/:fieldId')
  @ApiOperation({
    summary: '删除字段',
    description: '删除字段',
    deprecated: false,
    })
  @ApiBody({
    description: '删除字段',
    type: FieldCreateRo,
    })
  @ApiProduces('application/json')
  @ApiConsumes('application/json')
  @UseGuards(ApiFieldGuard)
  public async deleteField(@Param('spaceId') spaceId: string
    , @Param('datasheetId') datasheetId: string
    , @Param('fieldId') fieldId: string
    , @Body() fieldDeleteRo: FieldDeleteRo): Promise<FieldDeleteVo> {
    const metaFields: any = await this.fusionApiService.getFieldList(datasheetId, { viewId: '' });
    const existFieldId = metaFields.filter(field => field.id === fieldId);
    if (existFieldId.length === 0) {
      throw ApiException.tipError(ApiTipIdEnum.apiParamsNotExists, { property: 'fieldId', value: fieldId });
    }
    if (metaFields[0].id === fieldId) {
      throw ApiException.tipError(ApiTipIdEnum.apiParamsPrimaryFieldNotAllowedToDelete, { property: 'name' });
    }
    await this.fusionApiService.deleteField(datasheetId, fieldId, fieldDeleteRo.conversion);
    return ApiResponse.success({});
  }

  @Post('/spaces/:spaceId/datasheets')
  @ApiOperation({
    summary: '创建表格',
    description: '创建表格及其字段',
    deprecated: false,
    })
  @ApiBody({
    description: '创建表格',
    type: DatasheetCreateRo,
    })
  @ApiProduces('application/json')
  @ApiConsumes('application/json')
  @UseGuards(ApiSpaceGuard)
  public async createDatasheet(@Param() param: SpaceParamRo
    , @Body(CreateDatasheetPipe) createRo: DatasheetCreateRo, @Req() request): Promise<DatasheetCreateVo> {
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
    summary: '查询空间站一级文件节点列表',
    description: '返回指定空间站一级文件节点列表。一次性返回，不分页。',
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

  // 无 spacesId 也可以直接查询 node 详情，先兼容保留。没有路由请求后删除这里。
  @Get('/spaces/:spaceId/nodes/:nodeId')
  @ApiOperation({
    summary: '查询节点详情',
    description: '查询指定文件节点详情',
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
    summary: '查询节点详情',
    description: '查询指定文件节点详情',
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
   * 隐藏接口
   */
  @Post('datasheets/:datasheetId/executeCommand')
  @ApiOperation({
    summary: '创建资源的 op',
    description: '为了灵活性考虑，也为了内部的自动化测试，提供一个自由创建 command 的接口',
    deprecated: false,
    })
  @ApiProduces('application/json')
  public async executeCommand(
    @Body() body: ICollaCommandOptions,
    @Param('datasheetId') datasheetId: string,
    @Req() request,
  ) {
    const commandBody = body;
    const token = request.headers.authorization;
    return await this.fusionApiService.executeCommand(datasheetId, commandBody, { token });
  }
}

