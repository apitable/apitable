import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { generateRandomString } from '@apitable/core';
import { isProdMode } from 'app.environment';
import {
  AUTHORIZATION_PREFIX, DATASHEET_ENRICH_SELECT_FIELD, DATASHEET_HTTP_DECORATE, DATASHEET_LINKED, DATASHEET_MEMBER_FIELD,
  DATASHEET_META_HTTP_DECORATE, NODE_INFO, REQUEST_AT, REQUEST_HOOK_FOLDER, REQUEST_HOOK_PRE_NODE, REQUEST_ID, SERVER_TIME
  , SPACE_ID_HTTP_DECORATE, SwaggerConstants, USER_HTTP_DECORATE,
} from '../common';
import { FusionApiVersion } from '../enums';
import { FastifyInstance } from 'fastify';
import {
  CheckboxFieldPropertyDto, CurrencyFieldPropertyDto, DateTimeFieldPropertyDto, FormulaFieldPropertyDto, LinkFieldPropertyDto, LookupFieldPropertyDto,
  MemberFieldPropertyDto, NumberFieldPropertyDto, RatingFieldPropertyDto, SelectFieldPropertyDto, SingleTextPropertyDto, UserPropertyDto,
} from '../../fusion/dtos/field.property.dto';
import { NodeRepository } from '../../datasheet/repositories/node.repository';
import { DatasheetMetaService } from 'datasheet/services/datasheet/datasheet.meta.service';
import { DatasheetService } from 'datasheet/services/datasheet/datasheet.service';
import { DatasheetServiceModule } from '../../datasheet/_modules/datasheet.service.module';
import { DeveloperService } from 'datasheet/services/developer/developer.service';
import { DeveloperServiceModule } from '../../datasheet/_modules/developer.service.module';
import { ResourceServiceModule } from '../../datasheet/_modules/resource.service.module';

export const initSwagger = (app: INestApplication) => {
  // 生产环境不启用
  if (!isProdMode) {
    const options = new DocumentBuilder()
      .setTitle(SwaggerConstants.TITLE)
      .setDescription(SwaggerConstants.DESCRIPTION)
      .setVersion(FusionApiVersion.V10)
      .addBearerAuth({
        type: 'http',
        description: '开发者token',
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
        FormulaFieldPropertyDto
      ],
    });
    SwaggerModule.setup('nest/docs', app, document);
  }
};

export const initHttpHook = (app: INestApplication) => {
  const fastify = app.getHttpAdapter().getInstance() as FastifyInstance;
  fastify.decorateRequest(USER_HTTP_DECORATE, null);
  fastify.decorateRequest(DATASHEET_META_HTTP_DECORATE, null);
  fastify.decorateRequest(DATASHEET_LINKED, null);
  fastify.decorateRequest(DATASHEET_ENRICH_SELECT_FIELD, null);
  fastify.decorateRequest(DATASHEET_MEMBER_FIELD, null);
  // todo REQUEST_ID 接入网关之后应该从网关直接返回 保证api经过的服务都能追踪
  // todo 接入多语言
  fastify.decorateRequest(REQUEST_ID, null);
  fastify.decorateRequest(REQUEST_AT, null);

  fastify.addHook('preHandler', async request => {
    request[REQUEST_AT] = Date.now();
    request[REQUEST_ID] = generateRandomString();
    if (request.headers.authorization) {
      const developerService = app.select(DeveloperServiceModule).get(DeveloperService);
      request[USER_HTTP_DECORATE] = await developerService.getUserInfoByApiKey(request.headers.authorization.substr(AUTHORIZATION_PREFIX.length));
    }
    if (request.params['spaceId']) {
      request[SPACE_ID_HTTP_DECORATE] = request.params['spaceId'];
    }
    if (request.params['nodeId']) {
      const nodeRepository = app.select(ResourceServiceModule).get(NodeRepository);
      const nodeInfo = await nodeRepository.getNodeInfo(request.params['nodeId']);
      request[NODE_INFO] = nodeInfo;
      request[SPACE_ID_HTTP_DECORATE] = nodeInfo.spaceId;
    }
    // datasheetId参数只有在fusion api controller里定义（:datasheetId）
    if (request.params['datasheetId']) {
      const datasheetService = app.select(DatasheetServiceModule).get(DatasheetService);
      const datasheet = await datasheetService.getDatasheet(request.params['datasheetId']);
      if (datasheet) {
        // TODO 待优化
        request[DATASHEET_HTTP_DECORATE] = datasheet;
        request[SPACE_ID_HTTP_DECORATE] = datasheet.spaceId;
        const metaService = app.select(DatasheetServiceModule).get(DatasheetMetaService);
        request[DATASHEET_META_HTTP_DECORATE] = await metaService.getMetaDataByDstId(request.params['datasheetId']);
        request[DATASHEET_LINKED] = {};
        request[DATASHEET_ENRICH_SELECT_FIELD] = {};
        request[DATASHEET_MEMBER_FIELD] = new Set();
      }
    }
    if (request.body && request.body['folderId']) {
      const nodeRepository = app.select(ResourceServiceModule).get(NodeRepository);
      const folderId = request.body['folderId'];
      const folder = await nodeRepository.getNodeInfo(folderId);
      request[REQUEST_HOOK_FOLDER] = folder;

    }
    if (request.body && request.body['preNodeId']) {
      const nodeRepository = app.select(ResourceServiceModule).get(NodeRepository);
      const preNodeId = request.body['preNodeId'];
      const preNode = await nodeRepository.getNodeInfo(preNodeId);
      request[REQUEST_HOOK_PRE_NODE] = preNode;
    }
    return;
  });
  fastify.addHook('onSend', (request, reply, payload, done) => {
    // 头部加入request-id
    // todo 接入网关之后应该从网关直接返回 保证api经过的服务都能追踪
    reply.header(REQUEST_ID, request[REQUEST_ID]);
    const serverTime = Date.now() - request[REQUEST_AT];
    reply.header(SERVER_TIME, 'total;dur=' + serverTime);
    done();
  });
};
