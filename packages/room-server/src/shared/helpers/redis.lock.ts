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
import { Redis } from 'ioredis';
import fs from 'fs';
import path from 'path';

const listLock = fs.readFileSync(path.resolve(__dirname, 'list.lock.lua'), 'utf8');

const DEFAULT_LOCK_TIMEOUT = 5000;

function acquireLock(client: Redis, lockNames: string[], timeout: number, retryDelay: number, onLockAcquired: (timedOut: boolean) => void) {
  function retry() {
    setTimeout(function() {
      acquireLock(client, lockNames, timeout, retryDelay, onLockAcquired);
    }, retryDelay);
  }

  const lockTimeoutValue = Date.now() + timeout + 1;
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
    onLockAcquired(lockTimeoutValue <= Date.now());
  });
}

export function RedisLock(client: Redis, retryDelay?: number) {
  if (!(client && client.setnx! && client.msetnx)) {
    throw new Error('You must specify a client instance of http://github.com/mranney/node_redis');
  }

  retryDelay = retryDelay || 50;

  function lock(lockName: string | string[], timeout: number = DEFAULT_LOCK_TIMEOUT): Promise<() => Promise<void>> {
    if (!lockName) {
      throw new Error('You must specify a lock string. It is on the redis key `lock.[string]` that the lock is acquired.');
    }

    const lockNamePrefix = 'lock.';
    if (Array.isArray(lockName)) {
      lockName = lockName.map(name => lockNamePrefix + name);
    } else {
      lockName = [lockNamePrefix + lockName];
    }

    return new Promise(resolve => {
      acquireLock(client, lockName as string[], timeout, retryDelay!, function(timedOut) {
        resolve(async () => {
          if (!timedOut) {
            // @ts-ignore
            await client.del(lockName);
          }
        });
      });
    });
  }

  return lock;
}
