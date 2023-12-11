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
import { LoggerService } from '@nestjs/common/services/logger.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { Client } from '@sentry/types';
import { disableHSTS, enableHocuspocus, enableSocket, enableSwagger, isDevMode, PROJECT_DIR } from 'app.environment';
import { DatabaseModule } from 'database/database.module';
import { DeveloperService } from 'developer/services/developer.service';
import { FastifyInstance } from 'fastify';
import helmet from 'fastify-helmet';
import fastifyMultipart from 'fastify-multipart';
import {
  ButtonFieldPropertyDto,
  CheckboxFieldPropertyDto,
  CurrencyFieldPropertyDto,
  DateTimeFieldPropertyDto,
  FormulaFieldPropertyDto,
  LinkFieldPropertyDto,
  LookupFieldPropertyDto,
  MemberFieldPropertyDto,
  NumberFieldPropertyDto,
  RatingFieldPropertyDto,
  SelectFieldPropertyDto,
  SingleTextPropertyDto,
  UserPropertyDto,
} from 'fusion/dtos/field.property.dto';
import { protobufPackage } from 'grpc/generated/serving/SocketServingService';
import { HelmetOptions } from 'helmet';
import { NodeRepository } from 'node/repositories/node.repository';
import path, { join } from 'path';
import { APPLICATION_NAME, BootstrapConstants } from 'shared/common/constants/bootstrap.constants';
import { GatewayConstants, SocketConstants } from 'shared/common/constants/socket.module.constants';
import { RedisIoAdapter } from 'socket/adapter/redis/redis-io.adapter';
import { SocketIoService } from 'socket/services/socket-io/socket-io.service';
import { HocuspocusBaseService } from 'workdoc/services/hocuspocus.base.service';
import {
  AUTHORIZATION_PREFIX,
  DATASHEET_ENRICH_SELECT_FIELD,
  DATASHEET_LINKED,
  DATASHEET_MEMBER_FIELD,
  DATASHEET_META_HTTP_DECORATE,
  GRPC_MAX_PACKAGE_SIZE,
  NODE_INFO,
  REQUEST_AT,
  REQUEST_HOOK_FOLDER,
  REQUEST_HOOK_PRE_NODE,
  REQUEST_ID,
  SERVER_TIME,
  SPACE_ID_HTTP_DECORATE,
  SwaggerConstants,
  USER_HTTP_DECORATE,
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
        ButtonFieldPropertyDto,
      ],
    });
    SwaggerModule.setup('nest/v1/docs', app, document);
  }
};

export const initFastify = async (): Promise<FastifyAdapter> => {
  const fastifyAdapter = new FastifyAdapter({ logger: isDevMode, bodyLimit: GRPC_MAX_PACKAGE_SIZE });
  await fastifyAdapter.register(fastifyMultipart as any);
  // register helmet in fastify to avoid conflict with swagger
  let helmetOptions: HelmetOptions = {
    // update script-src to be compatible with swagger
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'base-uri': ["'self'"],
        'block-all-mixed-content': [],
        'font-src': ["'self'", 'https:', 'data:'],
        'frame-ancestors': ["'self'"],
        'img-src': ["'self'", 'data:'],
        'object-src': ["'none'"],
        'script-src': ["'self'", "'unsafe-inline'"],
        'script-src-attr': ["'none'"],
        'style-src': ["'self'", 'https:', "'unsafe-inline'"],
        'upgrade-insecure-requests': [],
      },
    },
  };
  if (disableHSTS) {
    helmetOptions = { ...helmetOptions, hsts: false } as any;
  }
  await fastifyAdapter.register(helmet as any, helmetOptions);

  return fastifyAdapter;
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

  fastify.addHook('preHandler', async (request) => {
    request[REQUEST_AT] = Date.now();
    request[REQUEST_ID] = generateRandomString();
    if (request.headers.authorization && request.headers.authorization.startsWith(AUTHORIZATION_PREFIX)) {
      const developerService = app.select(DatabaseModule).get(DeveloperService);
      const apiKey = request.headers.authorization.slice(AUTHORIZATION_PREFIX.length);
      request[USER_HTTP_DECORATE] = await developerService.getUserInfoByApiKey(apiKey);
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
    if (request.body && request.body['folderId']) {
      const nodeRepository = app.select(DatabaseModule).get(NodeRepository);
      const folderId = request.body['folderId'];
      request[REQUEST_HOOK_FOLDER] = await nodeRepository.getNodeInfo(folderId);
    }
    if (request.body && request.body['preNodeId']) {
      const nodeRepository = app.select(DatabaseModule).get(NodeRepository);
      const preNodeId = request.body['preNodeId'];
      request[REQUEST_HOOK_PRE_NODE] = await nodeRepository.getNodeInfo(preNodeId);
    }
    return;
  });
  fastify.addHook('onSend', (request, reply, _payload, done) => {
    // add request-id to Headers
    // TODO: REQUEST_ID should be returned by api-gateway, so that we could trace all the services
    void reply.header(REQUEST_ID, request[REQUEST_ID]);
    const serverTime = Date.now() - request[REQUEST_AT];
    void reply.header(SERVER_TIME, 'total;dur=' + serverTime);
    done();
  });
};

