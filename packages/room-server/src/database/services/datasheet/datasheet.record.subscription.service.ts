import { Injectable } from '@nestjs/common';
import { Field, FieldType, IEventInstance, IOPEvent, IReduxState, IRemoteChangeset, IRoleMember
  , ISnapshot, IViewProperty, IViewRow, OP2Event, OPEventManager, OPEventNameEnums, OTActionName, Selectors, truncateText } from '@apitable/core';
import { InjectLogger } from '../../../shared/common';
import { DatasheetRecordSubscriptionEntity } from '../../entities/datasheet.record.subscription.entity';
import { IdWorker } from 'shared/helpers/snowflake';
import { IAuthHeader } from '../../../shared/interfaces';
import { isEmpty, map } from 'lodash';
import { DatasheetPack, NodeRelInfo } from '../../interfaces';
import { QueueSenderService } from 'shared/services/queue/queue.sender.service';
import { DatasheetRecordSubscriptionRepository } from '../../repositories/datasheet.record.subscription.repository';
import { RestService } from 'shared/services/rest/rest.service';
import { In } from 'typeorm';
import { Logger } from 'winston';
import { CommandService } from '../command/impl/command.service';
import { NodeService } from '../node/node.service';
import { UnitMemberService } from '../unit/unit.member.service';
import { UserService } from '../user/user.service';
import { DatasheetMetaService } from './datasheet.meta.service';
import { DatasheetRecordService } from './datasheet.record.service';
import { DatasheetService } from './datasheet.service';
import { RecordCommentService } from './record.comment.service';

@Injectable()
export class DatasheetRecordSubscriptionService {

