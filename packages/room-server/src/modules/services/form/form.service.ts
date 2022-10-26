import { Injectable } from '@nestjs/common';
import {
  ConfigConstant, EventAtomTypeEnums, EventRealTypeEnums, EventSourceTypeEnums, ExecuteResult, FieldType, ICollaCommandOptions, IFormProps,
  ILocalChangeset, IMeta, IServerDatasheetPack, OPEventNameEnums, ResourceType, Selectors, StoreActions, transformOpFields
} from '@apitable/core';
import { InjectLogger } from 'common';
import { SourceTypeEnum } from 'enums/changeset.source.type.enum';
import { ApiException } from 'exception/api.exception';
import { DatasheetException } from 'exception/datasheet.exception';
import { ServerException } from 'exception/server.exception';
import { getRecordUrl } from 'helpers/env';
import { RedisLock } from 'helpers/redis.lock';
import { IAuthHeader, IFetchDataOptions } from 'interfaces';
import { omit } from 'lodash';
import { FormDataPack } from 'models';
import { OtService } from 'modules/ot/ot.service';
import { ResourceMetaRepository } from 'modules/repository/resource.meta.repository';
import { CommandService } from 'modules/services/command/impl/command.service';
import { RedisService } from '@vikadata/nestjs-redis';
import { promisify } from 'util';
import { Logger } from 'winston';
import { DatasheetChangesetSourceService } from '../datasheet/datasheet.changeset.source.service';
import { DatasheetMetaService } from '../datasheet/datasheet.meta.service';
import { DatasheetRecordSourceService } from '../datasheet/datasheet.record.source.service';
import { DatasheetService } from '../datasheet/datasheet.service';
import { EventService } from '../event/event.service';
import { FusionApiTransformer } from '../../../fusion/transformer/fusion.api.transformer';
import { NodeService } from '../node/node.service';

