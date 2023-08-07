import { Connection } from 'typeorm';
import { RedisService } from '@apitable/nestjs-redis';

export const clearDatabase = async(connection: Connection) => {
  const entities = connection.entityMetadatas;

  for (const entity of entities) {
    console.log(entity.tableName);
    const repository = connection.getRepository(entity.name);
    await repository.query(`DELETE FROM ${entity.tableName};`);
  }
};

export const clearRedis = async(redisService: RedisService) => {
  const redis = redisService.getClient();
  await redis.flushdb();
};