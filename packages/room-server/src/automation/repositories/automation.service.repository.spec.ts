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
import { AutomationServiceRepository } from './automation.service.repository';
import { AutomationServiceEntity } from '../entities/automation.service.entity';
import { DeepPartial } from 'typeorm';
import { OFFICIAL_SERVICE_SLUG } from '../events/helpers/trigger.event.helper';
import { DatabaseConfigService } from 'shared/services/config/database.config.service';
import { ConfigModule } from '@nestjs/config';

describe('AutomationServiceRepository', () => {
  let module: TestingModule;
  let automationServiceRepository: AutomationServiceRepository;
  const theServiceId = 'theServiceId';
  let entity: AutomationServiceEntity;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
          useClass: DatabaseConfigService,
        }),
        TypeOrmModule.forFeature([AutomationServiceRepository]),
      ],
      providers: [AutomationServiceRepository],
    }).compile();

    automationServiceRepository = module.get<AutomationServiceRepository>(AutomationServiceRepository);
    const service: DeepPartial<AutomationServiceEntity> = {
      serviceId: theServiceId,
      slug: OFFICIAL_SERVICE_SLUG,
    };
    const record = automationServiceRepository.create(service);
    entity = await automationServiceRepository.save(record);
  });

  afterAll(async () => {
    await automationServiceRepository.delete(entity.id);
    await automationServiceRepository.manager.connection.close();
  });

  it('should be defined', () => {
    expect(automationServiceRepository).toBeDefined();
  });

  it("given one official service entity when judge whether the service id is the official service's id", async () => {
    const number = await automationServiceRepository.countOfficialServiceByServiceId(entity.serviceId);
    expect(number).toEqual(1);
  });

  it('given one official service entity when judge whether the service with the special service id and service slug exist', async () => {
    const number = await automationServiceRepository.countServiceByServiceIdAndSlug(entity.serviceId, OFFICIAL_SERVICE_SLUG);
    expect(number).toEqual(1);
  });
});
