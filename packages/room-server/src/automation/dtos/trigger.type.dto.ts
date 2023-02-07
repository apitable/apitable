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

export interface ITriggerTypeServiceRelDto {
  serviceId: string,
  triggerTypeId: string,
  endpoint?: string,
}

export class TriggerTypeDetailDto {
  triggerTypeId!: string;
  name!: string;
  description!: string;
  endpoint!: string;
  i18n?: object;
  inputJSONSchema?: object;
  outputJSONSchema?: object;
  serviceId!: string;
}

export class TriggerInputJsonSchemaDto {
  triggerTypeId!: string;
  inputJSONSchema?: object;
}