import { AutomationTriggerTypeEntity } from '../entities/automation.trigger.type.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AutomationTriggerTypeEntity)
export class AutomationTriggerTypeRepository extends Repository<AutomationTriggerTypeEntity> {
  /**
   * 通过 service slug 和 trigger  endpoint 查询出唯一触发器类型
   * @param serviceSlugAndEndpoints ([record_updated,record_created], vika)
   */
  getTriggerTypeByServiceSlugAndEndpoints(endpoints: string[], serviceSlug: string): Promise<{
    triggerTypeId: string,
    endpoint: string,
    serviceSlug: string,
  }[]> {

    return this.query(
      `
    SELECT
      trigger_type_id triggerTypeId,
      endpoint,
      vas.slug serviceSlug
    FROM
      vika_automation_trigger_type att
      JOIN vika_automation_service vas ON vas.service_id = att.service_id
        AND vas.slug = ?
    WHERE
      att.is_deleted = 0
      AND att.endpoint IN (?)
    `,
      [serviceSlug, endpoints]);
  }
}
