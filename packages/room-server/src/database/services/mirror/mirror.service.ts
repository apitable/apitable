import { Injectable } from '@nestjs/common';
import { IPermissions } from '@apitable/core';
import { InjectLogger } from '../../../shared/common';
import { DatasheetException } from '../../../shared/exception';
import { IFetchDataOriginOptions, IAuthHeader } from '../../../shared/interfaces';
import { omit } from 'lodash';
import { DatasheetPack, MirrorInfo, UnitInfo, UserInfo } from '../../interfaces';
import { Logger } from 'winston';
import { DatasheetMetaService } from '../datasheet/datasheet.meta.service';
import { DatasheetRecordService } from '../datasheet/datasheet.record.service';
import { DatasheetService } from '../datasheet/datasheet.service';
import { NodeService } from '../node/node.service';
import { ResourceMetaRepository } from '../../repositories/resource.meta.repository';

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
    const { node } = await this.nodeService.getNodeDetailInfo(mirrorId, auth, origin);
    this.rewriteMirrorPermission(node.permissions);
    // Query info of referenced database and view
    const nodeRelInfo = await this.nodeService.getNodeRelInfo(mirrorId);
    // Check if referenced datasheet exists
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
    this.logger.info(`mirror[${mirrorId}] Start loading data`);
    // Query info of referenced database and view
    const datasheetId = await this.nodeService.getMainNodeId(mirrorId);
    // Query node info
    const { node, fieldPermissionMap } = await this.nodeService.getNodeDetailInfo(datasheetId, auth, origin);
    // Query meta of referenced datasheet
    const meta = await this.datasheetMetaService.getMetaDataByDstId(datasheetId, DatasheetException.DATASHEET_NOT_EXIST);
    const recordMap =
      origin && origin.recordIds
        ? await this.datasheetRecordService.getRecordsByDstIdAndRecordIds(datasheetId, origin.recordIds)
        : await this.datasheetRecordService.getRecordsByDstId(datasheetId);
    // Query foreignDatasheetMap and unitMap
    const combine = await this.datasheetService.processField(datasheetId, auth, meta, recordMap, origin);
    const endTime = +new Date();
    this.logger.info(`mirror[${mirrorId}] Finished loading data, duration: ${endTime - beginTime}ms`);
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
    // View operation limits
    permissions.viewCreatable = false;
    permissions.viewRemovable = false;
    permissions.viewMovable = false;
    permissions.viewRenamable = false;

    // View configuration limits
    permissions.columnHideable = false;
    permissions.viewFilterable = false;
    permissions.fieldGroupable = false;
    permissions.columnSortable = false;
    permissions.rowHighEditable = false;
    permissions.viewLayoutEditable = false;
    permissions.viewStyleEditable = false;
    permissions.viewKeyFieldEditable = false;
    permissions.viewColorOptionEditable = false;

    // Field operation limits
    permissions.fieldCreatable = false;
    permissions.fieldRenamable = false;
    permissions.fieldPropertyEditable = false;
    permissions.fieldRemovable = false;

    // Field order, width and statistics bar limits
    permissions.fieldSortable = false;
    permissions.columnWidthEditable = false;
    permissions.columnCountEditable = true;

    // Node description limits
    permissions.descriptionEditable = false;

    // Field permission settings limits
    permissions.fieldPermissionManageable = false;
  }
}
