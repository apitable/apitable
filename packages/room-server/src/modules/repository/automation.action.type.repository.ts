import { AutomationActionTypeEntity } from 'entities/automation.action.type.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AutomationActionTypeEntity)
export class AutomationActionTypeRepository extends Repository<AutomationActionTypeEntity> {
}
