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

/**
 * dayOfMonth
 * :
 * {type: ["string", "number"], oneOf: [{type: "string", title: "multi days of month"},…],…}
 * dayOfWeek
 * :
 * {type: "string", oneOf: [{type: "string", title: "multi days of week"},…],…}
 * hour
 * :
 * {type: "integer", comment: "hour (0 - 23)"}
 * minute
 * :
 * {type: "integer", comment: "minute (0 - 59)"}
 * month
 * :
 * {type: "integer", comment: "month (1 - 12)"}
 * second
 * :
 * {type: "integer", comment: "second (0 - 59, optional)"}
 *
 * @param interval
 * @param value
 * @param onUpdate
 * @constructor
 */

export interface ICronSchema {
  dayOfMonth?: string; // | number;
  dayOfWeek?: string; // | number;
  hour?: string;
  minute?: string;
  month?: string; //every x month
  second?: string;
}
