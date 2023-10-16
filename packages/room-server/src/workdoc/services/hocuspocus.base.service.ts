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

import { Hocuspocus } from '@hocuspocus/server';
import { Injectable } from '@nestjs/common';
import { getIPAddress } from 'shared/helpers/system.helper';

@Injectable()
export abstract class HocuspocusBaseService {

  init(port: number): Hocuspocus {
    return new Hocuspocus({
      port,
    });
  }
}

@Injectable()
export class HocuspocusService extends HocuspocusBaseService {

  constructor() {
    super();
  }

  override init(port: number): Hocuspocus {
    return new Hocuspocus({
      name: getIPAddress(),
      port,
      async onListen(data) {
        console.log(`Hocuspocus server[${data.configuration.name}] is listening on port "${data.port}"!`);
      },
    });
  }
}