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

import * as os from 'os';

/**
 * get the IP address
 *
 * If you use a virtual machine or VPN to access the network, you may have obtained the wrong IP
 */
export const getIPAddress = (): string => {
  if (process.env.NEST_CUSTOMIZE_IP) {
    return process.env.NEST_CUSTOMIZE_IP;
  }
  // server local address
  const interfaces = os.networkInterfaces();
  let address: string;
  for (const devName of Object.keys(interfaces)) {
    const iface = interfaces[devName]!;
    for (const i of Object.keys(iface)) {
      const alias = iface[i];
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        address = alias.address;
      }
    }
  }
  return address!;
};
