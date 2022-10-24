import { Injectable } from '@nestjs/common';
import {
  IEventResourceMap, IReduxState, IRemoteChangeset,
  IServerDatasheetPack, OPEventManager, OPEventNameEnums,
  OperandTypeEnums, OperatorEnums,
  OP2Event, MagicVariableParser, InputParser, TRIGGER_INPUT_FILTER_FUNCTIONS, IExpression,
  TRIGGER_INPUT_PARSER_FUNCTIONS,
  ResourceType,
  IEventInstance,
  IOPEvent,
  clearComputeCache,
} from '@apitable/core';
import { InjectLogger } from 'common';
import { getRecordUrl } from 'helpers/env';
import { AutomationTriggerRepository } from 'modules/repository/automation.trigger.repository';
import { AutomationTriggerTypeRepository } from 'modules/repository/automation.trigger.type.repository';
import { AutomationService } from '../automation/automation.service';
import { CommandService } from '../command/impl/command.service';
import { DatasheetService } from '../datasheet/datasheet.service';
import { Logger } from 'winston';

const VIKA_SERVICE_SLUG = 'vika';

enum VikaTriggerTypeEnums {
  FormSubmitted = 'form_submitted',
  RecordCreated = 'record_created',
  RecordMatchesConditions = 'record_matches_conditions',
}

type IShouldFireRobot = {
  robotId: string;
  trigger: {
    input: any;
    output: any;
  }
};

const TriggerTypeEndpoints = [
  VikaTriggerTypeEnums.RecordMatchesConditions,
  VikaTriggerTypeEnums.RecordCreated
];
/**
 * 事件监听服务，将 op 转化为事件，并且处理相关事件的监听。
 */
