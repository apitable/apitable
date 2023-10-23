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

import { In, ObjectLiteral, Repository } from 'typeorm';

export async function batchQueryByRecordIdIn<T extends ObjectLiteral>(
  repository: Repository<T>,
  select: string[],
  recordIds: string[],
  whereConditions: ObjectLiteral,
  batchSize = 1000,
) {
  const totalRecords = recordIds.length;
  let offset = 0;
  let records: any[] = [];

  while (offset < totalRecords) {
    const batchRecordIds = recordIds.slice(offset, offset + batchSize);

    const batchRecords = await repository.find({
      select,
      where: { recordId: In(batchRecordIds), ...whereConditions },
    });

    records = records.concat(batchRecords);

    offset += batchSize;
  }

  return records;
}
