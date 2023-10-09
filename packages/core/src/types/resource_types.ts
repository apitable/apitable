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

// The enumeration value is aligned with the field resource_type of the database table `resource_changeset`, please do not modify it
export enum ResourceType {
  Datasheet,
  Form,
  Dashboard,
  Widget,
  Mirror
}

export enum ResourceIdPrefix {
  Datasheet = 'dst',
  Form = 'fom',
  Automation = 'aut',
  Dashboard = 'dsb',
  Widget = 'wdt',
  Mirror = 'mir',
}