@Injectable()
export class EventService {
  opEventManager: OPEventManager;
  triggerInputParser: InputParser<any>;
  triggerFilterInputParser: InputParser<any>;
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private datasheetService: DatasheetService,
    private commandService: CommandService,
    private automationTriggerRepository: AutomationTriggerRepository,
    private automationTriggerTypeRepository: AutomationTriggerTypeRepository,
    private automationService: AutomationService,
  ) {
    // 服务端只需要监听记录内容 CRUD 的事件就行了
    const clientWatchedEvents = [
      OPEventNameEnums.CellUpdated,
      OPEventNameEnums.RecordCreated,
      OPEventNameEnums.RecordDeleted,
      OPEventNameEnums.RecordUpdated
    ];
    this.opEventManager = new OPEventManager({
      options: {
        enableVirtualEvent: true,
        enableCombEvent: true,
        enableEventComplete: true
      },
      getState: (resourceMap) => this.makeState(resourceMap),
      op2Event: new OP2Event(clientWatchedEvents)
    });
    // 将 trigger input 转化为普通对象
    this.triggerInputParser = this.makeInputParser(TRIGGER_INPUT_PARSER_FUNCTIONS);
    // 专门给记录符合匹配条件用的 parser
    this.triggerFilterInputParser = this.makeInputParser(TRIGGER_INPUT_FILTER_FUNCTIONS);
    this.initEventListener();
  }

  private makeInputParser(functions: any[]) {
    return new InputParser(new MagicVariableParser<any>(functions));
  }

  private async getTriggersByResourceAndType(resourceId: string, endpoint: string) {
    const triggerType = await this.automationTriggerTypeRepository.getTriggerTypeByServiceSlugAndEndpoints(
      [endpoint],
      VIKA_SERVICE_SLUG
    );
    return this.automationTriggerRepository.getTriggersByResourceAndTriggerTypeId(
      resourceId, triggerType[0].triggerTypeId
    );
  }
  private async formSubmittedListener(event) {
    const resourceId = event.datasheetId;
    if (!resourceId) return;
    const triggers = await this.getTriggersByResourceAndType(resourceId, VikaTriggerTypeEnums.FormSubmitted);
    if (triggers.length === 0) return;
    // 这里拿到的是该资源的所有 trigger。可以再通过 triggerType 再过滤一遍。
    // TODO: 存在脏数据。导致一个机器人有多个 trigger，input 为空的 trigger 不应该触发。这里过滤一遍，避免影响正常 trigger 的触发。
    const shouldFireRobots: IShouldFireRobot[] = triggers.filter(item => Boolean(item.input))
      .reduce((prev, item) => {
        const triggerInput = this.triggerInputParser.render(item.input, {});
        if (triggerInput.formId === event.formId) {
          prev.push({
            robotId: item.robotId,
            trigger: {
              input: triggerInput,
              output: event,
            }
          });
        }
        return prev;
      }, []);
    const shouldFireRobotIds = shouldFireRobots.map(robot => robot.robotId);
    this.logger.info('formSubmittedListener', {
      formId: event.formId,
      recordId: event.recordId,
      shouldFireRobotIds
    });
    shouldFireRobots.forEach(robot => {
      this.automationService.handleTask(robot.robotId, robot.trigger);
    });
  }

  // 记录创建 event 会触发 2 个监听
  private recordCreatedListener(event, metaContext) {
    // 记录符合匹配条件时
    this.recordMatchConditionsTriggerHandler(event, metaContext);
    // 记录创建时
    this.recordCreatedTriggerHandler(event, metaContext);
  }

  // 记录更新 event 触发 2 个监听
  private recordUpdatedListener(event, metaContext) {
    this.recordMatchConditionsTriggerHandler(event, metaContext);
  }
  /**
   * 处理当前记录符合匹配条件的触发器
   */
  private recordCreatedTriggerHandler(event, metaContext) {
    const { dstIdTriggersMap, triggerSlugTypeIdMap, msgIds } = metaContext;
    // 记录创建时
    const { datasheetId, datasheetName, recordId } = event;
    let triggers = dstIdTriggersMap[datasheetId];
    if (!triggers) return;
    const triggerSlug = `${VikaTriggerTypeEnums.RecordCreated}@${VIKA_SERVICE_SLUG}`;
    triggers = triggers.filter(item => triggerSlugTypeIdMap[triggerSlug] === item.triggerTypeId);
    // const triggers = await this.getTriggersByResourceAndType(datasheetId, VikaTriggerTypeEnums.RecordCreated);
    if (triggers.length === 0) return;
    // robot 绑定的资源和 trigger input 内的表格id 实际上是相同的。
    const shouldFireRobots: IShouldFireRobot[] = triggers.filter(item => Boolean(item.input)).reduce((prev, item) => {
      const triggerInput = this.triggerInputParser.render(item.input, {});
      if (triggerInput.datasheetId === datasheetId) {
        const triggerOutput = {
          // TODO: 旧结构，给千帆留的,后续删除
          datasheet: {
            id: datasheetId,
            name: datasheetName
          },
          record: {
            id: recordId,
            url: getRecordUrl(datasheetId, recordId),
            fields: event.eventFields
          },
          datasheetId,
          datasheetName,
          recordId,
          recordUrl: getRecordUrl(datasheetId, recordId),
          ...event.eventFields
        };
        prev.push({
          robotId: item.robotId,
          trigger: {
            input: triggerInput,
            output: triggerOutput,
          }
        });
      }
      return prev;
    }, []);
    const shouldFireRobotIds = shouldFireRobots.map(robot => robot.robotId);
    this.logger.info('recordCreatedTriggerHandler', {
      msgIds,
      shouldFireRobotIds
    });
    shouldFireRobots.forEach(robot => {
      try {
        this.automationService.handleTask(robot.robotId, robot.trigger);
      } catch (e) {
        this.logger.error('机器人任务执行异常', e);
      }
    });
  }

  // 字段符合匹配条件 filter 实现逻辑
  private filterExec(filter: IExpression, eventContext: any) {
    if (!filter) return false;
    // 一期只实现非 group 的过滤，获取 operands 中每项的 fieldId
    // 分组求集合，每个 group 中的每个 operand 作为一个 fieldId
    const filterFieldIdsSet = new Set<string>();
    const getAllFilterFieldIds = (filter: IExpression) => {
      if (filter.operator === OperatorEnums.And || filter.operator === OperatorEnums.Or) {
        // 逻辑运算符为 or 和 and 时,运算数一定是表达式。
        filter.operands.forEach(operand => {
          if (operand.type === OperandTypeEnums.Expression) {
            getAllFilterFieldIds(operand.value);
          }
        });
      } else {
        // 逻辑运算符不为 or 和 and 时，表示是具体的比较运算符，则第一个运算数一定是字面量，且为字段id。
        if (filter.operands[0].type === OperandTypeEnums.Literal) {
          filterFieldIdsSet.add(filter.operands[0].value);
        }
      }
    };
    getAllFilterFieldIds(filter);
    const filterFieldIds = Array.from(filterFieldIdsSet);
    // const filterFieldIds: string[] = filter.operands.map(item => item.value.operands[0].value);
    // 是否存在交集，只有监听的字段变化时，才会触发。
    const isIntersect = filterFieldIds.some(item => eventContext.diffFields.includes(item));
    // triggerInput.filter 也是一套表达式。
    return isIntersect && this.triggerFilterInputParser.expressionParser.exec(filter, eventContext);
  }

  private recordMatchConditionsTriggerHandler(event, metaContext) {
    const { dstIdTriggersMap, triggerSlugTypeIdMap, msgIds } = metaContext;
    // 记录创建时
    const { datasheetId, datasheetName, recordId } = event;
    let triggers = dstIdTriggersMap[datasheetId];
    if (!triggers) return;
    const triggerSlug = `${VikaTriggerTypeEnums.RecordMatchesConditions}@${VIKA_SERVICE_SLUG}`;
    triggers = triggers.filter(item => triggerSlugTypeIdMap[triggerSlug] === item.triggerTypeId);
    if (triggers.length === 0) return;
    const shouldFireRobots: IShouldFireRobot[] = triggers.filter(item => Boolean(item.input)).reduce((prev, item) => {
      this.logger.debug('originInput', item.input);
      const triggerInput = this.triggerInputParser.render(item.input, {});
      this.logger.debug('triggerInput', triggerInput, JSON.stringify(triggerInput));
      const isSameResource = triggerInput.datasheetId === datasheetId;
      // TODO: 这里实现匹配条件的过滤，符合条件才会触发 robot 执行。
      const isMatchFilterConditions = this.filterExec(triggerInput.filter, event);
      if (isSameResource && isMatchFilterConditions) {
        const triggerOutput = {
          // TODO: 旧结构，给千帆留的,后续删除
          datasheet: {
            id: datasheetId,
            name: datasheetName
          },
          record: {
            id: recordId,
            url: getRecordUrl(datasheetId, recordId),
            fields: event.eventFields
          },
          // 下面是拍平的新结构
          datasheetId,
          datasheetName,
          recordId,
          recordUrl: getRecordUrl(datasheetId, recordId),
          ...event.eventFields
        };
        this.logger.debug('triggerOutput', triggerOutput, JSON.stringify(triggerOutput));
        prev.push({
          robotId: item.robotId,
          trigger: {
            input: triggerInput,
            output: triggerOutput
          }
        });
      }
      return prev;
    }, []);
    const shouldFireRobotIds = shouldFireRobots.map(robot => robot.robotId);
    this.logger.info('recordMatchConditionsTriggerHandler', {
      msgIds,
      shouldFireRobotIds
    });
    shouldFireRobots.forEach(robot => {
      this.automationService.handleTask(robot.robotId, robot.trigger);
    });
  }

  /**
   * 事件监听器
   */
  private initEventListener() {
    this.opEventManager.addEventListener(
      OPEventNameEnums.FormSubmitted, this.formSubmittedListener.bind(this),
    );
    this.opEventManager.addEventListener(
      OPEventNameEnums.RecordCreated, this.recordCreatedListener.bind(this),
    );
    this.opEventManager.addEventListener(
      OPEventNameEnums.RecordUpdated, this.recordUpdatedListener.bind(this),
    );
  }
  /**
   * 解析 ops，理清楚 op 依赖的资源，查库构造稀疏 store。
   */
  private async makeState(resourceMap: IEventResourceMap): Promise<IReduxState> {
    // 查库
    const datasheetPacks: IServerDatasheetPack[] = await this.datasheetService.getTinyBasePacks(resourceMap);
    this.logger.debug('datasheetPacks', datasheetPacks);
    return this.commandService.fillTinyStore(datasheetPacks).getState();
  }

  /**
   * 按照资源 id 查出每个资源可能触发的 trigger。
   * {
   *  [dstId]: [trigger1,trigger2]
   * }
   * @param resourceIds: 数表id 列表 
   */
  private async getResourceIdTriggersMapByResourceIds(resourceIds: string[]): Promise<any> {
    const robots = await this.automationService.getActiveRobotsByResourceIds(resourceIds);
    const robotIdDstIdMap = robots.reduce((prev, item) => {
      prev[item.robotId] = item.resourceId;
      return prev;
    }, {});
    const robotIds = robots.map(item => item.robotId);
    const triggers = await this.automationTriggerRepository.getAllTriggersByRobotIds(robotIds);
    const dstTriggersMap = triggers.reduce((prev, item) => {
      const dstId = robotIdDstIdMap[item.robotId];
      if (!prev[dstId]) {
        prev[dstId] = [];
      }
      prev[dstId].push(item);
      return prev;
    }, {} as { [dstId: string]: any[] });
    return dstTriggersMap;
  }

  private getResourceIdsByEvents(events: IEventInstance<IOPEvent>[]) {
    const resourceIds = events.reduce((prev, item) => {
      if (item.scope === ResourceType.Datasheet) {
        prev.add(item.context.datasheetId);
      }
      return prev;
    }, new Set<string>());
    return Array.from(resourceIds);
  }

  private async getTriggerSlugAndTypeIdMap(endpoints: string[], serviceSlug: string) {
    const triggerTypes = await this.automationTriggerTypeRepository.getTriggerTypeByServiceSlugAndEndpoints(endpoints, serviceSlug);
    const triggerSlugTypeIdMap: {
      [triggerSlug: string]: string
    } = {};
    triggerTypes.forEach(item => {
      const triggerSlug = `${item.endpoint}@${item.serviceSlug}`;
      triggerSlugTypeIdMap[triggerSlug] = item.triggerTypeId;
    });
    return triggerSlugTypeIdMap;
  }

  async handleChangesets(changesets: IRemoteChangeset[]) {
    const msgIds = changesets.map(cs => cs.messageId);
    const events = await this.opEventManager.asyncHandleChangesets(changesets);
    this.logger.info('handleChangesets', { msgIds });
    if (events.length === 0) {
      return;
    }
    const resourceIds = this.getResourceIdsByEvents(events);
    if (resourceIds.length === 0) {
      return;
    }
    // 算完事件再清一次。保证计算字段的缓存被剔除
    resourceIds.forEach(resourceId => {
      clearComputeCache(resourceId);
    });
    const dstIdTriggersMap = await this.getResourceIdTriggersMapByResourceIds(resourceIds);
    const triggerSlugTypeIdMap = await this.getTriggerSlugAndTypeIdMap(TriggerTypeEndpoints, VIKA_SERVICE_SLUG);
    this.logger.debug(`本批次 changeset 触发了 ${events.length} 个事件：`, events.map(item => item.eventName));
    this.logger.debug('dstIdTriggersMap', dstIdTriggersMap);
    this.logger.debug('triggerSlugTypeIdMap', triggerSlugTypeIdMap);
    this.opEventManager.handleEvents(events, false, { dstIdTriggersMap, triggerSlugTypeIdMap, msgIds });
  }
}