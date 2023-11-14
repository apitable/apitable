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

import { IEventInstance, IOPEvent } from '@apitable/core';
import { IOtEventContext } from 'database/ot/interfaces/ot.interface';

export interface IEventExecutor {
  // execute events
  execute(events: IEventInstance<IOPEvent>[], context?: IOtEventContext): void;
}

export class OTEventManager {
  private static executors = new Map<string, IEventExecutor>();

  public static addExecutor<T extends IEventExecutor>(name: string, executor: T) {
    this.executors.set(name, executor);
  }

  public static async execute(events: IEventInstance<IOPEvent>[], context?: IOtEventContext) {
    await Promise.all(
      Array.from(this.executors.values()).map(async (executor) => {
        return executor.execute(events, context);
      }),
    );
  }

  public static isEmpty(): boolean {
    return this.executors.size === 0;
  }
}
