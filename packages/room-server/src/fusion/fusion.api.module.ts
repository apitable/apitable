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

import { CacheModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AttachmentField, AutoNumberField, CheckboxField, CreatedByField, CreatedTimeField, CurrencyField, DateTimeField, EmailField, FormulaField,
  LastModifiedByField, LastModifiedTimeField, LinkField, LookUpField, MemberField, MultiSelectField, NumberField, PercentField, PhoneField,
  RatingField, SingleSelectField, SingleTextField, TextField, UrlField,
} from 'fusion/field';
import { CacheConfigService } from 'shared/cache/cache.config.service';
import { ApiRequestMiddleware } from './middleware/api.request.middleware';
import { NodeRateLimiterMiddleware } from 'shared/middleware/node.rate.limiter.middleware';
import { FusionApiController } from './fusion.api.controller';
import { ApiUsageRepository } from './repositories/api.usage.repository';
import { DatabaseModule } from 'database/database.module';
import { FusionApiRecordService } from './services/fusion.api.record.service';
import { FusionApiService } from './services/fusion.api.service';
import { DataBusService } from './services/databus/databus.service';
import { NodePermissionGuard } from './middleware/guard/node.permission.guard';
import { QueryPipe } from './middleware/pipe/query.pipe';
import { FieldPipe } from './middleware/pipe/field.pipe';
import { ApiAuthGuard } from './middleware/guard/api.auth.guard';
import { FusionApiTransformer } from './transformer/fusion.api.transformer';
import { DatasheetRecordRepository } from 'database/datasheet/repositories/datasheet.record.repository';
import { FusionApiFilter } from './filter/fusion.api.filter';
import { UnitMemberRepository } from 'unit/repositories/unit.member.repository';
import { UserModule } from 'user/user.module';
import { NodeModule } from 'node/node.module';
import { UnitModule } from 'unit/unit.module';

@Module({
  imports: [
    DatabaseModule,
    NodeModule,
    UserModule,
    UnitModule,
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    TypeOrmModule.forFeature([
      ApiUsageRepository,
      // TODO(Troy): stop using other modules's repositories, use service instead, via importing the module
      DatasheetRecordRepository,
      UnitMemberRepository,
    ]),
  ],
  controllers: [FusionApiController],
  providers: [
    FusionApiRecordService,
    FusionApiService,
    DataBusService,
    QueryPipe,
    FieldPipe,
    ApiAuthGuard,
    NodePermissionGuard,
    // field service
    AttachmentField,
    AutoNumberField,
    CheckboxField,
    CreatedByField,
    CreatedTimeField,
    CurrencyField,
    DateTimeField,
    EmailField,
    FormulaField,
    LastModifiedByField,
    LastModifiedTimeField,
    LinkField,
    LookUpField,
    MemberField,
    MultiSelectField,
    NumberField,
    PercentField,
    PhoneField,
    RatingField,
    SingleSelectField,
    SingleTextField,
    TextField,
    UrlField,
    FusionApiTransformer,
    FusionApiFilter,
  ],
})
export class FusionApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiRequestMiddleware, NodeRateLimiterMiddleware).forRoutes(FusionApiController);
  }
}
