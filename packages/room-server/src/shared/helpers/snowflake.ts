/**
 * Twitter_Snowflake
 * 雪花算法
 *
 * SnowFlake的结构如下(共64bits，每部分用-分开):
 *   0 - 0000000000 0000000000 0000000000 0000000000 0 - 00000 - 00000 - 000000000000
 *   |   ----------------------|----------------------   --|--   --|--   -----|------
 * 1bit不用                41bit 时间戳                  数据标识id 机器id     序列号id
 *
 * - 1位标识，二进制中最高位为1的都是负数，但是我们生成的id一般都使用整数，所以这个最高位固定是0
 * - 41位时间截(毫秒级)，注意，41位时间截不是存储当前时间的时间截，
 * 而是存储时间截的差值（当前时间截 - 开始时间截得到的值），
 * 这里的的开始时间截，一般是我们的id生成器开始使用的时间，由我们程序来指定的（如下下面程序IdWorker类的startTime属性）。41位的时间截，可以使用69年，年T = (1L << 41) / (1000L * 60 * 60 * 24 * 365) = 69
 * - 10位的数据机器位，可以部署在1024个节点，包括5位datacenterId和5位workerId
 * - 12位序列，毫秒内的计数，12位的计数顺序号支持每个节点每毫秒(同一机器，同一时间截)产生4096个ID序号
 * - 加起来刚好64位，为一个Long型。
 * SnowFlake的优点是
 *   - 整体上按照时间自增排序
 *   - 并且整个分布式系统内不会产生ID碰撞(由数据中心ID和机器ID作区分)
 *   - 并且效率较高，经测试，SnowFlake每秒能够产生26万ID左右。
 * 优化开源项目：https://gitee.com/yu120/sequence
 */

import * as childProcess from 'child_process';
import getMAC from 'getmac';

class SnowFlake {

  twepoch: bigint;
  workerIdBits: bigint;
  dataCenterIdBits: bigint;
  sequenceBits: bigint;
  maxWorkerId: bigint;
  maxDataCenterId: bigint;
  sequenceMask: bigint;
  workerIdShift: bigint;
  dataCenterIdShift: bigint;
  timestampLeftShift: bigint;
  sequence: bigint;
  lastTimestamp: bigint;
  workerId: bigint;
  dataCenterId: bigint;

  /**
   * 构造函数
   * 运行在内存
   */
  constructor() {
    // 开始时间截 (2018-02-01)，这个可以设置开始使用该系统的时间，可往后使用69年
    this.twepoch = BigInt(1548988646430);

    // 位数划分 [数据标识id(5bit 31)、机器id(5bit 31)](合计共支持1024个节点)、序列id(12bit 4095)
    this.workerIdBits = BigInt(5);
    this.dataCenterIdBits = BigInt(5);
    this.sequenceBits = BigInt(5);
    // this.timestampBits = 41n;

    // 支持的最大十进制id
    // 这个移位算法可以很快的计算出几位二进制数所能表示的最大十进制数
    // -1 左移5位后与 -1 异或
    // tslint:disable-next-line: no-bitwise
    this.maxWorkerId = BigInt(-1) ^ (BigInt(-1) << this.workerIdBits);
    // tslint:disable-next-line: no-bitwise
    this.maxDataCenterId = BigInt(-1) ^ (BigInt(-1) << this.dataCenterIdBits);
    // 生成序列的掩码，这里为4095 (0b111111111111=0xfff=4095)
    // tslint:disable-next-line: no-bitwise
    this.sequenceMask = BigInt(-1) ^ (BigInt(-1) << this.sequenceBits);

    // 机器ID向左移12位 数据标识id向左移17位(12+5) 时间截向左移22位(5+5+12)
    this.workerIdShift = this.sequenceBits;
    this.dataCenterIdShift = this.sequenceBits + this.workerIdBits;
    this.timestampLeftShift = this.dataCenterIdShift + this.dataCenterIdBits;

    // 工作机器ID(0~31) 数据中心ID(0~31) 毫秒内序列(0~4095)
    // this.workerId;
    const dataCenterId = this.getDatacenterId(this.maxDataCenterId);
    const workerId = this.getMaxWorkerId(dataCenterId, this.maxWorkerId);
    this.sequence = BigInt(0);

    // 上次生成ID的时间截（这个是在内存中？系统时钟回退+重启后呢）
    this.lastTimestamp = BigInt(-1);

    const { maxWorkerId, maxDataCenterId } = this;
    if (workerId > maxWorkerId || workerId < BigInt(0)) {
      throw new Error(
        `workerId can't be greater than ${maxWorkerId} or less than 0`,
      );
    }
    if (dataCenterId > maxDataCenterId || dataCenterId < BigInt(0)) {
      throw new Error(
        `dataCenterId can't be greater than ${maxDataCenterId} or less than 0`,
      );
    }
    this.workerId = workerId;
    this.dataCenterId = dataCenterId;
    return this;
  }

