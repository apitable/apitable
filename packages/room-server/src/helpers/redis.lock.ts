/* eslint-disable space-before-function-paren */
import * as util from 'util';
import { Redis } from 'ioredis';

const defaultTimeout = 5000;
const promisify = util.promisify || function (x) { return x; };

function acquireLock(client: Redis, lockNames: string[], timeout: number, retryDelay: number, onLockAcquired: (number) => void) {
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
  // 批量设置 lockName 为key
  // eslint-disable-next-line 
  const script = "local addKey = {} for _, v in ipairs(KEYS) do if (redis.call('SET', v, ARGV[1], 'NX', 'EX', ARGV[2])) then addKey[#addKey + 1] = v else if (#addKey > 0) then redis.call('DEL', unpack(addKey)) end return { 0, addKey } end end return { 1, addKey }";
  const expireSecond = timeout > 1000 ? timeout / 1000 : timeout;
  (client.eval as any)(script, lockNames.length, ...lockNames, lockTimeoutValue, expireSecond, (err, result) => {
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
  if (!(client && client.setnx && client.msetnx)) {
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

    acquireLock(client, lockName, timeout as number, retryDelay, function (lockTimeoutValue) {
      taskToPerform(promisify(function (done) {
        done = done || function () { };
        if (lockTimeoutValue > Date.now()) {
          client.del(lockName, done);
        } else {
          done();
        }
      }));
    });
  }

  if (util.promisify) {
    lock[util.promisify.custom] = function (lockName, timeout) {
      return new Promise(function (resolve) {
        lock(lockName, timeout || defaultTimeout, resolve);
      });
    };
  }

  return lock;
}
