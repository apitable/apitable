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
import { GrpcOptions } from '@nestjs/microservices/interfaces';
import { Cron } from '@nestjs/schedule';
import { isDevMode } from 'app.environment';
import { filter, get, isEmpty, isFunction, split } from 'lodash';
import { lastValueFrom, Observable } from 'rxjs';
import { randomNum } from 'shared/common';
import { BootstrapConstants } from 'shared/common/constants/bootstrap.constants';
import { HealthConstants, RedisConstants, SocketConstants } from 'shared/common/constants/socket.module.constants';
import { RedisService } from 'socket/services/redis/redis.service';

@Injectable()
export class GrpcClientProxy extends ClientGrpcProxy implements OnApplicationBootstrap {
  private _currentClientUrl?: string;

  protected readonly redisService: RedisService;
  private readonly httpService: HttpService;
  protected readonly clientCredentials;
  private clientIps: Set<string>;

  constructor(props: GrpcOptions['options']) {
    super(props);
    this.redisService = props['proxyClient'];
    this.clientCredentials = credentials.createInsecure();
    this.clientIps = new Set();
    this.httpService = props['httpService'];
  }

  async onApplicationBootstrap(): Promise<any> {
    /*
     * Client subscribed to the pipeline, can not use the rest of the commands outside the pipeline, so here you need to turn on duplicate()
     * If you don't turn it on, the client will get an exception: Connection in subscriber mode, only subscriber commands may be used
     * Reference: https://redis.io/commands/subscribe
     */
    const redis = this.redisService.getClient().duplicate();
    await redis.subscribe(RedisConstants.ROOM_POOL_CHANNEL, (err, count) => {
      if (err) {
        this.logger.error(`Subscription to [${RedisConstants.ROOM_POOL_CHANNEL}] error`, err?.stack);
      } else {
        this.logger.log({
          message: `Subscription to [${RedisConstants.ROOM_POOL_CHANNEL}] successful`,
          channel: RedisConstants.ROOM_POOL_CHANNEL,
          count
        });
      }
    });
    // Used to handle the start and stop of nest
    redis.on('message', (channel, message) => {
      const subscribeMessage: ISubscribeRoomAddressMessage = JSON.parse(message);
      const { roomClientAddress } = this.splitAddress(subscribeMessage.address);
      this.logger.log({ message: `receive room client [${roomClientAddress}] register`, channel });
      void this.handleNestMessage(subscribeMessage);
    });
    // Used to handle socket restarts
    await this.refreshRoomPools();
  }

  @Cron(HealthConstants.NEST_HEALTH_CHECK_CRON_EXPRESSION)
  async handleNestIp() {
    try {
      await this.refreshRoomPools();
      this.logger.log(`Available IP Pools：${this.clientIps.size ? Array.from(this.clientIps) : 'None'}`);
    } catch (e) {
      this.logger.error('Listening for room health Ip pool task exception', e);
    }
  }

  override getService<T extends {}>(name: string): T {
    const grpcClient = this.createdDynamicClientByServiceName(name);
    const clientRef = this.getClient(name);
    if (!clientRef) {
      throw new InvalidGrpcServiceException();
    }
    const protoMethods = Object.keys(clientRef[name].prototype);
    const grpcService = {} as T;

    protoMethods.forEach(m => {
      const key = m[0]!.toLowerCase() + m.slice(1, m.length);
      grpcService[key] = this.createAsyncUnaryServiceMethod(grpcClient, m);
    });
    return grpcService;
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
    const maxMetadataSize: number = this.getOptionsProp(this.options, 'maxMetadataSize', -1)!;
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
    if (!this.clientIps.size || isDevMode) {
      // If no healthy ip is available, return to the default configuration directly
      this.logger.warn(`empty nest server，fallback as default：${BootstrapConstants.ROOM_GRPC_URL}`);
      return BootstrapConstants.ROOM_GRPC_URL;
    }
    // Select dynamic load Grpc address
    const addressList = Array.from(this.clientIps);
    const index = randomNum(0, addressList.length - 1);
    return addressList[index]!;
  }