export const initSentry = (_app: INestApplication) => {
  const sentryDsn = process.env.SENTRY_DSN;

  Sentry.init({
    debug: isDevMode,
    // would not report errors in dev mode
    enabled: Boolean(!isDevMode && sentryDsn),
    dsn: sentryDsn,
    environment: process.env.ENV,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Mysql(),
      new Sentry.Integrations.OnUncaughtException({
        onFatalError: (err) => {
          if (err.name === 'SentryError') {
            console.log(err);
          } else {
            (Sentry.getCurrentHub().getClient<Client>() as Client).captureException(err);
            process.exit(1);
          }
        },
      }),
      new Sentry.Integrations.OnUnhandledRejection({ mode: 'warn' }),
    ],
    ignoreErrors: ['ServerException', 'ApiException'],
  });
};

export const initRoomGrpc = (logger: LoggerService, app: INestApplication) => {
  if ('SOCKET_SERVER' === APPLICATION_NAME) {
    return;
  }
  logger.log(`room grpc url is [${BootstrapConstants.ROOM_GRPC_URL}]`, 'Bootstrap');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: BootstrapConstants.ROOM_GRPC_URL,
      package: [protobufPackage],
      // 100M
      maxSendMessageLength: GRPC_MAX_PACKAGE_SIZE,
      maxReceiveMessageLength: GRPC_MAX_PACKAGE_SIZE,
      protoPath: [join(PROJECT_DIR, 'grpc/generated/serving/RoomServingService.proto'), join(PROJECT_DIR, 'grpc/generated/common/Core.proto')],
      loader: {
        json: true,
      },
    },
  });
};

/*
 *  Required only when the service is started in `socket` mode
 */
export const initSocketGrpc = (logger: LoggerService, app: INestApplication) => {
  if (!enableSocket) {
    return;
  }
  logger.log(`socket grpc url is [${BootstrapConstants.SOCKET_GRPC_URL}]`, 'Bootstrap');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: BootstrapConstants.SOCKET_GRPC_URL,
      package: [protobufPackage],
      maxSendMessageLength: SocketConstants.GRPC_OPTIONS.maxSendMessageLength,
      maxReceiveMessageLength: SocketConstants.GRPC_OPTIONS.maxReceiveMessageLength,
      protoPath: [
        path.join(PROJECT_DIR, 'grpc/generated/serving/SocketServingService.proto'),
        path.join(PROJECT_DIR, 'grpc/generated/common/Core.proto'),
      ],
      loader: {
        json: true,
      },
    },
  });
};

/*
 * Required only when the service is started in `socket` mode
 */
export const initRedisIoAdapter = (app: INestApplication) => {
  if (!enableSocket) {
    return;
  }

  const socketIoService = app.get(SocketIoService);
  // Reduce the number of connections to redis, there is no need to establish a handshake, just establish a connection
  app.useWebSocketAdapter(new RedisIoAdapter(app, socketIoService));
  return app;
};

export const initHocuspocus = (app: INestApplication) => {
  if (!enableHocuspocus) {
    return;
  }
  const hocuspocusBaseService = app.get(HocuspocusBaseService);
  const server = hocuspocusBaseService.init(GatewayConstants.DOCUMENT_PORT);
  server.listen();
};
