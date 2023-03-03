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

import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationTriggerTypeRepository } from './automation.trigger.type.repository';
import { AutomationTriggerTypeEntity } from '../entities/automation.trigger.type.entity';
import { DeepPartial } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfigService } from 'shared/services/config/database.config.service';

describe('AutomationTriggerTypeRepository', () => {
  let module: TestingModule;
  let repository: AutomationTriggerTypeRepository;
  const theServiceId = 'serviceId';
  const theTriggerTypeId = 'triggerTypeId';
  const theEndpoint = 'endpoint';
  let entity: AutomationTriggerTypeEntity;

  beforeAll(async() => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
          useClass: DatabaseConfigService,
        }),
        TypeOrmModule.forFeature([AutomationTriggerTypeRepository]),
      ],
      providers: [AutomationTriggerTypeRepository],
    }).compile();

    repository = module.get<AutomationTriggerTypeRepository>(AutomationTriggerTypeRepository);
  });

  beforeEach(async() => {
    const triggerType: DeepPartial<AutomationTriggerTypeEntity> = {
      serviceId: theServiceId,
      triggerTypeId: theTriggerTypeId,
      endpoint: theEndpoint,
      inputJSONSchema: {},
    };
    const record = repository.create(triggerType);
    entity = await repository.save(record);
  });

  afterAll(async() => {
    await repository.manager.connection.close();
  });

  afterEach(async() => {
    await repository.delete(entity.id);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('given a RecordMatchesConditions trigger type entity when get it by endpoint then should be got it', async() => {
    const triggerTypeServiceRelDtos = await repository.getTriggerTypeServiceRelByEndPoint(theEndpoint);
    expect(triggerTypeServiceRelDtos).toBeDefined();
    expect(triggerTypeServiceRelDtos.length).toEqual(1);
    expect(triggerTypeServiceRelDtos[0]!.serviceId).toEqual(theServiceId);
    expect(triggerTypeServiceRelDtos[0]!.triggerTypeId).toEqual(theTriggerTypeId);
  });

  it('given a RecordMatchesConditions trigger type entity when get it by endpoint then should be got it', async() => {
    const triggerTypeServiceRelWithEndpointDtos = await repository.getTriggerTypeServiceRelByEndPoints([theEndpoint]);
    expect(triggerTypeServiceRelWithEndpointDtos).toBeDefined();
    expect(triggerTypeServiceRelWithEndpointDtos.length).toEqual(1);
    expect(triggerTypeServiceRelWithEndpointDtos[0]!.serviceId).toEqual(theServiceId);
    expect(triggerTypeServiceRelWithEndpointDtos[0]!.triggerTypeId).toEqual(theTriggerTypeId);
    expect(triggerTypeServiceRelWithEndpointDtos[0]!.endpoint).toEqual(theEndpoint);
  });

  it('should be get inputJsonSchema by trigger type id.', async() => {
    const inputJsonSchema = await repository.selectInputJsonSchemaById(theTriggerTypeId);
    expect(inputJsonSchema).toBeDefined();
    expect(inputJsonSchema!.triggerTypeId).toEqual(theTriggerTypeId);
    expect(inputJsonSchema!.inputJSONSchema).toEqual({});
  });
});