  /**
   * 获得下一个ID (该方法是线程安全的)
   *
   * @returns {bigint} SnowflakeId 返回 id
   */
  nextId(): bigint {
    let timestamp = this.timeGen();
    // 如果当前时间小于上一次ID生成的时间戳，说明系统时钟回退过这个时候应当抛出异常
    const diff = timestamp - this.lastTimestamp;
    if (diff < BigInt(0)) {
      throw new Error(
        `Clock moved backwards. Refusing to generate id for ${-diff} milliseconds`,
      );
    }

    // 如果是同一时间生成的，则进行毫秒内序列
    if (diff === BigInt(0)) {
      // tslint:disable-next-line: no-bitwise
      this.sequence = (this.sequence + BigInt(1)) & this.sequenceMask;
      // 毫秒内序列溢出
      if (this.sequence === BigInt(0)) {
        // 阻塞到下一个毫秒，获得新的时间戳
        timestamp = this.tilNextMillis(this.lastTimestamp);
      }
    } else {
      // 时间戳改变，毫秒内序列重置
      this.sequence = BigInt(0);
    }

    // 保存上次生成ID的时间截
    this.lastTimestamp = timestamp;

    // 移位并通过或运算拼到一起组成64位的ID
    // 将各 bits 位数据移位后或运算合成一个大的64位二进制数据
    // 时间戳部分 | 数据中心部分 | 机器标识部分 | 序列号部分
    return (
      // tslint:disable-next-line: no-bitwise
      ((timestamp - this.twepoch) << this.timestampLeftShift) | // 时间数据左移22
      // tslint:disable-next-line: no-bitwise
      (this.dataCenterId << this.dataCenterIdShift) | // 数据标识id左移 17
      // tslint:disable-next-line: no-bitwise
      (this.workerId << this.workerIdShift) | // 机器id左移 12
      this.sequence
    );
  }

  /**
   * 阻塞到下一个毫秒，直到获得新的时间戳
   *
   * @param {*} lastTimestamp 上次生成ID的时间截
   * @returns {bigint}
   * @memberof SnowFlake
   */
  tilNextMillis(lastTimestamp: bigint): bigint {
    let timestamp = this.timeGen();
    while (timestamp <= lastTimestamp) {
      timestamp = this.timeGen();
    }
    return timestamp;
  }

  /**
   * 返回以毫秒为单位的当前时间
   * @return {bigint} 当前时间(毫秒)
   */
  timeGen(): bigint {
    return BigInt(+new Date());
  }

  /**
   * 获取最大数据标识id
   * @param maxDatacenterId 最大数据中心值
   */
  private getDatacenterId(maxDatacenterId: bigint): bigint {
    // 根据本地IP计算获取mac地址
    const mac = getMAC();
    const macs = mac.split(':');
    // tslint:disable-next-line: no-bitwise
    const id = ((0x000000FF & parseInt(macs[macs.length - 1], 16)) | (0x0000FF00 & (parseInt(macs[macs.length - 2], 16) << 8))) >> 6;
    return BigInt(id % Number(maxDatacenterId + BigInt(1)));
  }

  /**
   * 获取最大工作机器标识id
   * @param datacenterId 数据中心标识
   * @param maxWorkerId
   */
  private getMaxWorkerId(datacenterId: bigint, maxWorkerId: bigint): bigint {
    const grep = childProcess.spawn('grep', ['ssh']);
    const mpid = datacenterId.toString() + grep.pid.toString();
    grep.stdin.end();
    // tslint:disable-next-line: no-bitwise
    const hashCode = Array.from(mpid).reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0);
    // tslint:disable-next-line: no-bitwise
    const res = Number(parseInt(hashCode.toString(), 10) & 0xffff) % Number(maxWorkerId + BigInt(1));
    return BigInt(res);
  }
}

export const IdWorker = new SnowFlake();

//  ========== TEST ==========

//  测试，每秒可产生26万个ID
// function main() {
//   console.time('id');
//   const idWorker = new SnowFlake(1n, 1n);

//   const tempIds = [];
//   for (let i = 0; i < 50000; i++) {
//     const id = idWorker.nextId();
//     // console.log(id);
//     tempIds.push(id);
//   }
//   console.log(tempIds.length);
//   // const end = +new Date();
//   console.timeEnd('id');
// }
// main();
