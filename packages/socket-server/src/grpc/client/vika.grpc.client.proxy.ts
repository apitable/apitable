import { credentials } from '@grpc/grpc-js';
import { HttpService } from '@nestjs/axios';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientGrpcProxy } from '@nestjs/microservices';
import { InvalidGrpcServiceException } from '@nestjs/microservices/errors/invalid-grpc-service.exception';
import { Cron } from '@nestjs/schedule';
import { isFunction } from 'lodash';
import { lastValueFrom, Observable } from 'rxjs';
import { isDev, randomNum } from 'socket/common/helper';
import { GatewayConstants } from 'socket/constants/gateway.constants';
import { HealthConstants } from 'socket/constants/health.constants';
import { RedisConstants } from 'socket/constants/redis-constants';
import { SocketConstants } from 'socket/constants/socket-constants';
import { RedisService } from 'socket/service/redis/redis.service';
import * as util from 'util';

@Injectable()
export class VikaGrpcClientProxy extends ClientGrpcProxy implements OnApplicationBootstrap {
  private _currentClientUrl;

  protected readonly redisService: RedisService;
  private readonly httpService: HttpService;
  protected readonly clientCredentials;
  private readonly clientIps: Set<string>;

  constructor(props) {
    super(props);
    this.redisService = props.proxyClient;
    this.clientCredentials = credentials.createInsecure();
    this.clientIps = new Set();
    this.httpService = props.httpService;
  }

  async onApplicationBootstrap(): Promise<any> {
    this.logger.log('Current health check mode: DEFAULT');
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
    // Used to handle the start and stop of nest
    redis.on('message', (channel, message) => {
      this.logger.log({ channel, message });
      const nestMessage: INestMessage = JSON.parse(message);
      this.handleNestMessage(nestMessage);
    });
    // Used to handle socket restarts
    await this.syncNestClient();
  }

  @Cron(HealthConstants.NEST_HEALTH_CHECK_CRON_EXPRESSION)
  async handleNestIp() {
    const redis = this.redisService.getClient();
    const remoteIps = await redis.smembers(RedisConstants.VIKA_NEST_LOAD_KEY);
    for (const ip of remoteIps) {
      try {
        const config = {
          // 1s
          timeout: HealthConstants.NEST_HEALTH_CHECK_TIMEOUT,
        };
        const result: any = await lastValueFrom(this.httpService.get(`http://${ip}:3333/actuator/health`, config));
        if (result.status === 200) {
          await this.handleHealth(ip);
        } else {
          await this.handleUnHealth(ip);
        }
        // logger('NestHealthCheck').debug({ ip, status: result.status });
      } catch (e) {
        this.logger.error(`ping grpc client ip:[${ip}] timeout, ping code:[${e.code}]`, e?.stack);
        // ETIMEDOUT,ECONNREFUSED service is no longer available
        await this.handleUnHealth(ip, this.isServerReachable(e.code));
      }
    }

    this.logger.log(`Available IP Pools：${this.clientIps?.size ? Array.from(this.clientIps) : 'None'}`);
  }

  private isServerReachable(code: string) {
    const unreachableCodes = ['ETIMEDOUT', 'ECONNREFUSED', 'EHOSTUNREACH'];
    return !unreachableCodes.includes(code);
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
      [maxSendMessageLengthKey]: this.getOptionsProp(this.options, 'maxSendMessageLength', SocketConstants.GRPC_DEFAULT_MAX_SEND_MESSAGE_LENGTH),
      [maxReceiveMessageLengthKey]: this.getOptionsProp(
        this.options,
        'maxReceiveMessageLength',
        SocketConstants.GRPC_DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH,
      ),
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
      // If no healthy ip is available, return to the default configuration directly
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

  async syncNestClient() {
    const redis = this.redisService.getClient();
    const ips = await redis.smembers(RedisConstants.VIKA_NEST_LOAD_KEY);
    if (!ips.length) {
      this.logger.warn('NestServer is not registered, please check if NestServer is started?');
      return;
    }
    const healthIps = [];
    for (const ip of ips) {
      const exists = await redis.exists(this.getLoadHealthKey(ip));
      if (exists) {
        this.clientIps.add(ip);
        healthIps.push(ip);
      }
    }
    if (!healthIps.length) {
      this.logger.warn('EmptyHealthNestEndpoints');
    } else {
      this.logger.log(`NestHealthEndpoints ${healthIps}`);
    }
  }

  private async handleUnHealth(ip: string, available = true) {
    const redis = this.redisService.getClient();
    if (this.clientIps.has(ip)) {
      const healthKey = this.getLoadHealthKey(ip);
      const exists = await redis.exists(healthKey);
      // in `unhealth` does not need to be processed
      if (exists) {
        const number = await redis.incr(healthKey);
        if (number > GatewayConstants.GRPC_TIMEOUT_MAX_TIMES) {
          // Move to `unhealth`
          await redis.del(healthKey);
          await redis.setnx(this.getLoadUnHealthKey(ip), number);
          // Need to delete the local
          this.clientIps.delete(ip);
        }
      }
    }
    // In the case of unreachable service, room is forced to restart, and there is no pub message before restart
    if (!available) {
      await redis.srem(RedisConstants.VIKA_NEST_LOAD_KEY, ip);
      await redis.del(this.getLoadUnHealthKey(ip));
      await redis.del(this.getLoadHealthKey(ip));
      this.clientIps.delete(ip);
      this.logger.error({ message: 'NestServiceUnAvailable', ip, available });
    }
  }

  private async handleHealth(ip: string) {
    const redis = this.redisService.getClient();
    const unHealthKey = this.getLoadUnHealthKey(ip);
    const exists = await redis.exists(unHealthKey);
    if (exists) {
      const number = await redis.decr(unHealthKey);
      // initialized to 1
      if (number === 1) {
        // move into health
        await redis.del(unHealthKey);
        await redis.setnx(this.getLoadHealthKey(ip), number);
        // It was unhealthy before and has been deleted locally
        if (!this.clientIps.has(ip)) {
          this.clientIps.add(ip);
        }
      }
    }
  }

  getLoadHealthKey(ip: string) {
    return util.format(RedisConstants.VIKA_NEST_LOAD_HEALTH_KEY, ip);
  }

  getLoadUnHealthKey(ip: string) {
    return util.format(RedisConstants.VIKA_NEST_LOAD_UNHEALTH_KEY, ip);
  }

  async handleNestMessage(message: INestMessage) {
    const redisClient = this.redisService.getClient();
    const ip = message.ip;
    // Register, add ip
    if (message.action) {
      // Use a collection of storage ip, improve the efficiency of redis
      try {
        await redisClient.sadd(RedisConstants.VIKA_NEST_LOAD_KEY, ip);
        await redisClient.setnx(this.getLoadHealthKey(ip), 1);
        this.clientIps.add(ip);
        this.logger.log({ message: 'grpc client add success', ips: Array.from(this.clientIps) });
      } catch (e) {
        this.logger.error({ ips: Array.from(this.clientIps) }, e?.stack);
      }
    } else {
      // nest restart, disconnect, delete ip
      try {
        await redisClient.srem(RedisConstants.VIKA_NEST_LOAD_KEY, ip);
        await redisClient.del(this.getLoadUnHealthKey(ip));
        await redisClient.del(this.getLoadHealthKey(ip));
        // Need to delete the local
        this.clientIps.delete(ip);
        this.logger.log({ message: 'grpc client remove success', ips: Array.from(this.clientIps) });
      } catch (e) {
        this.logger.error({ ips: Array.from(this.clientIps) }, e?.stack);
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
