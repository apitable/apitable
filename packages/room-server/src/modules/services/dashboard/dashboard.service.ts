import { Injectable } from '@nestjs/common';
import { NodeService } from 'modules/services/node/node.service';
import { DashboardDataPack, NodeDetailInfo, WidgetMap } from '../../../models';
import { ServerException } from '../../../exception';
import { IResourceMeta } from '@apitable/core';
import { ResourceException } from '../../../exception/resource.exception';
import { RestService } from '../../rest/rest.service';
import { ResourceMetaRepository } from 'modules/repository/resource.meta.repository';

/**
 * Dashboard 服务
 */
@Injectable()
export class DashboardService {

  constructor(
    private readonly nodeService: NodeService,
    private readonly restService: RestService,
    private readonly resourceMetaRepository: ResourceMetaRepository,
  ) { }

  async fetchDashboardPack(
    dashboardId: string,
    auth: { token: string; cookie: string },
  ): Promise<DashboardDataPack> {
    const baseNodeInfo = await this.nodeService.getNodeDetailInfo(
      dashboardId,
      auth,
      { internal: true, notDst: true, main: true },
    );
    return await this.fetchPack(dashboardId, auth, baseNodeInfo);
  }

  async fetchTemplateDashboardPack(
    templateId: string,
    dashboardId: string,
    auth: { token: string; cookie: string }
  ): Promise<DashboardDataPack> {
    const baseNodeInfo = await this.nodeService.getNodeDetailInfo(
      dashboardId,
      auth,
      { internal: false, notDst: true, main: true },
    );
    return await this.fetchPack(dashboardId, auth, baseNodeInfo, templateId);
  }

  async fetchShareDashboardPack(
    shareId: string,
    dashboardId: string,
    auth: { token: string; cookie: string },
  ): Promise<DashboardDataPack> {
    const baseNodeInfo = await this.nodeService.getNodeDetailInfo(
      dashboardId,
      auth,
      { internal: false, notDst: true, main: true, shareId },
    );
    return await this.fetchPack(dashboardId, auth, baseNodeInfo, shareId);
  }

  async fetchPack(
    dashboardId: string,
    auth: { token: string; cookie: string },
    baseNodeInfo: NodeDetailInfo,
    linkId?: string,
  ): Promise<DashboardDataPack> {
    const meta = await this.resourceMetaRepository.selectMetaByResourceId(dashboardId);
    const dashboard = {
      ...baseNodeInfo.node,
      snapshot: {
        widgetInstallations: meta,
      },
    };

    try {
      const widgetMap = await this.fetchWidgetMapByIds(meta, auth, linkId);
      return {
        dashboard,
        widgetMap,
      };
    } catch (error) {
      return error;
    }
  }

  private async fetchWidgetMapByIds(
    meta: IResourceMeta,
    auth: { token: string; cookie: string },
    linkId?: string,
  ): Promise<WidgetMap> {
    if (!Object.keys(meta).length) {
      return {};
    }
    const layout = meta['layout'] || [];
    const installWidgetIds = layout.map(v => v.id);
    if (!installWidgetIds.length) { return {}; }
    try {
      return await this.restService.fetchWidget(auth, installWidgetIds.join(','), linkId);
    } catch (e) {
      throw new ServerException(ResourceException.FETCH_WIDGET_ERROR);
    }
  }
}
