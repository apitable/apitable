import { credentials } from '@grpc/grpc-js';
import { HttpService } from '@nestjs/axios';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientGrpcProxy } from '@nestjs/microservices';
import { InvalidGrpcServiceException } from '@nestjs/microservices/errors/invalid-grpc-service.exception';
import { Cron } from '@nestjs/schedule';
import { isFunction } from 'lodash';
import { Observable } from 'rxjs';
import { logger, isDev, randomNum } from 'src/socket/common/helper';
import * as util from 'util';
import { GatewayConstants } from 'src/socket/constants/gateway.constants';
import { HealthConstants } from 'src/socket/constants/health.constants';
import { RedisConstants } from 'src/socket/constants/redis-constants';
import { SocketConstants } from 'src/socket/constants/socket-constants';
import { RedisService } from 'src/socket/service/redis/redis.service';

@Injectable()
export class VikaGrpcClientProxy extends ClientGrpcProxy implements OnApplicationBootstrap {
  protected readonly redisService: RedisService;
  protected readonly clientOptions;
  protected readonly clientCredentials;
  private _currentClientUrl;
  // 保证唯一性
  private readonly clientIps: Set<string>;
  private readonly httpService: HttpService;

  constructor(props) {
    super(props);
    this.redisService = props.proxyClient;
    this.clientCredentials = credentials.createInsecure();
    this.clientIps = new Set();
    this.httpService = props.httpService;
  }

  /**
   * 监听redis的通道信息
   */
  async onApplicationBootstrap(): Promise<any> {
    this.logger.log('Current health check mode: DEFAULT');
    const redis = this.redisService.getClient().duplicate();
    redis.subscribe(RedisConstants.VIKA_NEST_CHANNEL, (err, count) => {
      if (err) {
        logger('SubscribedError').error({ channel: RedisConstants.VIKA_NEST_CHANNEL }, err.message);
      } else {
        logger('SubscribedSuccessful').log({ channel: RedisConstants.VIKA_NEST_CHANNEL, count });
      }
    });
    // 用于处理nest的启动和停止
    redis.on('message', (channel, message) => {
      logger('SubscribedMessage').log({ channel, message });
      const nestMessage: INestMessage = JSON.parse(message);
      this.handleNestMessage(nestMessage);
    });
    // 用于处理socket的重启
    await this.syncNestClient();
  }

  /**
   * 定时任务
   * @return
   * @author Zoe Zheng
   * @date 2021/6/28 4:58 下午
   */
  @Cron(HealthConstants.NEST_HEALTH_CHECK_CRON_EXPRESSION)
  async handleNestIp() {
    const redis = this.redisService.getClient();
    // const localIps = Array.from(this.clientIps);
    const remoteIps = await redis.smembers(RedisConstants.VIKA_NEST_LOAD_KEY);
    // if (localIps.length != remoteIps.length) {
    //   this.logger.error({ localIps, remoteIps }, '本地IP数据源不匹配', '本地IP数据不匹配');
    // }
    for (const ip of remoteIps) {
      try {
        const result: any = await this.httpService
          .get(`http://${ip}:3333/actuator/health`, {
            // 1s
            timeout: HealthConstants.NEST_HEALTH_CHECK_TIMEOUT,
          })
          .toPromise();
        if (result.status === 200) {
          await this.handleHealth(ip);
        } else {
          await this.handleUnHealth(ip);
        }
        logger('NestHealthCheck').debug({ ip, status: result.status });
      } catch (e) {
        logger('NestHealthCheck').error({ ip, errorMessage: e?.message, code: e?.code });
        // ETIMEDOUT,ECONNREFUSED 服务已经不可达
        await this.handleUnHealth(ip, this.isServerReachable(e.code));
      }
    }

    this.logger.log(`可用IP池：${this.clientIps?.size ? this.clientIps : '无'}`);
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
      // 没有可用的健康ip,直接返回默认的配置 todo?
      this.logger.error({}, 'Empty nest server', 'EmptyNestServer');
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
      this.logger.error({}, 'NestServer没有注册，请确认NestServer是否启动', 'EmptyNestServer');
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
      logger('EmptyHealthNestEndpoints').error({ ips });
    } else {
      logger('NestHealthEndpoints').log({ healthIps });
    }
  }

  async handleUnHealth(ip: string, available = true) {
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
    // 处理服务不可达的情况，room强制重启了，在重启之前没有pub消息
    if (!available) {
      await redis.srem(RedisConstants.VIKA_NEST_LOAD_KEY, ip);
      await redis.del(this.getLoadUnHealthKey(ip));
      await redis.del(this.getLoadHealthKey(ip));
      this.clientIps.delete(ip);
      this.logger.error({ ip, available }, 'NestServiceUnAvailable', 'NestServiceUnAvailable');
    }
  }

  async handleHealth(ip: string) {
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
        this.logger.log({ ips: Array.from(this.clientIps) }, 'nest注册成功');
      } catch (e) {
        this.logger.error({ ips: Array.from(this.clientIps) }, e.message, 'nest注册失败');
      }
    } else {
      // nest重启，断开,删除ip
      try {
        await redisClient.srem(RedisConstants.VIKA_NEST_LOAD_KEY, ip);
        await redisClient.del(this.getLoadUnHealthKey(ip));
        await redisClient.del(this.getLoadHealthKey(ip));
        // 需要删除本地的
        this.clientIps.delete(ip);
        this.logger.log({ ips: Array.from(this.clientIps) }, 'nest删除成功');
      } catch (e) {
        this.logger.error({ ips: Array.from(this.clientIps) }, e.message, 'nest删除失败');
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
