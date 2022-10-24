import { Injectable } from '@nestjs/common';
import { IPermissions } from '@apitable/core';
import { InjectLogger } from 'common';
import { DatasheetException } from 'exception';
import { IFetchDataOriginOptions, IAuthHeader } from 'interfaces';
import { omit } from 'lodash';
import { DatasheetPack, MirrorInfo, UnitInfo, UserInfo } from 'models';
import { Logger } from 'winston';
import { DatasheetMetaService } from '../datasheet/datasheet.meta.service';
import { DatasheetRecordService } from '../datasheet/datasheet.record.service';
import { DatasheetService } from '../datasheet/datasheet.service';
import { NodeService } from '../node/node.service';
import { ResourceMetaRepository } from 'modules/repository/resource.meta.repository';

@Injectable()
export class MirrorService {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly nodeService: NodeService,
    private readonly datasheetService: DatasheetService,
    private readonly datasheetMetaService: DatasheetMetaService,
    private readonly datasheetRecordService: DatasheetRecordService,
    private readonly resourceMetaRepository: ResourceMetaRepository,
  ) {}

  async getMirrorInfo(mirrorId: string, auth: IAuthHeader, origin: IFetchDataOriginOptions): Promise<MirrorInfo> {
    // 查询节点信息
    const { node } = await this.nodeService.getNodeDetailInfo(mirrorId, auth, origin);
    // 改写 mirror 权限集
    this.rewriteMirrorPermission(node.permissions);
    // 查询映射的数表和视图相关信息
    const nodeRelInfo = await this.nodeService.getNodeRelInfo(mirrorId);
    // 判断映射的数表是否存在
    await this.nodeService.checkNodeIfExist(nodeRelInfo.datasheetId, DatasheetException.DATASHEET_NOT_EXIST);
    const meta = await this.resourceMetaRepository.selectMetaByResourceId(mirrorId);
    return {
      mirror: omit(node, ['extra']),
      sourceInfo: nodeRelInfo,
      snapshot: meta
    };
  }

  async fetchDataPack(mirrorId: string, auth: IAuthHeader, origin: IFetchDataOriginOptions): Promise<DatasheetPack> {
    const beginTime = +new Date();
    this.logger.info(`mirror[${mirrorId}]数据开始加载`);
    // 查询映射的数表和视图相关信息
    const datasheetId = await this.nodeService.getMainNodeId(mirrorId);
    // 查询节点信息
    const { node, fieldPermissionMap } = await this.nodeService.getNodeDetailInfo(datasheetId, auth, origin);
    // 查询映射数表的 meta
    const meta = await this.datasheetMetaService.getMetaDataByDstId(datasheetId, DatasheetException.DATASHEET_NOT_EXIST);
    const recordMap =
      origin && origin.recordIds
        ? await this.datasheetRecordService.getRecordsByDstIdAndRecordIds(datasheetId, origin.recordIds)
        : await this.datasheetRecordService.getRecordsByDstId(datasheetId);
    // 查询foreignDatasheetMap和unitMap
    const combine = await this.datasheetService.processField(datasheetId, auth, meta, recordMap, origin);
    const endTime = +new Date();
    this.logger.info(`mirror[${mirrorId}]数据完成加载，总耗时: ${endTime - beginTime}ms`);
    return {
      datasheet: node,
      snapshot: { meta, recordMap, datasheetId },
      fieldPermissionMap,
      foreignDatasheetMap: combine.foreignDatasheetMap,
      units: combine.units as ((UserInfo | UnitInfo)[]),
    };
  }

  public rewriteMirrorPermission(permissions: IPermissions) {
    if (permissions.editable === false) {
      return;
    }
    // 视图操作限制
    permissions.viewCreatable = false;
    permissions.viewRemovable = false;
    permissions.viewMovable = false;
    permissions.viewRenamable = false;

    // 视图配置限制
    permissions.columnHideable = false;
    permissions.viewFilterable = false;
    permissions.fieldGroupable = false;
    permissions.columnSortable = false;
    permissions.rowHighEditable = false;
    permissions.viewLayoutEditable = false;
    permissions.viewStyleEditable = false;
    permissions.viewKeyFieldEditable = false;
    permissions.viewColorOptionEditable = false;

    // 字段操作限制
    permissions.fieldCreatable = false;
    permissions.fieldRenamable = false;
    permissions.fieldPropertyEditable = false;
    permissions.fieldRemovable = false;

    // 字段顺序、宽度和统计栏限制
    permissions.fieldSortable = false;
    permissions.columnWidthEditable = false;
    permissions.columnCountEditable = true;

    // 节点描述限制
    permissions.descriptionEditable = false;

    // 列权限设置限制
    permissions.fieldPermissionManageable = false;
  }
}
