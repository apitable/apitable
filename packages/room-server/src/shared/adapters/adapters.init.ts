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

import { generateRandomString } from '@apitable/core';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { enableSwagger } from 'app.environment';
import { DatabaseModule } from 'database/database.module';
import { NodeRepository } from 'node/repositories/node.repository';
import { DatasheetMetaService } from 'database/datasheet/services/datasheet.meta.service';
import { DatasheetService } from 'database/datasheet/services/datasheet.service';
import { DeveloperService } from 'developer/services/developer.service';
import { FastifyInstance } from 'fastify';
import {
  CheckboxFieldPropertyDto, CurrencyFieldPropertyDto, DateTimeFieldPropertyDto, FormulaFieldPropertyDto, LinkFieldPropertyDto, LookupFieldPropertyDto,
  MemberFieldPropertyDto, NumberFieldPropertyDto, RatingFieldPropertyDto, SelectFieldPropertyDto, SingleTextPropertyDto, UserPropertyDto,
} from 'fusion/dtos/field.property.dto';
import {
  AUTHORIZATION_PREFIX, DATASHEET_ENRICH_SELECT_FIELD, DATASHEET_HTTP_DECORATE, DATASHEET_LINKED, DATASHEET_MEMBER_FIELD,
  DATASHEET_META_HTTP_DECORATE, NODE_INFO, REQUEST_AT, REQUEST_HOOK_FOLDER, REQUEST_HOOK_PRE_NODE, REQUEST_ID, SERVER_TIME, SPACE_ID_HTTP_DECORATE,
  SwaggerConstants, USER_HTTP_DECORATE,
} from '../common';
import { FusionApiVersion } from '../enums';

export const initSwagger = (app: INestApplication) => {
  // wouldn't be enabled in production
  if (enableSwagger) {
    const options = new DocumentBuilder()
      .setTitle(SwaggerConstants.TITLE)
      .setDescription(SwaggerConstants.DESCRIPTION)
      .setVersion(FusionApiVersion.V10)
      .addBearerAuth({
        type: 'http',
        description: 'developer token',
      })
      .addCookieAuth('SESSION')
      .build();
    const document = SwaggerModule.createDocument(app, options, {
      extraModels: [
        SingleTextPropertyDto,
        NumberFieldPropertyDto,
        CurrencyFieldPropertyDto,
        SelectFieldPropertyDto,
        MemberFieldPropertyDto,
        UserPropertyDto,
        CheckboxFieldPropertyDto,
        RatingFieldPropertyDto,
        DateTimeFieldPropertyDto,
        LinkFieldPropertyDto,
        LookupFieldPropertyDto,
        FormulaFieldPropertyDto,
      ],
    });
    SwaggerModule.setup('nest/v1/docs', app, document);
  }
};

export const initHttpHook = (app: INestApplication) => {
  const fastify = app.getHttpAdapter().getInstance() as FastifyInstance;
  fastify.decorateRequest(USER_HTTP_DECORATE, null);
  fastify.decorateRequest(DATASHEET_META_HTTP_DECORATE, null);
  fastify.decorateRequest(DATASHEET_LINKED, null);
  fastify.decorateRequest(DATASHEET_ENRICH_SELECT_FIELD, null);
  fastify.decorateRequest(DATASHEET_MEMBER_FIELD, null);
  // TODO: REQUEST_ID should be returned by api-gateway, so that we could trace all the services
  // TODO: support multiple languages
  fastify.decorateRequest(REQUEST_ID, null);
  fastify.decorateRequest(REQUEST_AT, null);

  fastify.addHook('preHandler', async request => {
    request[REQUEST_AT] = Date.now();
    request[REQUEST_ID] = generateRandomString();
    if (request.headers.authorization) {
      const developerService = app.select(DatabaseModule).get(DeveloperService);
      request[USER_HTTP_DECORATE] = await developerService.getUserInfoByApiKey(request.headers.authorization.substr(AUTHORIZATION_PREFIX.length));
    }
    if ((request.params as any)['spaceId']) {
      request[SPACE_ID_HTTP_DECORATE] = (request.params as any)['spaceId'];
    }
    if ((request.params as any)['nodeId']) {
      const nodeRepository = app.select(DatabaseModule).get(NodeRepository);
      const nodeInfo = await nodeRepository.getNodeInfo((request.params as any)['nodeId']);
      if (nodeInfo) {
        request[NODE_INFO] = nodeInfo;
        request[SPACE_ID_HTTP_DECORATE] = nodeInfo.spaceId;
      }
    }
    // datasheetId param should be defined in the fusion api controller by query parameter(datasheets/:datasheetId)
    if ((request.params as any)['datasheetId']) {
      const datasheetService = app.select(DatabaseModule).get(DatasheetService);
      const datasheet = await datasheetService.getDatasheet((request.params as any)['datasheetId']);
      if (datasheet) {
        // TODO: should be optimized
        request[DATASHEET_HTTP_DECORATE] = datasheet;
        request[SPACE_ID_HTTP_DECORATE] = datasheet.spaceId;
        const metaService = app.select(DatabaseModule).get(DatasheetMetaService);
        request[DATASHEET_META_HTTP_DECORATE] = await metaService.getMetaDataByDstId((request.params as any)['datasheetId']);
        request[DATASHEET_LINKED] = {};
        request[DATASHEET_ENRICH_SELECT_FIELD] = {};
        request[DATASHEET_MEMBER_FIELD] = new Set();
      }
    }
    if (request.body && request.body['folderId']) {
      const nodeRepository = app.select(DatabaseModule).get(NodeRepository);
      const folderId = request.body['folderId'];
      const folder = await nodeRepository.getNodeInfo(folderId);
      request[REQUEST_HOOK_FOLDER] = folder;
    }
    if (request.body && request.body['preNodeId']) {
      const nodeRepository = app.select(DatabaseModule).get(NodeRepository);
      const preNodeId = request.body['preNodeId'];
      const preNode = await nodeRepository.getNodeInfo(preNodeId);
      request[REQUEST_HOOK_PRE_NODE] = preNode;
    }
    return;
  });
  fastify.addHook('onSend', (request, reply, _payload, done) => {
    // add request-id to Headers
    // TODO: REQUEST_ID should be returned by api-gateway, so that we could trace all the services
    reply.header(REQUEST_ID, request[REQUEST_ID]);
    const serverTime = Date.now() - request[REQUEST_AT];
    reply.header(SERVER_TIME, 'total;dur=' + serverTime);
    done();
  });
};
