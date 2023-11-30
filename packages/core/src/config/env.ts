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
import process from 'process';
// import { IDENTIFY_CODE_LOGIN } from './constant';
export function isPrivateDeployment() {
  return Boolean(process.env.REACT_APP_DEPLOYMENT_MODELS === 'PRIVATE');
}

export function isIdassPrivateDeployment() {
  return getCustomConfig().isIdaas && isPrivateDeployment();
}

declare let window: any;

export function getCustomConfig() {
  // There is a bug here. Import IDENTIFY_CODE_LOGIN cannot be used.
  return typeof window === 'object' && window.__initialization_data__.envVars || {
    LOGIN_DEFAULT_VERIFY_TYPE: 'identify_code_login',
    VIEW_NAME_MAX_COUNT: process.env.VIEW_NAME_MAX_COUNT || 30
  };
}
