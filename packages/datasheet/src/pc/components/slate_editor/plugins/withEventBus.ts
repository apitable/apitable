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
