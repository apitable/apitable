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

/* eslint-disable space-before-function-paren */
import util from 'util';
import { Redis } from 'ioredis';
import fs from 'fs';
import path from 'path';

const listLock = fs.readFileSync(path.resolve(__dirname, 'list.lock.lua'), 'utf8');

const defaultTimeout = 5000;
const promisify = util.promisify || function (x: any) { return x; };

function acquireLock(client: Redis, lockNames: string[], timeout: number, retryDelay: number, onLockAcquired: (number: any) => void) {
  function retry() {
    setTimeout(function () {
      acquireLock(client, lockNames, timeout, retryDelay, onLockAcquired);
    }, retryDelay);
  }

  const lockTimeoutValue = (Date.now() + timeout + 1);
  // client.set(lockNames, lockTimeoutValue, 'PX', timeout, 'NX', function (err, result) {
  //   if (err || result === null) return retry();
  //   onLockAcquired(lockTimeoutValue);
  // });
  // set lockName as key
  const expireSecond = timeout > 1000 ? timeout / 1000 : timeout;
  (client.eval as any)(listLock, lockNames.length, ...lockNames, lockTimeoutValue, expireSecond, (err: any, result: any[]) => {
    if (err) {
      return console.error('Redis lock eval error. Error: ' + err);
    }
    if (!result[0]) {
      return retry();
    }
    onLockAcquired(lockTimeoutValue);
  });
}

type ITaskToPerform = (done: () => void) => void;
export function RedisLock(client: Redis, retryDelay?: number): any {
  if (!(client && client.setnx! && client.msetnx)) {
    throw new Error('You must specify a client instance of http://github.com/mranney/node_redis');
  }

  retryDelay = retryDelay || 50;

  function lock(lockName: string | string[], timeout: ITaskToPerform | number, taskToPerform?: ITaskToPerform) {
    if (!lockName) {
      throw new Error('You must specify a lock string. It is on the redis key `lock.[string]` that the lock is acquired.');
    }

    if (!taskToPerform) {
      taskToPerform = timeout as ITaskToPerform;
      timeout = defaultTimeout;
    }

    const lockNamePrefix = 'lock.';
    if (Array.isArray(lockName)) {
      lockName = lockName.map(name => lockNamePrefix + name);
    } else {
      lockName = [lockNamePrefix + lockName];
    }

    acquireLock(client, lockName, timeout as number, retryDelay!, function (lockTimeoutValue) {
      taskToPerform!(promisify(function (done) {
        done = done || function () { };
        if (lockTimeoutValue > Date.now()) {
          client.del(lockName, done);
        } else {
          (done as () => void)();
        }
      }));
    });
  }

  if (util.promisify) {
    lock[util.promisify.custom] = function (lockName: string, timeout: number) {
      return new Promise(function (resolve) {
        lock(lockName, timeout || defaultTimeout, resolve);
      });
    };
  }

  return lock;
}
