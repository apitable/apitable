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

import { credentials } from '@grpc/grpc-js';
import { HttpService } from '@nestjs/axios';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientGrpcProxy } from '@nestjs/microservices';
import { InvalidGrpcServiceException } from '@nestjs/microservices/errors/invalid-grpc-service.exception';
import { Cron } from '@nestjs/schedule';
import { isFunction } from 'lodash';
import { Observable } from 'rxjs';
import { isDev, randomNum } from 'socket/common/helper';
import { GatewayConstants } from 'socket/constants/gateway.constants';
import { HealthConstants } from 'socket/constants/health.constants';
import { RedisConstants } from 'socket/constants/redis-constants';
import { SocketConstants } from 'socket/constants/socket-constants';
import { RedisService } from 'socket/service/redis/redis.service';

/**
 * @deprecated
 * - reasons not recommended：
 *
 *  1.Deprecated method, this mode is not used after removing xxl-job
 *
 *  2.Using Kubernetes, it is not very useful to check the load balancing externally after elastic scaling
 *
 * - remark:
 *
 *  can be deleted after completely removing xxl-job
 */
@Injectable()
export class VikaGrpcClientProxyXxlJob extends ClientGrpcProxy implements OnApplicationBootstrap {
  protected readonly redisService: RedisService;
  protected readonly clientCredentials;
  private _currentClientUrl;
  clientIps: Set<string>;
  private readonly httpService: HttpService;

  constructor(props) {
    super(props);
    this.redisService = props.proxyClient;
    this.clientCredentials = credentials.createInsecure();
    this.clientIps = new Set();
    this.httpService = props.httpService;
  }

  async onApplicationBootstrap(): Promise<any> {
    this.logger.log('Current health check mode：XXL_JOB');
    /*
     * Client subscribed to the pipeline, can not use the rest of the commands outside the pipeline, so here you need to turn on duplicate()
     * If you don't turn it on, the client will get an exception: Connection in subscriber mode, only subscriber commands may be used
     * Reference: https://redis.io/commands/subscribe
     */
    const redis = this.redisService.getClient().duplicate();
    redis.subscribe(RedisConstants.VIKA_NEST_CHANNEL, (err, count) => {
      if (err) {
        this.logger.error('SubscribedError', err?.stack);
      } else {
        this.logger.log({ message: 'SubscribedSuccessful', channel: RedisConstants.VIKA_NEST_CHANNEL, count });
      }
    });

    redis.on('message', (channel, message) => {
      this.logger.log({ channel, message });
      const nestMessage: INestMessage = JSON.parse(message);
      this.handleNestMessage(nestMessage);
    });

    await this.refreshNestClient();
  }

  @Cron(HealthConstants.NEST_HEALTH_CHECK_CRON_EXPRESSION)
  async handleNestIp() {
    try {
      const nestClientInfo = await this.refreshNestClient();
      this.logger.log(`Available IP Pools：${nestClientInfo?.healthIps?.length ? nestClientInfo.healthIps : 'None'}`);
    } catch (e) {
      this.logger.error('Listening for nest health Ip pool task exception', e?.stack);
    }
  }

  getService<T extends {}>(name: string): T {
    const grpcClient = this.createdDynamicClientByServiceName(name);
    const clientRef = this.getClient(name);
    if (!clientRef) {
      throw new InvalidGrpcServiceException();
    }
    const protoMethods = Object.keys(clientRef[name].prototype);
    const grpcService = {};
    protoMethods.forEach(m => {
      const key = m[0].toLowerCase() + m.slice(1, m.length);
      grpcService[key] = this.createAsyncUnaryServiceMethod(grpcClient, m);
    });
    return grpcService as T;
  }

  createdDynamicClientByServiceName(name: string) {
    const clientRef = this.getClient(name);
    if (!clientRef) {
      throw new InvalidGrpcServiceException();
    }
    const maxSendMessageLengthKey = 'grpc.max_send_message_length';
    const maxReceiveMessageLengthKey = 'grpc.max_receive_message_length';
    const maxMessageLengthOptions = {
      [maxSendMessageLengthKey]: this.getOptionsProp(this.options, 'maxSendMessageLength',
        SocketConstants.GRPC_DEFAULT_MAX_SEND_MESSAGE_LENGTH),
      [maxReceiveMessageLengthKey]: this.getOptionsProp(this.options, 'maxReceiveMessageLength',
        SocketConstants.GRPC_DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH),
    };
    const maxMetadataSize = this.getOptionsProp(this.options, 'maxMetadataSize', -1);
    if (maxMetadataSize > 0) {
      maxMessageLengthOptions['grpc.max_metadata_size'] = maxMetadataSize;
    }
    const keepaliveOptions = this.getKeepaliveOptions();
    const options = Object.assign(Object.assign(Object.assign({}, this.options.channelOptions || {}), maxMessageLengthOptions), keepaliveOptions);
    const client = () => {
      this._currentClientUrl = this.getHealthServerEndpoint();
      return new clientRef[name](this._currentClientUrl, this.clientCredentials, options);
    };
    this.clients.set(name, client);
    return client;
  }

