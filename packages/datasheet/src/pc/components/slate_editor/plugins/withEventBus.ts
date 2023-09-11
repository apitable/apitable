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

import { Editor } from 'slate';
import { IEventBusEditor, EventHandle } from '../interface/editor';

export const BUILT_IN_EVENTS = {
  EDITOR_MOUSE_MOVE: '$$editor_mouse_move',
  EDITOR_MOUSE_LEAVE: '$$editor_mouse_leave',
  EDITOR_MOUSE_UP: '$$editor_mouse_up',
  EDITOR_SCROLL: '$$editor_scroll',
  TOGGLE_INSERT_PANEL: '$$toggle_insert_panel',
  IME_INPUT_START: '$$ime_input_start',
  IME_INPUT_END: '$$ime_input_end',
  OPEN_LINK_INPUT_PANEL: '$$open_link_input_panel',
  CLOSE_HOVERING_TOOLBAR: '$$close_hovering_toolbar',
};

export const withEventBus = <T extends Editor>(inEditor: T) => {
  const editor = inEditor as T & IEventBusEditor;
  editor.events = {};

  editor.on = (name: string, handle: EventHandle) => {
    const eventSpace = editor.events;
    if (eventSpace[name]) {
      (eventSpace[name] as Array<any>).push(handle);
    } else {
      eventSpace[name] = [handle];
    }
  };

  editor.off = (name: string, handle?: EventHandle) => {
    const eventSpace = editor.events;
    if (!eventSpace) {
      return false;
    }
    const eventHandles: Array<EventHandle> | null = eventSpace[name];
    if (eventHandles) {
      if (handle) {
        eventSpace[name] = eventHandles.filter((fun) => fun !== handle);
      } else {
        eventSpace[name] = [];
      }
      return true;
    }
    return false;
  };

  editor.clear = () => {
    const eventSpace = editor.events;
    if (!eventSpace) {
      return;
    }
    Object.keys(eventSpace).forEach((key) => {
      eventSpace[key] = null;
    });
    editor.events = {};
  };

  editor.dispatch = (name: string, ...params: Array<unknown>) => {
    const eventSpace = editor.events;
    if (!eventSpace) {
      return;
    }
    const eventHandles: Array<EventHandle> | null = eventSpace[name];
    if (eventHandles) {
      eventHandles.forEach((fun) => fun(...params));
    }
  };

  return editor;
};
