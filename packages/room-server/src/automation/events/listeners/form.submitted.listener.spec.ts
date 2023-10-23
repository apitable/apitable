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

import { EventAtomTypeEnums, EventRealTypeEnums, EventSourceTypeEnums, ResourceType } from '@apitable/core';
import { AutomationService } from '../../services/automation.service';
import { RobotTriggerService } from '../../services/robot.trigger.service';
import { TriggerEventHelper } from '../helpers/trigger.event.helper';
import { FormSubmittedListener } from './form.submitted.listener';
import { FormSubmittedEvent, FormSubmittedEventContext } from '../domains/form.submitted.event';
import { WinstonModule } from 'nest-winston';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerConfigService } from 'shared/services/config/logger.config.service';
import { DocumentBaseService } from 'workdoc/services/document.base.service';

describe('FormSubmittedListener', () => {
  let moduleFixture: TestingModule;
  let automationService: AutomationService;
  let robotTriggerService: RobotTriggerService;
  let triggerEventHelper: TriggerEventHelper;
  let formSubmittedListener: FormSubmittedListener;

  beforeEach(async() => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        WinstonModule.forRootAsync({
          useClass: LoggerConfigService,
        }),
      ],
      providers: [
        {
          provide: AutomationService,
          useValue: {
            handleTask: jest.fn(),
          },
        },
        {
          provide: RobotTriggerService,
          useValue: {
            getTriggersByResourceAndEventType: jest.fn(),
          },
        },
        {
          provide: TriggerEventHelper,
          useValue: {
            renderInput: jest.fn(),
          },
        },
        {
          provide: DocumentBaseService,
          useValue: {
            renderInput: jest.fn(),
          },
        },
        FormSubmittedListener,
      ],
    }).compile();

    automationService = moduleFixture.get<AutomationService>(AutomationService);
    robotTriggerService = moduleFixture.get<RobotTriggerService>(RobotTriggerService);
    triggerEventHelper = moduleFixture.get<TriggerEventHelper>(TriggerEventHelper);
    formSubmittedListener = moduleFixture.get<FormSubmittedListener>(FormSubmittedListener);
  });

  afterEach(async() => {
    await moduleFixture.close();
  });

  it('should be defined', () => {
    expect(automationService).toBeDefined();
    expect(robotTriggerService).toBeDefined();
    expect(triggerEventHelper).toBeDefined();
    expect(formSubmittedListener).toBeDefined();
  });

  it('Should not throw', async() => {
    jest
      .spyOn(robotTriggerService, 'getTriggersByResourceAndEventType')
      .mockResolvedValue([{ triggerId: 'triggerId', triggerTypeId: 'triggerTypeId', input: {}, robotId: 'robotId' }]);
    jest.spyOn(triggerEventHelper, 'renderInput').mockReturnValue({ formId: 'formId' });
    jest.spyOn(automationService, 'handleTask');
    await expect(async() => {
      await formSubmittedListener.handleFormSubmittedEvent({
        scope: ResourceType.Form,
        realType: EventRealTypeEnums.REAL,
        atomType: EventAtomTypeEnums.ATOM,
        sourceType: EventSourceTypeEnums.ALL,
        context: {
          datasheetId: 'datasheetId',
          formId: 'formId',
          recordId: 'recordId',
        } as FormSubmittedEventContext,
        beforeApply: false,
      } as FormSubmittedEvent);
    }).not.toThrow();
  });

  it('given trigger without input when render triggers then return empty list', () => {
    const renderTriggers = formSubmittedListener.getRenderTriggers(
      [
        {
          triggerId: 'triggerId',
          triggerTypeId: 'triggerTypeId',
          input: undefined,
          robotId: 'robotId',
        },
      ],
      { formId: 'formId' } as FormSubmittedEventContext,
    );
    expect(renderTriggers).toBeDefined();
    expect(renderTriggers.length).toEqual(0);
  });

  it("given trigger's from id not equals context's from id when render triggers then return empty list", () => {
    jest.spyOn(triggerEventHelper, 'renderInput').mockReturnValue({ formId: 'diffFormId' });
    const renderTriggers = formSubmittedListener.getRenderTriggers(
      [
        {
          triggerId: 'triggerId',
          triggerTypeId: 'triggerTypeId',
          input: {
            type: 'Expression',
            value: { operands: ['formId', { type: 'Literal', value: 'diffFormId' }], operator: 'newObject' },
          },
          robotId: 'robotId',
        },
      ],
      { formId: 'formId' } as FormSubmittedEventContext,
    );
    expect(renderTriggers).toBeDefined();
    expect(renderTriggers.length).toEqual(0);
  });

  it("given trigger's from id equals context's from id when render triggers then return list whose length is 1", () => {
    jest.spyOn(triggerEventHelper, 'renderInput').mockReturnValue({ formId: 'formId' });
    const renderTriggers = formSubmittedListener.getRenderTriggers(
      [
        {
          triggerId: 'triggerId',
          triggerTypeId: 'triggerTypeId',
          input: {
            type: 'Expression',
            value: { operands: ['formId', { type: 'Literal', value: 'formId' }], operator: 'newObject' },
          },
          robotId: 'robotId',
        },
      ],
      { formId: 'formId' } as FormSubmittedEventContext,
    );
    expect(renderTriggers).toBeDefined();
    expect(renderTriggers.length).toEqual(1);
  });
});