  getHealthServerEndpoint(): string {
    if (!this.clientIps.size || isDev()) {
      this.logger.warn(`empty nest server，fallback as default：${GatewayConstants.ROOM_GRPC_URL}`);
      return GatewayConstants.ROOM_GRPC_URL;
    }
    const ips = Array.from(this.clientIps);
    const index = randomNum(0, ips.length - 1);
    const ip = ips[index];
    return `${ip}:${GatewayConstants.NEST_GRPC_PORT}`;
  }

  createAsyncUnaryServiceMethod(client, methodName) {
    return (...args) => {
      const localClient = client();
      const isRequestStream = localClient[methodName].requestStream;
      const upstreamSubjectOrData = args[0];
      const isUpstreamSubject = upstreamSubjectOrData && isFunction(upstreamSubjectOrData.subscribe);
      if (isRequestStream && isUpstreamSubject) {
        return new Observable(observer => {
          const callArgs = [
            (error, data) => {
              if (error) {
                return observer.error(error);
              }
              observer.next(data);
              observer.complete();
            },
          ];
          const maybeMetadata = args[1];
          if (maybeMetadata) {
            callArgs.unshift(maybeMetadata);
          }
          const call = localClient[methodName](...callArgs);
          upstreamSubjectOrData.subscribe(
            val => call.write(val),
            err => call.emit('error', err),
            () => call.end(),
          );
        });
      }
      return new Observable(observer => {
        localClient[methodName](...args, (error, data) => {
          if (error) {
            return observer.error(error);
          }
          observer.next(data);
          observer.complete();
        });
      });
    };
  }

  /**
   * refresh locally available client
   */
  async refreshNestClient(): Promise<INestClientInfo> {
    const redis = this.redisService.getClient();

    const checkIps = await redis.smembers(RedisConstants.VIKA_NEST_LOAD_KEY_V2);
    if (!checkIps.length) {
      this.logger.warn('NestServer is not registered, please check if NestServer is started?');
      return;
    }

    const healthIps = await redis.zrange(RedisConstants.VIKA_NEST_LOAD_HEALTH_KEY_V2, 0, -1);
    if (!healthIps.length) {
      this.logger.warn(`empty nest server，fallback as default：${GatewayConstants.ROOM_GRPC_URL}`);
    }

    const unHealthIps = await redis.hkeys(RedisConstants.VIKA_NEST_LOAD_UNHEALTH_KEY_V2);

    const checkIpsSet = new Set(checkIps);

    const validHealthIps = [];

    const deprecatedHealthIps = [];
    for (const v of healthIps) {
      if (checkIpsSet.has(v)) {
        validHealthIps.push(v);
      } else {
        deprecatedHealthIps.push(v);
      }

    }
    if (deprecatedHealthIps.length) {
      await redis.zrem(RedisConstants.VIKA_NEST_LOAD_HEALTH_KEY_V2, deprecatedHealthIps)
        .then(r => this.logger.log(`Remove the deprecated client IP:[${deprecatedHealthIps}]，result：${r}`));
    }

    this.clientIps = new Set(validHealthIps);

    if (!healthIps.length) {
      this.logger.warn('EmptyHealthNestEndpoints');
    }
    return { healthIps: validHealthIps, unHealthIps: unHealthIps };
  }

  async handleNestMessage(message: INestMessage) {
    const redisClient = this.redisService.getClient();
    const ip = message.ip;
    // Register, add ip
    if (message.action) {
      // Use a collection of storage ip, improve the efficiency of redis
      try {
        await redisClient.sadd(RedisConstants.VIKA_NEST_LOAD_KEY_V2, ip);
        // Successful service startup default means healthy, append to healthy Ip pool, `1` means available level
        await redisClient.zadd(RedisConstants.VIKA_NEST_LOAD_HEALTH_KEY_V2, 1, ip);
        this.clientIps.add(ip);
        this.logger.log({ message: 'grpc client add success', ips: Array.from(this.clientIps) });
      } catch (e) {
        this.logger.error({ message: e?.message, ips: Array.from(this.clientIps) }, e?.stack);
      }
    } else {
      // nest restart, disconnect, delete ip
      try {
        // IP removal from the pool to be detected
        await redisClient.srem(RedisConstants.VIKA_NEST_LOAD_KEY_V2, ip);
        // IP Removal from Health Pool
        await redisClient.zrem(RedisConstants.VIKA_NEST_LOAD_HEALTH_KEY_V2, ip);
        // IP removed from unhealthy pool
        await redisClient.hdel(RedisConstants.VIKA_NEST_LOAD_UNHEALTH_KEY_V2, ip);
        // Need to delete the local
        this.clientIps.delete(ip);
        this.logger.log({ message: 'grpc client remove success', ips: Array.from(this.clientIps) });
      } catch (e) {
        this.logger.error({ message: e?.message, ips: Array.from(this.clientIps) }, e?.stack);
      }
    }
  }

  get currentClientUrl() {
    return this._currentClientUrl;
  }
}

interface INestMessage {
  ip: string;
  action: number;
}

interface INestClientInfo {
  healthIps: string[],
  unHealthIps?: string[],
}
