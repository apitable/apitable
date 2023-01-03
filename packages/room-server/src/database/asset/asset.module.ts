import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetRepository } from 'database/asset/repositories/asset.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AssetRepository,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class AssetModule {}
