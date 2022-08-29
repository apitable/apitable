import { ResourceIdPrefix, ResourceType } from '@vikadata/core';
import { Injectable } from '@nestjs/common';
import { InjectLogger } from 'common';
import { DatasheetWidgetRepository } from 'modules/repository/datasheet.widget.repository';
import { Logger } from 'winston';
import { RoomResourceRelService } from 'modules/socket/room.resource.rel.service';
import { EffectConstantName } from './ot.interface';
import { difference } from 'lodash';
import { DatasheetFieldHandler } from 'modules/services/datasheet/datasheet.field.handler';
import { NodeService } from 'modules/services/node/node.service';

/**
 * <p>
 * 资源变更处理器
 * </p>
 * @author Chambers
 * @date 2021/2/2
 */
@Injectable()
export class ResourceChangeHandler {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly roomResourceRelService: RoomResourceRelService,
    private readonly nodeService: NodeService,
    private readonly datasheetWidgetRepository: DatasheetWidgetRepository,
    private readonly datasheetFieldHandler: DatasheetFieldHandler,
  ) { }

  async handleResourceChange(roomId: string, values: any[]) {
    this.logger.info(`HandleResourceChange. roomId: ${roomId} values: ${values}`);
    const isDsbRoom = roomId.startsWith(ResourceIdPrefix.Dashboard);
    for (const { effectMap, commonData, resultSet } of values) {
      const { dstId, resourceId, resourceType } = commonData;
      switch (resourceType) {
        case ResourceType.Datasheet:
          await this.parseDatasheetResultSet(dstId, effectMap, resultSet);
          break;
        case ResourceType.Dashboard:
          await this.parseDashboardResultSet(resourceId, resultSet);
          break;
        case ResourceType.Form:
          break;
        case ResourceType.Widget:
          // 在仪表盘设置空白组件的引用数表时，数表资源需加入 ROOM
          if (isDsbRoom && resultSet.updateWidgetDepDatasheetId) {
            await this.roomResourceRelService.createOrUpdateRel(dstId, [resultSet.updateWidgetDepDatasheetId]);
          }
          break;
        default:
          break;
      }
    }
  }

  private async parseDatasheetResultSet(dstId: string, effectMap: Map<string, any>, resultSet: { [key: string]: any }) {
    const addResourceIds: any[] = [];
    let delResourceIds: any[] = [];
    // 新增组件
    if (resultSet.addWidgetIds.length) {
      addResourceIds.push(...resultSet.addWidgetIds);
    }
    // 删除组件
    if (resultSet.deleteWidgetIds.length) {
      delResourceIds.push(...resultSet.deleteWidgetIds);
    }
    // 公式字段引用更新
    if (resultSet.toChangeFormulaExpressions.length > 0) {
      await this.datasheetFieldHandler.computeFormulaReference(dstId, resultSet.toChangeFormulaExpressions);
    }
    // 新增关联列
    if (resultSet.toCreateForeignDatasheetIdMap.size) {
      const meta = effectMap.get(EffectConstantName.Meta);
      const dstIds = await this.datasheetFieldHandler.computeLinkFieldReference(dstId, meta, resultSet.toCreateForeignDatasheetIdMap);
      if (dstIds?.length) { 
        addResourceIds.push(...dstIds);
      }
    }
    // 删除关联列
    if (resultSet.toDeleteForeignDatasheetIdMap.size) {
      const meta = effectMap.get(EffectConstantName.Meta);
      const dstIds = await this.datasheetFieldHandler.deleteLinkFieldReference(dstId, meta, resultSet.toDeleteForeignDatasheetIdMap);
      if (dstIds?.length) { 
        delResourceIds.push(...dstIds);
      }
    }
    // 原 LookUp 属性变化仅影响一对一字段引用关系变化，可独立计算不分先后；
    // 引入过滤后，字段引用形成了一对多关系（类似公式）进行覆盖，为保证重叠的部分字段保持引用关系，删除 LookUp 解析需先进行
    // 删除 LookUp
    if (resultSet.toDeleteLookUpProperties.length > 0) {
      const meta = effectMap.get(EffectConstantName.Meta);
      const dstIds = await this.datasheetFieldHandler.removeLookUpReference(dstId, meta, resultSet.toDeleteLookUpProperties);
      if (dstIds?.length) { 
        delResourceIds.push(...dstIds);
      }
    }
    // 新增 LookUp
    if (resultSet.toCreateLookUpProperties.length > 0) {
      const meta = effectMap.get(EffectConstantName.Meta);
      const dstIds = await this.datasheetFieldHandler.computeLookUpReference(dstId, meta, resultSet.toCreateLookUpProperties);
      if (dstIds?.length) { 
        addResourceIds.push(...dstIds);
      }
    }

    // 获取该数表的关联节点资源（form、mirror...）
    const relNodeIds = await this.nodeService.getRelNodeIds(dstId);
    
    // 创建或更新 Room - Resource 双向关系
    if (addResourceIds.length) {
      await this.roomResourceRelService.createOrUpdateRel(dstId, addResourceIds);
      // 异步更新关联节点资源
      relNodeIds.forEach(nodeId => 
        this.roomResourceRelService.createOrUpdateRel(nodeId, addResourceIds)
      );
    }
    // 解除 Room - Resource 双向关系
    if (delResourceIds.length) {
      if (addResourceIds.length) {
        // 避免同时有新增、删除，将数表资源的映射关系解除了
        delResourceIds = difference<string>(delResourceIds, addResourceIds);
      }
      await this.roomResourceRelService.removeRel(dstId, delResourceIds);
      // 异步更新关联节点资源
      relNodeIds.forEach(nodeId => 
        this.roomResourceRelService.removeRel(nodeId, delResourceIds)
      );
    }
  }

  private async parseDashboardResultSet(dashboardId: string, resultSet: { [key: string]: any }) {
    const addResourceIds: string[] = [];
    let delResourceIds: string[] = [];
    // 新增组件
    if (resultSet.addWidgetIds.length) {
      addResourceIds.push(...resultSet.addWidgetIds);
      const dstIds = await this.datasheetWidgetRepository.selectDstIdsByWidgetIds(addResourceIds);
      if (dstIds?.length) {
        addResourceIds.push(...dstIds);
      }
    }
    // 删除组件
    if (resultSet.deleteWidgetIds.length) {
      delResourceIds.push(...resultSet.deleteWidgetIds);
      let dstIds = await this.datasheetWidgetRepository.selectDstIdsByWidgetIds(delResourceIds);
      if (dstIds?.length) {
        // 排除未删除组件的数据源
        const reservedDstIds = await this.datasheetWidgetRepository.selectDstIdsByNodeId(dashboardId);
        if (reservedDstIds?.length) {
          dstIds = difference<string>(dstIds, reservedDstIds);
        }
        delResourceIds.push(...dstIds);
      }
    }
    // 创建或更新 Room - Resource 双向关系
    if (addResourceIds.length) {
      await this.roomResourceRelService.createOrUpdateRel(dashboardId, addResourceIds);
    }
    // 解除 Room - Resource 双向关系
    if (delResourceIds.length) {
      if (addResourceIds.length) {
        // 避免同时有新增、删除的组件引用同一个数表，将数表资源的映射关系解除了
        delResourceIds = difference<string>(delResourceIds, addResourceIds);
      }
      await this.roomResourceRelService.removeRel(dashboardId, delResourceIds);
    }
  }
}