  // TODO Delete event handling code after changed Mongo CDC to process events asynchronously
  opEventManager: OPEventManager;

  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly commandService: CommandService,
    private readonly datasheetService: DatasheetService,
    private readonly datasheetMetaService: DatasheetMetaService,
    private readonly datasheetRecordService: DatasheetRecordService,
    private readonly nodeService: NodeService,
    private readonly queueSenderService: QueueSenderService,
    private readonly recordCommentService: RecordCommentService,
    private readonly recordSubscriptionRepo: DatasheetRecordSubscriptionRepository,
    private readonly restService: RestService,
    private readonly unitMemberService: UnitMemberService,
    private readonly userService: UserService,
  ) {
    const watchedEvents = [
      OPEventNameEnums.CellUpdated,
      OPEventNameEnums.RecordCommentUpdated,
    ];
    this.opEventManager = new OPEventManager({
      options: {
        enableVirtualEvent: false,
        enableCombEvent: false,
        enableEventComplete: false
      },
      getState: () => undefined,
      op2Event: new OP2Event(watchedEvents)
    });
    this.initEventListener();
  }

  public async subscribeDatasheetRecords(userId: string, dstId: string, recordIds: string[], mirrorId?: string | null) {
    if (isEmpty(recordIds)) return;

    const existRecordIds = await this.datasheetRecordService.getIdsByDstIdAndRecordIds(dstId, recordIds);
    const validRecordIds = recordIds.filter((recordId: string) => existRecordIds.includes(recordId));

    const subscribedRecordIds = await this.getSubscribedRecordIds(userId, dstId);
    const newSubscribedRecordIds = validRecordIds.filter((recordId: string) => !subscribedRecordIds.includes(recordId));
    if (isEmpty(newSubscribedRecordIds)) return;

    await this.recordSubscriptionRepo.createQueryBuilder()
      .insert()
      .into(DatasheetRecordSubscriptionEntity)
      .values(newSubscribedRecordIds.map((recordId: string) => {
        return {
          id: IdWorker.nextId().toString(),
          dstId: dstId,
          mirrorId: mirrorId,
          recordId: recordId,
          createdBy: userId,
        };
      }))
      .updateEntity(false)
      .execute();
  }

  public async unsubscribeDatasheetRecords(userId: string, dstId: string, recordIds: string[]) {
    if (isEmpty(recordIds)) return;

    const existRecordIds = await this.datasheetRecordService.getIdsByDstIdAndRecordIds(dstId, recordIds);
    const validRecordIds = recordIds.filter((recordId: string) => existRecordIds.includes(recordId));
    if (isEmpty(validRecordIds)) return;

    await this.recordSubscriptionRepo.createQueryBuilder()
      .update(DatasheetRecordSubscriptionEntity)
      .set({
        updatedBy: userId,
        isDeleted: true,
      })
      .where({ createdBy: userId, dstId, recordId: In(validRecordIds), isDeleted: false })
      .execute();
  }

  public async getSubscribedRecordIds(userId: string, dstId: string) {
    return await this.recordSubscriptionRepo.selectRecordIdsByDstIdAndUserId(dstId, userId);
  }

  public async getSubscriptionsByRecordId(dstId: string, recordId: string) {
    return await this.recordSubscriptionRepo.selectByDstIdAndRecordId(dstId, recordId);
  }

  public async getSubscriptionsByRecordIds(dstId: string, recordIds: string[]) {
    return await this.recordSubscriptionRepo.selectByDstIdAndRecordIds(dstId, recordIds);
  }

  public async handleChangesets(changesets: IRemoteChangeset[], context: any) {
    const events = await this.opEventManager.asyncHandleChangesets(changesets);
    const subscriptedEvents = await this.filterSubscriptedRecordEvents(events);
    if (subscriptedEvents.length === 0) {
      return;
    }
    this.opEventManager.handleEvents(subscriptedEvents, false, context);
  }

  private async filterSubscriptedRecordEvents(events: IEventInstance<IOPEvent>[]) {
    const watchedEvents = [
      OPEventNameEnums.CellUpdated,
      OPEventNameEnums.RecordCommentUpdated,
    ];
    if (events.length === 0) {
      return events;
    }
    const { datasheetId } = events[0].context;
    const recordUpdatedEvents = events.filter(event => watchedEvents.includes(event.eventName));
    if (recordUpdatedEvents.length === 0) {
      return recordUpdatedEvents;
    }
    const recordIds: string[] = recordUpdatedEvents.map(event => event.context.recordId);
    const subscriptedRecordIds = await this.getSubscriptedRecordsInPagination(datasheetId, recordIds);
    const subscriptedRecordEvents = recordUpdatedEvents.filter(event => subscriptedRecordIds.has(event.context.recordId));
    return subscriptedRecordEvents;
  }

  private async getSubscriptedRecordsInPagination(datasheetId: string, recordIds: string[]){
    const pageSize = 1000;
    const pageNum = Math.ceil(recordIds.length / pageSize);
    const subscriptedRecordIds = new Set();
    for(let i = 0; i < pageNum; i++) {
      const offset = i * pageSize;
      const recordIdsInPagination = recordIds.slice(offset, offset + pageSize);
      const subscriptions = await this.getSubscriptionsByRecordIds(datasheetId, recordIdsInPagination);
      subscriptions.forEach(subscription => {
        subscriptedRecordIds.add(subscription.recordId);
      });
    }
    return subscriptedRecordIds;
  }

  private async onRecordCellUpdated(event: any, context: any) {
    const { datasheetId, fieldId, recordId } = event;
    const { spaceId, operatorUserId, authHeader, fromEditableSharedNode } = context;

    if (fromEditableSharedNode) return;

    const metaMap = await this.datasheetMetaService.getMetaMapByDstIds([datasheetId], true);
    const datasheetMeta = metaMap[datasheetId];
    if (!datasheetMeta) return;

    const recordMap = await this.datasheetRecordService.getRecordsByDstIdAndRecordIds(datasheetId, [recordId]);
    const relatedRecord = recordMap[recordId];
    if (!relatedRecord) return;

    const relatedField = datasheetMeta.fieldMap[fieldId];
    if (!relatedField) return;

    const dataPack = await this.fetchDataPack(datasheetId, authHeader, recordId);
    if (!dataPack) return;

    const userInfo = await this.userService.getUserInfoBySpaceId(authHeader, dataPack.datasheet.spaceId);
    const store = this.commandService.fullFillStore(dataPack.datasheet.spaceId, dataPack, userInfo);
    const state = store.getState();

    const subscriptions = await this.getSubscriptionsByRecordId(datasheetId, recordId);
    if (isEmpty(subscriptions)) return;

    // Don't notify operator
    const subscriberUserIds = subscriptions.map((sub) => sub.createdBy).filter((uid: string) => uid !== operatorUserId);
    if (isEmpty(subscriberUserIds)) return;

    const subscriptionByUserId = subscriptions.reduce<{ [key: string]: DatasheetRecordSubscriptionEntity }>((acc, cur) => {
      acc[cur.createdBy] = cur;
      return acc;
    }, {});

    const userIdByMemberId = {};
    const unitIdByMemberId = {};
    const subscriberMembers = await this.unitMemberService.getMembersBaseInfoBySpaceIdAndUserIds(spaceId, subscriberUserIds);
    Object.keys(subscriberMembers).forEach((userId: string) => {
      const memberId = subscriberMembers[userId].memberId;
      const unitId = subscriberMembers[userId].unitId;

      userIdByMemberId[memberId] = userId;
      unitIdByMemberId[memberId] = unitId;
    });

    let subscriberMemberIds = Object.keys(userIdByMemberId);
    this.logger.info(`datasheets[${datasheetId}].records[${recordId}] subscribers: ${subscriberMemberIds.join()}`);

    // If field permission is set on changed field, filter out subscribers who don't have permission for this field
    const fieldRoleListData = await this.restService.getFieldPermissionRoleList(authHeader, datasheetId, fieldId);
    if (fieldRoleListData.enabled) {
      const allowedMemberIds = fieldRoleListData.members.map((member: IRoleMember) => member.memberId);
      subscriberMemberIds = subscriberMemberIds.filter((memberId => allowedMemberIds.includes(memberId)));
    }

    // Get related mirror nodes
    const involvedMirrorNodes = await this.getSubscriptionInvolvedMirrorNodes(subscriptions);

    // Get value of primary field
    const recordTitle = this.datasheetRecordService.getRecordTitle(relatedRecord, datasheetMeta, store);

    // Get changed value
    let oldDisplayValue = '';
    let newDisplayValue = '';
    if (relatedField.type !== FieldType.Link) {
      const oldRawValue = event.change.from;
      const newRawValue = event.change.to;
      oldDisplayValue = Field.bindContext(relatedField, state).cellValueToString(oldRawValue) || '';
      newDisplayValue = Field.bindContext(relatedField, state).cellValueToString(newRawValue) || '';
    }

    // message extra payload
    const msgTemplate = 'subscribed_record_cell_updated';
    const msgExtras = {
      recordTitle: truncateText(recordTitle),
      fieldName: truncateText(relatedField.name),
      oldDisplayValue: truncateText(oldDisplayValue),
      newDisplayValue: truncateText(newDisplayValue),
      recordId: recordId,
      viewId: datasheetMeta.views[0].id,
    };

    // Subscribers after filtering by field permission, check subscription source (datasheet of mirror)
    const nodeRoleListData = await this.restService.getNodePermissionRoleList(authHeader, spaceId, datasheetId);
    const datasheetMemberIds = nodeRoleListData.members.map((member) => member.memberId);
    this.logger.info(`datasheets[${datasheetId}].records[${recordId}] subscribers(with permission): ${datasheetMemberIds.join()}`);

    // mirror cache
    const mirrorIdToViewIdMap: { [key: string]: string } = {};
    const mirrorVisibleRecordIds: { [key: string]: string[] } = {};

    subscriberMemberIds.forEach((memberId: string) => {
      const userId = userIdByMemberId[memberId];
      const unitId = unitIdByMemberId[memberId];
      const subscription = subscriptionByUserId[userId];
      
      // If subscription comes from datasheet and subscriber has datasheet node permission, notify
      if (!subscription.mirrorId) {
        if (datasheetMemberIds.includes(memberId)) {
          const message = this.buildNotificationMessage(spaceId, datasheetId, msgTemplate, operatorUserId, unitId, msgExtras);
          this.queueSenderService.sendMessage('vikadata.api.notification.exchange', 'notification.message', message);
        }
        return;
      }

      // If subscription comes from mirror, check if record is visible in mirror, if so, notify
      let visibleRecordIds: string[];
      if (subscription.mirrorId in mirrorVisibleRecordIds) { // cache hit
        visibleRecordIds = mirrorVisibleRecordIds[subscription.mirrorId];
      } else { // cache miss
        const mirrorNode = involvedMirrorNodes[subscription.mirrorId];
        const viewId = mirrorNode.viewId;
        const viewInfo = this.getViewInfo(viewId, dataPack.snapshot, state);
        const visibleRows = this.getVisibleRows(viewInfo, state);

        // fill cache
        mirrorIdToViewIdMap[subscription.mirrorId] = viewId;
        visibleRecordIds = visibleRows.map((row) => row.recordId);
      }
      
      if (visibleRecordIds.includes(recordId)) {
        const mirrorId = subscription.mirrorId;
        const mirrorMsgExtras = { ...msgExtras, viewId: mirrorIdToViewIdMap[mirrorId] };
        const message = this.buildNotificationMessage(spaceId, mirrorId, msgTemplate, operatorUserId, unitId, mirrorMsgExtras);
        this.queueSenderService.sendMessage('vikadata.api.notification.exchange', 'notification.message', message);
      }
    });
  }

  private async onRecordCommentUpdated(event: any, context: any) {
    const { datasheetId, recordId, action } = event;
    const { spaceId, operatorUserId, authHeader, fromEditableSharedNode } = context;

    if (fromEditableSharedNode) return;
    if (action.n !== OTActionName.ListInsert) return;

    const commentContent = this.recordCommentService.extractCommentTextFromAction(action);
    if (!commentContent) return;

    const metaMap = await this.datasheetMetaService.getMetaMapByDstIds([datasheetId], true);
    const datasheetMeta = metaMap[datasheetId];
    if (!datasheetMeta) return;

    const recordMap = await this.datasheetRecordService.getRecordsByDstIdAndRecordIds(datasheetId, [recordId]);
    const relatedRecord = recordMap[recordId];
    if (!relatedRecord) return;

    const dataPack = await this.fetchDataPack(datasheetId, authHeader, recordId);
    if (!dataPack) return;

    const userInfo = await this.userService.getUserInfoBySpaceId(authHeader, dataPack.datasheet.spaceId);
    const store = this.commandService.fullFillStore(dataPack.datasheet.spaceId, dataPack, userInfo);
    const state = store.getState();

    const subscriptions = await this.getSubscriptionsByRecordId(datasheetId, recordId);
    if (isEmpty(subscriptions)) return;

    // Don't notify operator
    const subscriberUserIds = subscriptions.map((sub) => sub.createdBy).filter((uid: string) => uid !== operatorUserId);
    if (isEmpty(subscriberUserIds)) return;

    const subscriptionByUserId = subscriptions.reduce<{ [key: string]: DatasheetRecordSubscriptionEntity }>((acc, cur) => {
      acc[cur.createdBy] = cur;
      return acc;
    }, {});

    const userIdByMemberId = {};
    const unitIdByMemberId = {};
    const subscriberMembers = await this.unitMemberService.getMembersBaseInfoBySpaceIdAndUserIds(spaceId, subscriberUserIds);
    Object.keys(subscriberMembers).forEach((userId: string) => {
      const memberId = subscriberMembers[userId].memberId;
      const unitId = subscriberMembers[userId].unitId;

      userIdByMemberId[memberId] = userId;
      unitIdByMemberId[memberId] = unitId;
    });

    const subscriberMemberIds = Object.keys(userIdByMemberId);

    // Obtain related mirror nodes
    const involvedMirrorNodes = await this.getSubscriptionInvolvedMirrorNodes(subscriptions);

    // Obtain value of primary field
    const recordTitle = this.datasheetRecordService.getRecordTitle(relatedRecord, datasheetMeta, store);

    // Get the subscription source (datasheet or mirror)
    const nodeRoleListData = await this.restService.getNodePermissionRoleList(authHeader, spaceId, datasheetId);
    const datasheetMemberIds = nodeRoleListData.members.map((member) => member.memberId);

    // mirror cache
    const mirrorIdToViewIdMap: { [key: string]: string } = {};
    const mirrorVisibleRecordIds: { [key: string]: string[] } = {};

    // message extra payload
    const msgTemplate = 'subscribed_record_commented';
    const msgExtras = {
      recordTitle: truncateText(recordTitle),
      content: truncateText(commentContent),
      recordId: recordId,
      viewId: datasheetMeta.views[0].id,
    };

    subscriberMemberIds.forEach((memberId: string) => {
      const userId = userIdByMemberId[memberId];
      const unitId = unitIdByMemberId[memberId];
      const subscription = subscriptionByUserId[userId];

      // If subscription comes from datasheet and subscriber has datasheet node permission, notify
      if (!subscription.mirrorId) {
        if (datasheetMemberIds.includes(memberId)) {
          const message = this.buildNotificationMessage(spaceId, datasheetId, msgTemplate, operatorUserId, unitId, msgExtras);
          this.queueSenderService.sendMessage('vikadata.api.notification.exchange', 'notification.message', message);
        }
        return;
      }

      // If subscription comes from mirror, check if record is visible in mirror, if so, notify
      let visibleRecordIds: string[];
      if (subscription.mirrorId in mirrorVisibleRecordIds) { // cache hit
        visibleRecordIds = mirrorVisibleRecordIds[subscription.mirrorId];
      } else { // cache miss
        const mirrorNode = involvedMirrorNodes[subscription.mirrorId];
        const viewId = mirrorNode.viewId;
        const viewInfo = this.getViewInfo(viewId, dataPack.snapshot, state);
        const visibleRows = this.getVisibleRows(viewInfo, state);

        // fill cache
        mirrorIdToViewIdMap[subscription.mirrorId] = viewId;
        visibleRecordIds = visibleRows.map((row) => row.recordId);
      }
      
      if (visibleRecordIds.includes(recordId)) {
        const mirrorId = subscription.mirrorId;
        const mirrorMsgExtras = { ...msgExtras, viewId: mirrorIdToViewIdMap[mirrorId] };
        const message = this.buildNotificationMessage(spaceId, mirrorId, msgTemplate, operatorUserId, unitId, mirrorMsgExtras);
        this.queueSenderService.sendMessage('vikadata.api.notification.exchange', 'notification.message', message);
      }
    });
  }

  private initEventListener() {
    this.opEventManager.addEventListener(
      OPEventNameEnums.CellUpdated, this.onRecordCellUpdated.bind(this),
    );
    this.opEventManager.addEventListener(
      OPEventNameEnums.RecordCommentUpdated, this.onRecordCommentUpdated.bind(this),
    );
  }

  private async getSubscriptionInvolvedMirrorNodes(subscriptions: DatasheetRecordSubscriptionEntity[]) {
    const involvedMirrorIds = subscriptions.reduce<string[]>((acc, cur) => {
      if (cur.mirrorId && !acc.includes(cur.mirrorId)) {
        acc.push(cur.mirrorId);
      }
      return acc;
    }, []);

    if (isEmpty(involvedMirrorIds)) return [];

    const involvedMirrorNodes = await this.nodeService.getNodeRelInfoByIds(involvedMirrorIds);
    return involvedMirrorNodes.reduce<{ [key: string]: NodeRelInfo }>((acc, cur) => {
      if (cur.relNodeId) {
        acc[cur.relNodeId] = cur;
      }
      return acc;
    }, {});
  }

  // todo: move to view? service
  private getViewInfo(viewId: string, snapshot: ISnapshot, state: IReduxState): IViewProperty {
    const view = Selectors.getViewByIdWithDefault(state, snapshot.datasheetId, viewId);
    const rows = map(snapshot.recordMap, record => { return { recordId: record.id }; });
    return { ...view, id: viewId, rows };
  }

  // todo: move to view? service
  private getVisibleRows(view: IViewProperty, state: IReduxState): IViewRow[] {
    const snapshot = Selectors.getSnapshot(state);
    const rows = Selectors.getVisibleRowsBase(state, snapshot, view);
    return rows && rows.length ? rows : [];
  }

  private buildNotificationMessage(
    spaceId: string,
    nodeId: string,
    templateId: string,
    fromUserId: string,
    toUnitId: string,
    extras: any
  ) {
    return {
      nodeId: nodeId,
      spaceId: spaceId,
      body: {
        extras: extras,
      },
      templateId: templateId,
      toUnitId: [toUnitId],
      fromUserId: fromUserId, 
    };
  }

  private async fetchDataPack(dstId: string, auth: IAuthHeader, recordId: string) {
    try {
      const dataPack: DatasheetPack = await this.datasheetService.fetchDataPack(dstId, auth, { recordIds: [recordId] });
      return dataPack;
    } catch (error) {
      this.logger.error(`Fetching DataPack failed, dstId: ${dstId}, recordId: ${recordId}, err: ${error}.`);
    }
    return undefined;
  }
}
