import { DatasheetRecordSourceEntity } from 'entities/datasheet.record.source.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(DatasheetRecordSourceEntity)
export class DatasheetRecordSourceRepository extends Repository<DatasheetRecordSourceEntity> {}
