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

export enum EmitterEventName {
  ViewMouseDown,
  ViewClick,
  ViewDoubleClick,
  // Widgets Developer Mode
  ToggleWidgetDevMode,
  // panel Is it on the move
  PanelDragging,
}

/**
 * Minimalist event manager
 * To prevent abuse, only the most basic event binding and triggering services are implemented
 * * Does not support binding multiple callbacks to one event to prevent double binding
 */
export class SimpleEmitter {
  private callbacks: { [key: number]: (...args: any) => void } = {};

  bind(name: EmitterEventName, cb: (...args: any) => void) {
    this.callbacks[name] = cb;
  }

  unbind(name: EmitterEventName) {
    delete this.callbacks[name];
  }

  emit(name: EmitterEventName, ...args: any[]) {
    const cb = this.callbacks[name];
    cb && cb.apply(null, args);
  }

  destroy() {
    this.callbacks = {};
  }
}
