import { credentials } from '@grpc/grpc-js';
import { HttpService } from '@nestjs/axios';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientGrpcProxy } from '@nestjs/microservices';
import { InvalidGrpcServiceException } from '@nestjs/microservices/errors/invalid-grpc-service.exception';
import { Cron } from '@nestjs/schedule';
import { isFunction } from 'lodash';
import { lastValueFrom, Observable } from 'rxjs';
import { isDev, randomNum } from 'src/socket/common/helper';
import { GatewayConstants } from 'src/socket/constants/gateway.constants';
import { HealthConstants } from 'src/socket/constants/health.constants';
import { RedisConstants } from 'src/socket/constants/redis-constants';
import { SocketConstants } from 'src/socket/constants/socket-constants';
import { RedisService } from 'src/socket/service/redis/redis.service';
import * as util from 'util';

@Injectable()
export class VikaGrpcClientProxy extends ClientGrpcProxy implements OnApplicationBootstrap {
  protected readonly redisService: RedisService;
  protected readonly clientOptions;
  protected readonly clientCredentials;
  private _currentClientUrl;
  private readonly clientIps: Set<string>;
  private readonly httpService: HttpService;

  constructor(props) {
    super(props);
    this.redisService = props.proxyClient;
    this.clientCredentials = credentials.createInsecure();
    this.clientIps = new Set();
    this.httpService = props.httpService;
  }

  async onApplicationBootstrap(): Promise<any> {
    this.logger.log('Current health check mode: DEFAULT');
    const redis = this.redisService.getClient().duplicate();
    redis.subscribe(RedisConstants.VIKA_NEST_CHANNEL, (err, count) => {
      if (err) {
        this.logger.error('SubscribedError', err?.stack);
      } else {
        this.logger.log({ message: 'SubscribedSuccessful', channel: RedisConstants.VIKA_NEST_CHANNEL, count });
      }
    });
    // 用于处理nest的启动和停止
    redis.on('message', (channel, message) => {
      this.logger.log({ channel, message });
      const nestMessage: INestMessage = JSON.parse(message);
      this.handleNestMessage(nestMessage);
    });
    // 用于处理socket的重启
    await this.syncNestClient();
  }

  /**
   * timed task
   */
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

    this.logger.log(`可用IP池：${this.clientIps?.size ? Array.from(this.clientIps) : '无'}`);
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
      // If no healthy ip is available, return to the default configuration directly
      this.logger.warn(`empty nest server，fallback as default：${GatewayConstants.NEST_GRPC_URL}`);
      return GatewayConstants.NEST_GRPC_URL;
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
      this.logger.warn('NestServer没有注册，请确认NestServer是否启动?');
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
      // todo 邮件通知？
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
      // 在unhealth中的不需要处理
      if (exists) {
        const number = await redis.incr(healthKey);
        if (number > GatewayConstants.GRPC_TIMEOUT_MAX_TIMES) {
          // 移入unhealth
          await redis.del(healthKey);
          await redis.setnx(this.getLoadUnHealthKey(ip), number);
          // 需要删除本地的
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
      // 初始化为1
      if (number === 1) {
        // 移入health中
        await redis.del(unHealthKey);
        await redis.setnx(this.getLoadHealthKey(ip), number);
        // 之前是不健康的，已经在本地删除了
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
    // 注册,新增ip
    if (message.action) {
      // 采用集合存储ip，提高redis的效率
      try {
        await redisClient.sadd(RedisConstants.VIKA_NEST_LOAD_KEY, ip);
        await redisClient.setnx(this.getLoadHealthKey(ip), 1);
        this.clientIps.add(ip);
        this.logger.log({ message: 'nest注册成功', ips: Array.from(this.clientIps) });
      } catch (e) {
        this.logger.error({ ips: Array.from(this.clientIps) }, e?.stack);
      }
    } else {
      // nest重启，断开,删除ip
      try {
        await redisClient.srem(RedisConstants.VIKA_NEST_LOAD_KEY, ip);
        await redisClient.del(this.getLoadUnHealthKey(ip));
        await redisClient.del(this.getLoadHealthKey(ip));
        // 需要删除本地的
        this.clientIps.delete(ip);
        this.logger.log({ message: 'nest删除成功', ips: Array.from(this.clientIps) });
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
