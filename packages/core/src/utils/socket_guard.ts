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

export const socketGuard = () => {
  return function(
    _target: any,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    let ignoreSocketError = false;
    let timeout: NodeJS.Timeout;
    const socketErrCodes = [50000, 50001];
    descriptor.value = function(this: any, ...arg: any[]): any {
      if (!this.io.socket.connected) {
        return (() => {})();
      }
      if (socketErrCodes.includes(arg[0]?.code)) {
        if (ignoreSocketError) {
          ignoreSocketError = false;
          timeout && clearTimeout(timeout);
          return originalMethod.apply(this, [...arg, false]);
        }
        ignoreSocketError = true;
        timeout = setTimeout(() => {
          ignoreSocketError = false;
        }, 15 * 1000);
        return;
      }

      return originalMethod.apply(this, arg);
    };
    return descriptor;
  };
};
