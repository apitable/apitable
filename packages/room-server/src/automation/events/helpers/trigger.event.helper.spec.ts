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

import { AutomationService } from '../../services/automation.service';
import { FieldType } from '@apitable/core';
import { AutomationTriggerEntity } from '../../entities/automation.trigger.entity';
import { CommonEventContext } from '../domains/common.event';
import { EventTypeEnums } from '../domains/event.type.enums';
import { OFFICIAL_SERVICE_SLUG, TriggerEventHelper } from './trigger.event.helper';
import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { LoggerConfigService } from 'shared/services/config/logger.config.service';
import { QueueDynamicModule } from 'shared/services/queue/queue.dynamic.module';

describe('TriggerEventHelper', () => {
  let moduleFixture: TestingModule;
  let automationService: AutomationService;
  let triggerEventHelper: TriggerEventHelper;
  const getTrigger = (input: object | undefined) => {
    return {
      triggerId: 'triggerId',
      triggerTypeId: 'triggerTypeId',
      input,
      robotId: 'robotId',
    };
  };
  const getCommonState = () => {
    return {
      datasheetMap: {
        datasheetId: {
          datasheet: {
            snapshot: {
              meta: {
                fieldMap: {
                  fieldId: {
                    type: FieldType.Text,
                  },
                },
              },
            },
          },
        },
      },
    };
  };
  const getDatasheetInfoInput = () => {
    return {
      type: 'Expression',
      value: { operands: ['datasheetId', { type: 'Literal', value: 'datasheetId' }], operator: 'newObject' },
    };
  };
  const getRecordMatchConditionalTriggers = () => {
    return [
      getTrigger({
        type: 'Expression',
        value: {
          operands: [
            'datasheetId',
            { type: 'Literal', value: 'datasheetId' },
            'filter',
            {
              type: 'Literal',
              value: {
                operands: [
                  {
                    type: 'Expression',
                    value: {
                      operands: [
                        { type: 'Literal', value: 'fieldId' },
                        { type: 'Literal', value: '' },
                      ],
                      operator: 'isNotNull',
                    },
                  },
                ],
                operator: 'and',
              },
            },
          ],
          operator: 'newObject',
        },
      }),
    ] as AutomationTriggerEntity[];
  };
  const getCommonEventContext = (diffFields: string[] = [], fields = {}, state = {}) => {
    return {
      datasheetId: 'datasheetId',
      datasheetName: 'datasheetName',
      recordId: 'recordId',
      diffFields,
      fields,
      state,
    };
  };
  const getCommonMetaContext = (triggerSlugTypeIdMap: { [key: string]: string }, triggerTypeInput: object | undefined) => {
    return {
      dstIdTriggersMap: {
        datasheetId: [
          {
            triggerId: 'triggerId',
            triggerTypeId: 'triggerTypeId',
            input: triggerTypeInput,
            robotId: 'robotId',
          },
        ] as AutomationTriggerEntity[],
      },
      triggerSlugTypeIdMap,
      msgIds: ['messageId'],
    };
  };

  beforeEach(async() => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        WinstonModule.forRootAsync({
          useClass: LoggerConfigService,
        }),
        QueueDynamicModule.forRoot()
      ],
      providers: [
        {
          provide: AutomationService,
          useValue: {
            handleTask: jest.fn().mockReturnValue(Promise.resolve()),
          }
        }
        , TriggerEventHelper,
      ],
    }).compile();
    automationService = moduleFixture.get<AutomationService>(AutomationService);
    triggerEventHelper = moduleFixture.get<TriggerEventHelper>(TriggerEventHelper);
  });

  afterEach(async() => {
    await moduleFixture.close();
  });

  it('should be defined', () => {
    expect(automationService).toBeDefined();
    expect(triggerEventHelper).toBeDefined();
  });

  it('given a type IExpressionOperand object when render it then should be successfully return datasheet id', () => {
    const renderInput = triggerEventHelper.renderInput(getDatasheetInfoInput());
    expect(renderInput).toBeDefined();
    expect(renderInput.datasheetId).toEqual('datasheetId');
  });

  const getDatasheetInfoInputMetaContext = (eventType: string) => {
    const key =
      eventType == EventTypeEnums.RecordMatchesConditions
        ? `${EventTypeEnums.RecordMatchesConditions}@${OFFICIAL_SERVICE_SLUG}`
        : `${EventTypeEnums.RecordCreated}@${OFFICIAL_SERVICE_SLUG}`;
    return getCommonMetaContext({ [key]: 'triggerTypeId' }, getDatasheetInfoInput());
  };

  it('given record created context when handle record created trigger then should no be throw', async() => {
    await expect(
      triggerEventHelper.recordCreatedTriggerHandler(getCommonEventContext(), getDatasheetInfoInputMetaContext(EventTypeEnums.RecordCreated)),
    ).resolves.not.toThrow();
  });

  it('given un match condition context when handle record match conditions trigger then should no be throw', async() => {
    await expect(
      triggerEventHelper.recordMatchConditionsTriggerHandler(
        getCommonEventContext(),
        getDatasheetInfoInputMetaContext(EventTypeEnums.RecordMatchesConditions),
      ),
    ).resolves.not.toThrow();
  });

  it('given match condition context when handle record match conditions trigger then should no be throw', async() => {
    await expect(
      triggerEventHelper.recordMatchConditionsTriggerHandler(
        getCommonEventContext(
          ['fieldId'],
          {
            fieldId: [{ text: 'value' }],
          },
          getCommonState(),
        ),
        getCommonMetaContext(
          { [`${EventTypeEnums.RecordMatchesConditions}@${OFFICIAL_SERVICE_SLUG}`]: 'triggerTypeId' },
          getRecordMatchConditionalTriggers()[0]!.input,
        ),
      ),
    ).resolves.not.toThrow();
  });

  it('given trigger without input when render triggers then return empty list', () => {
    const triggers = [getTrigger(undefined)] as AutomationTriggerEntity[];
    const renderCreatedTriggers = triggerEventHelper.getRenderTriggers(EventTypeEnums.RecordCreated, triggers, {} as CommonEventContext);
    expect(renderCreatedTriggers).toBeDefined();
    expect(renderCreatedTriggers.length).toEqual(0);
    const renderMatchConditionsTriggers = triggerEventHelper.getRenderTriggers(
      EventTypeEnums.RecordMatchesConditions,
      triggers,
      {} as CommonEventContext,
    );
    expect(renderMatchConditionsTriggers).toBeDefined();
    expect(renderMatchConditionsTriggers.length).toEqual(0);
  });

  it('given a conditional trigger when render create record trigger then get list whose length is 1', () => {
    const renderConditionalCreatedTriggers = triggerEventHelper.getRenderTriggers(
      EventTypeEnums.RecordCreated,
      [getTrigger(getDatasheetInfoInput())] as AutomationTriggerEntity[],
      getCommonEventContext(),
    );
    expect(renderConditionalCreatedTriggers).toBeDefined();
    expect(renderConditionalCreatedTriggers.length).toEqual(1);
  });

  it('given a conditional trigger when render match conditional trigger then get list whose length is 1', () => {
    const renderConditionalMatchConditionsTriggers = triggerEventHelper.getRenderTriggers(
      EventTypeEnums.RecordMatchesConditions,
      getRecordMatchConditionalTriggers(),
      getCommonEventContext(
        ['fieldId'],
        {
          fieldId: [{ text: 'value' }],
        },
        getCommonState(),
      ),
    );
    expect(renderConditionalMatchConditionsTriggers).toBeDefined();
    expect(renderConditionalMatchConditionsTriggers.length).toEqual(1);
  });

  it('given a conditional trigger when render match unconditional trigger then get empty list', () => {
    const renderUnConditionalMatchConditionsTriggers = triggerEventHelper.getRenderTriggers(
      EventTypeEnums.RecordMatchesConditions,
      getRecordMatchConditionalTriggers(),
      getCommonEventContext(
        ['fieldId'],
        {
          diffFieldId: [{ text: 'value' }],
        },
        getCommonState(),
      ),
    );
    expect(renderUnConditionalMatchConditionsTriggers).toBeDefined();
    expect(renderUnConditionalMatchConditionsTriggers.length).toEqual(0);
  });
});