  createAsyncUnaryServiceMethod(
    client: any,
    methodName: string
  ): (...args: any[]) => Observable<any> {
    return (...args: any[]) => {
      const localClient = client();
      const isRequestStream = localClient[methodName].requestStream;
      const upstreamSubjectOrData = args[0];
      const isUpstreamSubject = upstreamSubjectOrData && isFunction(upstreamSubjectOrData.subscribe);
      if (isRequestStream && isUpstreamSubject) {
        return new Observable(observer => {
          const callArgs = [
            (error: unknown, data: unknown) => {
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
            (val: unknown) => call.write(val),
            (err: unknown) => call.emit('error', err),
            () => call.end(),
          );
        });
      }
      return new Observable(observer => {
        localClient[methodName](...args, (error: any, data: any) => {
          if (error) {
            return observer.error(error);
          }
          observer.next(data);
          observer.complete();
        });
      });
    };
  }

  private async refreshRoomPools() {
    const redis = this.redisService.getClient();

    const checkIps = await redis.smembers(RedisConstants.ROOM_POOL_LOAD_KEY);
    if (!checkIps.length) {
      return;
    }

    const checkTasks = checkIps.map(address => {
      return this.checkRoomClient(address).then(result => {
        return Promise.resolve(result);
      });
    });

    const batchCheckTaskResult = await Promise.all(checkTasks);

    const validHealthyClient = filter(batchCheckTaskResult, el => !isEmpty(el));

    this.clientIps = new Set(validHealthyClient as string[]);
  }

  private async checkRoomClient(address: string): Promise<string | undefined> {
    const config = {
      timeout: HealthConstants.NEST_HEALTH_CHECK_TIMEOUT,
    };
    const { roomClientAddress, checkRoomClientAddress } = this.splitAddress(address);
    let result: string | undefined;
    try {
      const response: any = await lastValueFrom(this.httpService.get(`http://${checkRoomClientAddress}/actuator/health`, config));
      if (response.status === 200) {
        result = await this.handleHealthy(address, response.data);
      } else {
        await this.handleUnhealthy(address);
      }
    } catch (e) {
      const error: any = e as any;
      this.logger.error(`ping room client :[${roomClientAddress}] timeout, ping code:[${error.code}]`, error?.stack);
      await this.handleUnhealthy(address, this.isServerReachable(error.code));
    }
    return result;
  }

  private async handleHealthy(address: string, checkResult: any): Promise<string> {
    const { roomClientAddress } = this.splitAddress(address);
    const redisClient = this.redisService.getClient();

    // Machine total memory
    // const _totalMem:number = get(checkResult,'data.info.memory_rss.totalMem')
    // Machine used memory
    const memoryUsageMem: number = get(checkResult, 'data.info.memory_heap.memoryUsageMem');
    // Calculate health score - no past CPU, currently use used memory as score
    const healthScore = Math.floor(memoryUsageMem);

    // Add healthy IP while removing unhealthy IP
    this.clientIps.add(roomClientAddress);
    await redisClient.pipeline()
      .zadd(RedisConstants.ROOM_POOL_LOAD_HEALTHY_KEY, healthScore, address)
      .hdel(RedisConstants.ROOM_POOL_LOAD_UNHEALTHY_KEY, address)
      .exec(error => {
        if (error) {
          this.logger.error('grpc handleHealthy error', error);
        }
      });
    return roomClientAddress;
  }

  private async handleUnhealthy(address: string, available = true) {
    const { roomClientAddress } = this.splitAddress(address);
    const redisClient = this.redisService.getClient();

    // Mark unhealthy IPs and remove healthy IPs at the same time
    const latestOfflineNum: number = await redisClient.hincrby(RedisConstants.ROOM_POOL_LOAD_UNHEALTHY_KEY, address, 1);
    await redisClient.zrem(RedisConstants.ROOM_POOL_LOAD_HEALTHY_KEY, address);
    this.logger.log(`Check Room Address:「${roomClientAddress}」. Status:offline. Offline times: ${latestOfflineNum}`);

    // In the case of unreachable service, room is forced to restart, and there is no pub message before restart
    if (!available || latestOfflineNum >= HealthConstants.ROOM_MAX_OFFLINE_TIMES) {
      // Need to delete the local
      this.clientIps.delete(roomClientAddress);
      await redisClient.pipeline()
        // Removal from the pool to be detected
        .srem(RedisConstants.ROOM_POOL_LOAD_KEY, address)
        // Removal from Healthy Pool
        .zrem(RedisConstants.ROOM_POOL_LOAD_HEALTHY_KEY, address)
        // Removed from Unhealthy pool
        .hdel(RedisConstants.ROOM_POOL_LOAD_UNHEALTHY_KEY, address)
        .exec(error => {
          if (error) {
            this.logger.error('grpc handleHealthy error', error);
          }
        });

      this.logger.log(`Check Room Address:「${roomClientAddress}」. Status:out`);
    }
  }

  private isServerReachable(code: string) {
    const unreachableCodes = ['ETIMEDOUT', 'ECONNREFUSED', 'EHOSTUNREACH'];
    return !unreachableCodes.includes(code);
  }

  async handleNestMessage(message: ISubscribeRoomAddressMessage) {
    const redisClient = this.redisService.getClient();
    const { address } = message;
    const { roomClientAddress } = this.splitAddress(address);

    // Register, add ip
    if (message.action) {
      // Use a collection of storage ip, improve the efficiency of redis
      try {
        this.clientIps.add(roomClientAddress);
        await redisClient.pipeline()
          .sadd(RedisConstants.ROOM_POOL_LOAD_KEY, address)
          // Successful service startup default means healthy, append to healthy Ip pool, `1` means available level
          .zadd(RedisConstants.ROOM_POOL_LOAD_HEALTHY_KEY, 1, address)
          .exec(error => {
            if (error) {
              this.logger.error('grpc handleNestMessage error', error);
            }
          });

        this.logger.log({ message: `room client [${roomClientAddress}] add success`, clientIps: Array.from(this.clientIps) });
      } catch (e) {
        this.logger.error({ message: (e as Error)?.message, clientIps: Array.from(this.clientIps) }, (e as Error)?.stack);
      }
    } else {
      // nest restart, disconnect, delete ip
      try {
        // Need to delete the local
        this.clientIps.delete(roomClientAddress);

        await redisClient.pipeline()
          // Removal from the pool to be detected
          .srem(RedisConstants.ROOM_POOL_LOAD_KEY, address)
          // Removal from Health Pool
          .zrem(RedisConstants.ROOM_POOL_LOAD_HEALTHY_KEY, address)
          // Removed from unhealthy pool
          .hdel(RedisConstants.ROOM_POOL_LOAD_UNHEALTHY_KEY, address)
          .exec(error => {
            if (error) {
              this.logger.error('grpc handleNestMessage error', error);
            }
          });

        this.logger.log({ message: 'room client remove success', clientIps: Array.from(this.clientIps) });
      } catch (e) {
        this.logger.error({ message: (e as Error)?.message, clientIps: Array.from(this.clientIps) }, (e as Error)?.stack);
      }
    }
  }

  private splitAddress(str: string): { roomClientAddress: string, checkRoomClientAddress: string } {
    // Split port + IP according to format
    const cargo = split(str, ':');
    return {
      roomClientAddress: `${cargo[0]}:${cargo[1]}`,
      checkRoomClientAddress: `${cargo[0]}:${cargo[2]}`
    };
  }

  get currentClientUrl() {
    return this._currentClientUrl;
  }
}

interface ISubscribeRoomAddressMessage {
  // format : ip:port(grpc):checkHealthyPort ;
  // example: 127.0.0.1:3334:3333 ;
  address: string;
  action: number;
}
