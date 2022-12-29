import { AutomationServiceEntity } from '../entities/automation.service.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AutomationServiceEntity)
export class AutomationServiceRepository extends Repository<AutomationServiceEntity> {
}
