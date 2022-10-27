import { credentials } from '@grpc/grpc-js';
import { HttpService } from '@nestjs/axios';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientGrpcProxy } from '@nestjs/microservices';
import { InvalidGrpcServiceException } from '@nestjs/microservices/errors/invalid-grpc-service.exception';
import { Cron } from '@nestjs/schedule';
import { isFunction } from 'lodash';
import { Observable } from 'rxjs';
import { isDev, randomNum } from 'src/socket/common/helper';
import { GatewayConstants } from 'src/socket/constants/gateway.constants';
import { HealthConstants } from 'src/socket/constants/health.constants';
import { RedisConstants } from 'src/socket/constants/redis-constants';
import { SocketConstants } from 'src/socket/constants/socket-constants';
import { RedisService } from 'src/socket/service/redis/redis.service';

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
  // 保证唯一性
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
     * Client订阅了管道，无法使用管道外的其余命令所以这里需要开启 duplicate()
     * 如果不开启后面的客户端会异常：Connection in subscriber mode, only subscriber commands may be used
     * 参考：https://redis.io/commands/subscribe
     */
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
    await this.refreshNestClient();
  }

  @Cron(HealthConstants.NEST_HEALTH_CHECK_CRON_EXPRESSION)
  async handleNestIp() {
    try {
      const nestClientInfo = await this.refreshNestClient();
      this.logger.log(`可用IP池：${nestClientInfo?.healthIps?.length ? nestClientInfo.healthIps : '无'}`);
    } catch (error) {
      this.logger.error('监听nest健康Ip池任务异常', error);
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

  /**
   * 刷新本地可用客户端
   */
  async refreshNestClient(): Promise<INestClientInfo> {
    const redis = this.redisService.getClient();
    // 拉去待检测Ip列表
    const checkIps = await redis.smembers(RedisConstants.VIKA_NEST_LOAD_KEY_V2);
    if (!checkIps.length) {
      this.logger.error({}, 'NestServer没有注册，请确认NestServer是否启动', 'EmptyNestServer');
      return;
    }

    // 拉取健康的Ip集合
    const healthIps = await redis.zrange(RedisConstants.VIKA_NEST_LOAD_HEALTH_KEY_V2, 0, -1);
    if (!healthIps.length) {
      this.logger.warn(`Nest-Server无健康IP可用，调用默认Ip-[${GatewayConstants.NEST_GRPC_URL}]`);
    }
    // 拉取不健康的Ip集合
    const unHealthIps = await redis.hkeys(RedisConstants.VIKA_NEST_LOAD_UNHEALTH_KEY_V2);

    // 计算健康有效的IP集合
    const checkIpsSet = new Set(checkIps);
    // 有效的Ip
    const validHealthIps = [];
    // 弃用的Ip
    const deprecatedHealthIps = [];
    for (const v of healthIps) {
      if (checkIpsSet.has(v)) {
        validHealthIps.push(v);
      } else {
        deprecatedHealthIps.push(v);
      }
    }
    // 移除弃用的Ip
    if (deprecatedHealthIps.length) {
      await redis.zrem(RedisConstants.VIKA_NEST_LOAD_HEALTH_KEY_V2, deprecatedHealthIps)
        .then(r => this.logger.log(`移除已弃用的客户端IP:[${deprecatedHealthIps}]，结果：${r}`));
    }
    // 同步本地可用IP池
    this.clientIps = new Set(validHealthIps);

    if (!healthIps.length) {
      // todo 邮件通知？
      this.logger.error('EmptyHealthNestEndpoints');
    }
    return { healthIps: validHealthIps, unHealthIps: unHealthIps };
  }

  async handleNestMessage(message: INestMessage) {
    const redisClient = this.redisService.getClient();
    const ip = message.ip;
    // 注册,新增ip
    if (message.action) {
      // 采用集合存储ip，提高redis的效率
      try {
        await redisClient.sadd(RedisConstants.VIKA_NEST_LOAD_KEY_V2, ip);
        // 服务启动成功默认表示健康，追加到健康的Ip池，1表示可用等级
        await redisClient.zadd(RedisConstants.VIKA_NEST_LOAD_HEALTH_KEY_V2, 1, ip);
        this.clientIps.add(ip);
        this.logger.log({ ips: Array.from(this.clientIps) }, 'nest注册成功');
      } catch (e) {
        this.logger.error({ ips: Array.from(this.clientIps) }, e.message, 'nest注册失败');
      }
    } else {
      // nest重启，断开,删除ip
      try {
        // IP从待检测池移除
        await redisClient.srem(RedisConstants.VIKA_NEST_LOAD_KEY_V2, ip);
        // IP从健康池移除
        await redisClient.zrem(RedisConstants.VIKA_NEST_LOAD_HEALTH_KEY_V2, ip);
        // IP从不健康池移除
        await redisClient.hdel(RedisConstants.VIKA_NEST_LOAD_UNHEALTH_KEY_V2, ip);
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

interface INestClientInfo {
  healthIps: string[],
  unHealthIps?: string[],
}
