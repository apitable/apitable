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

import { AutomationTriggerTypeEntity } from '../entities/automation.trigger.type.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AutomationTriggerTypeEntity)
export class AutomationTriggerTypeRepository extends Repository<AutomationTriggerTypeEntity> {
  /**
   * Query the only trigger type with service slug and trigger endpoint
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
      ${this.manager.connection.options.entityPrefix}automation_trigger_type att
      JOIN ${this.manager.connection.options.entityPrefix}automation_service vas ON vas.service_id = att.service_id
        AND vas.slug = ?
    WHERE
      att.is_deleted = 0
      AND att.endpoint IN (?)
    `,
      [serviceSlug, endpoints]);
  }
}