@Injectable()
export class FormService {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly nodeService: NodeService,
    private readonly datasheetService: DatasheetService,
    private readonly datasheetMetaService: DatasheetMetaService,
    private readonly datasheetRecordSourceService: DatasheetRecordSourceService,
    private readonly commandService: CommandService,
    private readonly otService: OtService,
    private readonly transform: FusionApiTransformer,
    private resourceMetaRepository: ResourceMetaRepository,
    private readonly datasheetChangesetSourceService: DatasheetChangesetSourceService,
    private readonly redisService: RedisService,
    private readonly eventService: EventService,
  ) { }

  async fetchDataPack(formId: string, auth: IAuthHeader, templateId?: string): Promise<FormDataPack> {
    const beginTime = +new Date();
    this.logger.info(`表单数据开始加载[${formId}]`);
    // 查询节点信息
    const { node, fieldPermissionMap } = await this.nodeService.getNodeDetailInfo(
      formId,
      auth,
      { internal: !templateId, main: true, notDst: true }
    );
    // 查询收集表元数据
    const formProps = await this.fetchFormProps(formId);
    // 查询映射的数表和视图相关信息
    const nodeRelInfo = await this.nodeService.getNodeRelInfo(formId);
    const dstId = nodeRelInfo.datasheetId;
    // 查询映射数表的 meta
    const meta = await this.datasheetMetaService.getMetaDataByDstId(dstId, DatasheetException.DATASHEET_NOT_EXIST);
    // 站内返回源表权限集
    if (!templateId) {
      const permissions = await this.nodeService.getPermissions(dstId, auth, { internal: true, main: false });
      nodeRelInfo.datasheetPermissions = permissions;
    }
    const endTime = +new Date();
    this.logger.info(`表单数据完成加载,总耗时: ${endTime - beginTime}ms`);
    return {
      sourceInfo: nodeRelInfo,
      snapshot: {
        meta,
        formProps: formProps,
      },
      form: omit(node, ['extra']),
      fieldPermissionMap,
    };
  }

  async fetchShareDataPack(formId: string, shareId: string, userId: string, auth: IAuthHeader): Promise<FormDataPack> {
    const beginTime = +new Date();
    this.logger.info(`分享表单数据开始加载[${formId}]`);
    // 查询节点信息
    const origin = { internal: false, main: true, shareId, notDst: true };
    const { node, fieldPermissionMap } = await this.nodeService.getNodeDetailInfo(formId, auth, origin);
    // 查询神奇表单元数据
    const formProps = await this.fetchFormProps(formId);
    // 查询映射的数表和视图相关信息
    const nodeRelInfo = await this.nodeService.getNodeRelInfo(formId);
    const dstId = nodeRelInfo.datasheetId;
    // 查询映射数表的 meta
    const meta = await this.datasheetMetaService.getMetaDataByDstId(dstId, DatasheetException.DATASHEET_NOT_EXIST);
    let hasSubmitted = false;
    // 在分享状态下，但凡登陆了都会查询是否提交过
    if (shareId && userId) {
      // 查询用户是否使用当前神奇表单提交过记录
      hasSubmitted = await this.fetchSubmitStatus(userId, formId, dstId);
    }
    const endTime = +new Date();
    this.logger.info(`分享表单数据完成加载,总耗时: ${endTime - beginTime}ms`);
    return {
      sourceInfo: nodeRelInfo,
      snapshot: {
        meta,
        formProps: {
          ...formProps,
          hasSubmitted,
        },
      },
      form: omit(node, ['extra']),
      fieldPermissionMap,
    };
  }

  async addRecord({ formId, shareId = '', userId, recordData }, auth: IAuthHeader): Promise<any> {
    const dstId = await this.nodeService.getMainNodeId(formId);
    const revision: any = await this.nodeService.getRevisionByDstId(dstId);
    // 版本找不到的错误
    if (revision == null) {
      throw new ServerException(DatasheetException.VERSION_ERROR);
    }
    const client = this.redisService.getClient();
    const lock = promisify<string | string[], number, () => void>(RedisLock(client as any));
    // 对资源加锁，同一个维格表的收集表提交只能依次进行消费。解决并发基础版本容易落差过大问题
    const unlock = await lock('form.add.' + dstId, 120 * 1000);
    try {
      return await this.addRecordAction(dstId, { formId, shareId, userId, recordData }, auth);
    } finally {
      await unlock();
    }
  }

  private async dispatchFormSubmittedEvent(props: {
    formId: string,
    recordId: string,
    dstId: string,
    interStore: any
  }): Promise<any> {
    // FIXME:换地方 dispatchEvent，不阻塞。try 一下保证不影响正常运行
    const { formId, recordId, dstId, interStore } = props;
    try {
      const nodeRelInfo = await this.nodeService.getNodeRelInfo(formId);
      const thisRecord = Selectors.getRecord(interStore.getState(), recordId, dstId);
      const { eventFields } = transformOpFields({
        recordData: thisRecord.data,
        state: interStore.getState(),
        datasheetId: dstId,
        recordId
      });
      const eventContext = {
        // TODO: 旧结构，给千帆留的,后续删除
        datasheet: {
          id: dstId,
          name: nodeRelInfo.datasheetName
        },
        record: {
          id: recordId,
          url: getRecordUrl(dstId, recordId),
          fields: eventFields
        },
        formId: formId,
        // 下面是拍平的新结构
        datasheetId: dstId,
        datasheetName: nodeRelInfo.datasheetName,
        recordId,
        recordUrl: getRecordUrl(dstId, recordId),
        ...eventFields
      };
      this.logger.debug(
        'eventContext',
        eventContext,
        eventFields
      );
      this.eventService.opEventManager.dispatchEvent({
        eventName: OPEventNameEnums.FormSubmitted,
        scope: ResourceType.Form,
        realType: EventRealTypeEnums.REAL,
        atomType: EventAtomTypeEnums.ATOM,
        sourceType: EventSourceTypeEnums.ALL,
        context: eventContext
      }, false);
    } catch (error) {
      this.logger.debug(error);
    }
  }

  private async addRecordAction(dstId: string, { formId, shareId = '', userId, recordData }, auth: IAuthHeader): Promise<any> {
    const meta = await this.datasheetMetaService.getMetaDataByDstId(dstId, DatasheetException.DATASHEET_NOT_EXIST);
    const fetchDataOptions = this.getLinkedRecordMap(dstId, meta, recordData);
    const options: ICollaCommandOptions = this.transform.getAddRecordCommandOptions(dstId, [{ fields: recordData }], meta);
    const nodeRelInfo = await this.nodeService.getNodeRelInfo(formId);
    if (nodeRelInfo.viewId && options['viewId']) {
      options['viewId'] = nodeRelInfo.viewId;
    }
    const datasheetPack: IServerDatasheetPack =
      await this.datasheetService.fetchSubmitFormForeignDatasheetPack(dstId, auth, fetchDataOptions, shareId);
    // 神奇表单提交，若有列权限的相关处理
    if (datasheetPack.fieldPermissionMap) {
      for (const fieldPermissionInfo of Object.values(datasheetPack.fieldPermissionMap)) {
        // 开启列权限字段不允许通过神奇表单写入时，将编辑权限覆盖
        if (!fieldPermissionInfo.setting?.formSheetAccessible) {
          fieldPermissionInfo.permission.editable = false;
          fieldPermissionInfo.role = ConfigConstant.Role.None;
        }
      }
    }
    const interStore = this.commandService.fullFillStore(datasheetPack.datasheet.spaceId, datasheetPack);
    const { result, changeSets } = this.commandService.execute<string[]>(options, interStore);
    if (!result || result.result !== ExecuteResult.Success) throw ApiException.tipError('api_insert_error');
    // 客户端的提交已经在 apply 到 store 了。等 room 确认。
    const roomChangeSets = await this.applyChangeSet(formId, dstId, changeSets, shareId, auth);
    // console.log('changeSets', JSON.stringify(changeSets), JSON.stringify(roomChangeSets));
    // 将 room 的 changeset apply 会 store，然后拿到的 interStore 是最新的稀疏 store。参与计算时，计算字段才能获取到正确的值
    roomChangeSets.forEach(cs => {
      const systemOperations = cs.operations.filter(ops => ops.cmd.startsWith('System'));
      if (systemOperations.length > 0) {
        interStore.dispatch(StoreActions.applyJOTOperations(systemOperations, cs.resourceType, cs.resourceId));
      }
    });
    // 表单提交需要记录来源，用于追踪记录来源
    const recordId = result.data && result.data[0];
    await this.datasheetRecordSourceService.createRecordSource(userId, dstId, formId, [recordId!], SourceTypeEnum.FORM);
    await this.dispatchFormSubmittedEvent({ formId, recordId, dstId, interStore });
    return { recordId };
  }

  /**
   * 根据 meta 和 recordData 得到稀疏关联记录数据
   */
  private getLinkedRecordMap(dstId: string, meta: IMeta, recordData: any): IFetchDataOptions {
    const recordIds: string[] = [];
    const linkedRecordMap = {};
    // 映射表关联表 ID 集合
    const foreignDatasheetIdMap = Object.values(meta.fieldMap)
      .filter(field => {
        return field.type === FieldType.Link;
      })
      .map(field => {
        const foreignDatasheetId = field.property?.foreignDatasheetId;
        if (!foreignDatasheetId) return null;
        return {
          fieldId: field.id,
          foreignDatasheetId,
        };
      })
      .filter(v => v);

    foreignDatasheetIdMap.forEach(item => {
      const { foreignDatasheetId, fieldId } = item!;
      if (recordData[fieldId]) {
        // 收集自关联 recordId
        if (foreignDatasheetId === dstId) {
          recordIds.push(...recordData[fieldId]);
          return;
        }
        linkedRecordMap[foreignDatasheetId] =
          Array.isArray(linkedRecordMap[foreignDatasheetId])
            ? [...linkedRecordMap[foreignDatasheetId], ...recordData[fieldId]]
            : recordData[fieldId];
      }
    });
    // 对数组数据做一下去重
    for (const key in linkedRecordMap) {
      linkedRecordMap[key] = [...new Set(linkedRecordMap[key])];
    }
    return { recordIds, linkedRecordMap };
  }

  async applyChangeSet(formId: string, dstId: string, changesets: ILocalChangeset[], shareId: string, auth: IAuthHeader) {
    const changeResult = await this.otService.applyRoomChangeset({ roomId: formId, sourceType: SourceTypeEnum.FORM, shareId, changesets }, auth);
    // 保存changeset来源
    await this.datasheetChangesetSourceService.batchCreateChangesetSource(changeResult, SourceTypeEnum.FORM, formId);
    this.logger.info('Form:ApplyChangeSet Success!');
    // 通知Socket服务广播
    await this.otService.nestRoomChange(dstId, changeResult);
    this.logger.info('Form:NotifyChangeSet Success!');
    return changeResult;
  }

  async fetchSubmitStatus(userId: string, formId: string, dstId?: string) {
    if (!dstId) {
      // 查询映射的数表
      const datasheetId = await this.nodeService.getMainNodeId(formId);
      // 查询用户是否用神奇表单提交过提交
      const recordSource = await this.datasheetRecordSourceService.fetchRecordSourceStatus(userId, datasheetId, formId, 0);
      return Boolean(recordSource);
    }
    // 查询用户是否用神奇表单提交过提交
    const recordSource = await this.datasheetRecordSourceService.fetchRecordSourceStatus(userId, dstId, formId, 0);
    return Boolean(recordSource);
  }

  async updateFormProps(userId: string, resourceId: string, formProps: IFormProps) {
    await this.resourceMetaRepository.updateMetaDataByResourceId(resourceId, userId, formProps);
  }

  // 查询神奇表单元数据
  async fetchFormProps(formId: string) {
    return await this.resourceMetaRepository.selectMetaByResourceId(formId);
  }
}
