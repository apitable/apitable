import { DatasheetChangesetSourceEntity } from '../entities/datasheet.changeset.source.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(DatasheetChangesetSourceEntity)
export class DatasheetChangesetSourceRepository extends Repository<DatasheetChangesetSourceEntity> {}
