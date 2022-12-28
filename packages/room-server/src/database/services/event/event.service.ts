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

import {
  clearComputeCache, IEventInstance, IEventResourceMap, IExpression, InputParser, IOPEvent, IReduxState, IRemoteChangeset, IServerDatasheetPack,
  MagicVariableParser, OP2Event, OperandTypeEnums, OperatorEnums, OPEventManager, OPEventNameEnums, ResourceType, TRIGGER_INPUT_FILTER_FUNCTIONS,
  TRIGGER_INPUT_PARSER_FUNCTIONS,
} from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { AutomationTriggerRepository } from 'automation/repositories/automation.trigger.repository';
import { AutomationTriggerTypeRepository } from 'automation/repositories/automation.trigger.type.repository';
import { AutomationService } from 'automation/services/automation.service';
import { InjectLogger } from 'shared/common';
import { getRecordUrl } from 'shared/helpers/env';
import { Logger } from 'winston';
import { CommandService } from '../command/command.service';
import { DatasheetService } from '../datasheet/datasheet.service';

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
 * Event listener service, convert op to events, and handle related event listening.
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
    // Server side only listens to record content CRUD events.
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
    // Convert trigger input to plain object
    this.triggerInputParser = this.makeInputParser(TRIGGER_INPUT_PARSER_FUNCTIONS);
    // Parser dedicated to record matching condition
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
      resourceId, triggerType[0]!.triggerTypeId
    );
  }

  private async formSubmittedListener(event: any) {
    const resourceId = event.datasheetId;
    if (!resourceId) return;
    const triggers = await this.getTriggersByResourceAndType(resourceId, VikaTriggerTypeEnums.FormSubmitted);
    if (triggers.length === 0) return;
    // Here all triggers of the resource is obtained. We can filter by triggerType
    // TODO: Dirty data exists, causing one robot has multiple triggers, trigger whose input is empty should not be trigged.
    //       Filter them here to avoid normal trigger triggering.
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

  // Record creation event triggers two kinds of listeners
  private recordCreatedListener(event: any, metaContext: any) {
    // Record matching condition
    this.recordMatchConditionsTriggerHandler(event, metaContext);
    // Record creation
    this.recordCreatedTriggerHandler(event, metaContext);
    return;
  }

  // Record update event triggers listeners
  private recordUpdatedListener(event: any, metaContext: any) {
    this.recordMatchConditionsTriggerHandler(event, metaContext);
  }

  /**
   * Process triggers of current record matching condition
   */
  private recordCreatedTriggerHandler(event: any, metaContext: any) {
    const { dstIdTriggersMap, triggerSlugTypeIdMap, msgIds } = metaContext;
    // record creation
    const { datasheetId, datasheetName, recordId } = event;
    let triggers = dstIdTriggersMap[datasheetId] as any[];
    if (!triggers) return;
    const triggerSlug = `${VikaTriggerTypeEnums.RecordCreated}@${VIKA_SERVICE_SLUG}`;
    triggers = triggers.filter(item => triggerSlugTypeIdMap[triggerSlug] === item.triggerTypeId);
    // const triggers = await this.getTriggersByResourceAndType(datasheetId, VikaTriggerTypeEnums.RecordCreated);
    if (triggers.length === 0) return;
    // resource bound to robot and form id in trigger input is identical
    const shouldFireRobots: IShouldFireRobot[] = triggers.filter(item => Boolean(item.input)).reduce((prev, item) => {
      const triggerInput = this.triggerInputParser.render(item.input, {});
      if (triggerInput.datasheetId === datasheetId) {
        const triggerOutput = {
          // TODO: old structure left for Qianfan, delete later
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
        this.logger.error('Robot task execution failed', e);
      }
    });
  }

  // Field matches condition filter
  private filterExec(filter: IExpression, eventContext: any) {
    if (!filter) return false;
    // Currently only non-group filters are implemented. obtain fieldId of each item in operands,
    // compute sets by groups, take each operand in each group as a fieldId
    const filterFieldIdsSet = new Set<string>();
    const getAllFilterFieldIds = (filter: IExpression) => {
      if (filter.operator === OperatorEnums.And || filter.operator === OperatorEnums.Or) {
        // When the operator is AND or OR, operands are always expressions.
        filter.operands.forEach(operand => {
          if (operand.type === OperandTypeEnums.Expression) {
            getAllFilterFieldIds(operand.value);
          }
        });
      } else {
        // When the operator is neither OR nor AND, it is a comparison operator,
        // the first operand is always a literal and a field ID.
        if (filter.operands[0]!.type === OperandTypeEnums.Literal) {
          filterFieldIdsSet.add(filter.operands[0]!.value);
        }
      }
    };
    getAllFilterFieldIds(filter);
    const filterFieldIds = Array.from(filterFieldIdsSet);
    // const filterFieldIds: string[] = filter.operands.map(item => item.value.operands[0].value);
    // If intersection exists, only when listened-on field changes, trigger
    const isIntersect = filterFieldIds.some(item => eventContext.diffFields.includes(item));
    // triggerInput.filter is also an expression.
    return isIntersect && this.triggerFilterInputParser.expressionParser.exec(filter, eventContext);
  }

  private recordMatchConditionsTriggerHandler(event: any, metaContext: any) {
    const { dstIdTriggersMap, triggerSlugTypeIdMap, msgIds } = metaContext;
    // Record creation
    const { datasheetId, datasheetName, recordId } = event;
    let triggers = dstIdTriggersMap[datasheetId] as any[];
    if (!triggers) return;
    const triggerSlug = `${VikaTriggerTypeEnums.RecordMatchesConditions}@${VIKA_SERVICE_SLUG}`;
    triggers = triggers.filter(item => triggerSlugTypeIdMap[triggerSlug] === item.triggerTypeId);
    if (triggers.length === 0) return;
    const shouldFireRobots: IShouldFireRobot[] = triggers.filter(item => Boolean(item.input)).reduce((prev, item) => {
      this.logger.debug('originInput', item.input);
      const triggerInput = this.triggerInputParser.render(item.input, {});
      this.logger.debug('triggerInput', triggerInput, JSON.stringify(triggerInput));
      const isSameResource = triggerInput.datasheetId === datasheetId;
      // TODO: Filter condition matching, robot is only triggered when condition is matched.
      const isMatchFilterConditions = this.filterExec(triggerInput.filter, event);
      if (isSameResource && isMatchFilterConditions) {
        const triggerOutput = {
          // TODO: old structure left for Qianfan, delete later
          datasheet: {
            id: datasheetId,
            name: datasheetName
          },
          record: {
            id: recordId,
            url: getRecordUrl(datasheetId, recordId),
            fields: event.eventFields
          },
          // Flattened new structure below
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

  private initEventListener() {
    this.opEventManager.addEventListener(
      OPEventNameEnums.FormSubmitted, this.formSubmittedListener.bind(this),
    );
    this.opEventManager.addEventListener(
      // @ts-ignore
      OPEventNameEnums.RecordCreated, this.recordCreatedListener.bind(this),
    );
    this.opEventManager.addEventListener(
      // @ts-ignore
      OPEventNameEnums.RecordUpdated, this.recordUpdatedListener.bind(this),
    );
  }

  /**
   * Analyze ops, figure out op resource dependency, query database and construct sparse store.
   */
  private async makeState(resourceMap: IEventResourceMap): Promise<IReduxState> {
    const datasheetPacks: IServerDatasheetPack[] = await this.datasheetService.getTinyBasePacks(resourceMap);
    this.logger.debug('datasheetPacks', datasheetPacks);
    return this.commandService.fillTinyStore(datasheetPacks).getState();
  }

  /**
   * Obtain triggers may be triggered by each resource by resource id
   *
   * ```
   * {
   *  [dstId]: [trigger1,trigger2]
   * }
   * ```
   *
   * @param resourceIds datasheet id array
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
      prev[dstId]!.push(item);
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
    this.logger.info('handleChangesets', { msgIds, events });
    if (events.length === 0) {
      return;
    }
    const resourceIds = this.getResourceIdsByEvents(events);
    if (resourceIds.length === 0) {
      return;
    }
    // Clear cache after event computation, make sure compute field cache is cleared
    resourceIds.forEach(resourceId => {
      clearComputeCache(resourceId);
    });
    const dstIdTriggersMap = await this.getResourceIdTriggersMapByResourceIds(resourceIds);
    const triggerSlugTypeIdMap = await this.getTriggerSlugAndTypeIdMap(TriggerTypeEndpoints, VIKA_SERVICE_SLUG);
    this.logger.debug(`In this batch, changeset triggers ${events.length} events: `, events.map(item => item.eventName));
    this.logger.debug('dstIdTriggersMap', dstIdTriggersMap);
    this.logger.debug('triggerSlugTypeIdMap', triggerSlugTypeIdMap);
    this.logger.info('handle events', { msgIds, dstIdTriggersMap, triggerSlugTypeIdMap });
    this.opEventManager.handleEvents(events, false, { dstIdTriggersMap, triggerSlugTypeIdMap, msgIds });
  }
}