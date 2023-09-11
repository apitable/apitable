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

import { useRef, useEffect, useState, useCallback, useContext, useMemo } from 'react';
import * as React from 'react';
import { Transforms, Editor, Path, Element, Node } from 'slate';
import { useSlate, ReactEditor } from 'slate-react';
import { ScreenSize } from 'pc/components/common/component_display';
import { Portal } from 'pc/components/portal';
import { useResponsive } from 'pc/hooks';
import { getElementDataset } from 'pc/utils';
import { toggleBlock } from '../../commands';
import { Z_INDEX, INSERT_PANEL_ELEMENT_FORMAT, INSERT_PANEL_MEDIA_ELEMENT, LIST_ITEM_TYPE_DICT, LIST_TYPE_DICT, ElementType } from '../../constant';
import { EditorContext } from '../../context';
import { GENERATOR } from '../../elements';
import { getValidPopupPosition } from '../../helpers/utils';
import { IVikaEditor, IEventBusEditor } from '../../interface/editor';
import { IElement } from '../../interface/element';
import { BUILT_IN_EVENTS } from '../../plugins/withEventBus';
import { useListWithIcons } from '../use_list';
// import { toggleBlock } from '../../commands';

import { Menu, MenuType } from './menu';

import styles from './style.module.less';

const defaultSelected = '0-0';

export const InsertPanel = () => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const editor = useSlate() as ReactEditor & IVikaEditor & IEventBusEditor;
  const timer = useRef<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(defaultSelected);
  const { i18nText } = useContext(EditorContext);
  const { screenIsAtLeast } = useResponsive();

  const formatList = useListWithIcons(INSERT_PANEL_ELEMENT_FORMAT);
  const mediaList = useListWithIcons(INSERT_PANEL_MEDIA_ELEMENT);
  const menus = useMemo(() => {
    return [
      {
        weight: 0,
        title: i18nText.commonFormat,
        size: formatList.length,
        list: formatList,
        type: MenuType.FORMAT,
      },
      {
        weight: 1,
        title: i18nText.mediaElement,
        size: mediaList.length,
        list: mediaList,
        type: MenuType.MEDIA,
      },
    ];
  }, [formatList, mediaList, i18nText]);

  const changeSelected = (isUp: boolean) => {
    const menusSize = menus.length;
    const current = selected.split('-').map((i) => +i);
    const currentGroup = menus[current[0]];
    const currentGroupSize = currentGroup.size;
    let [nextGroup, nextMenuItem] = current;
    if (isUp) {
      nextMenuItem -= 1;
      if (nextMenuItem < 0) {
        nextGroup -= 1;
        if (nextGroup < 0) {
          nextGroup = menusSize - 1;
        }
        nextMenuItem = menus[nextGroup].size - 1;
      }
    } else {
      nextMenuItem += 1;
      if (nextMenuItem >= currentGroupSize) {
        nextGroup += 1;
        if (nextGroup >= menusSize) {
          nextGroup = 0;
        }
        nextMenuItem = 0;
      }
    }
    setSelected(`${nextGroup}-${nextMenuItem}`);
  };
  const changeSelectedRef = useRef(changeSelected);
  changeSelectedRef.current = changeSelected;

  const show = useCallback(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
    }
    if (!screenIsAtLeast(ScreenSize.sm)) {
      return;
    }
    timer.current = window.setTimeout(() => {
      setVisible(true);
      editor.hasInsertPanel = true;
    }, 100);
  }, [editor, screenIsAtLeast]);

  const hide = useCallback(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    setVisible(false);
    setSelected(defaultSelected);
    editor.hasInsertPanel = false;
  }, [editor]);

  const action = useCallback(
    (menuKey: string) => {
      hide();
      const [groupIdx, itemIdx] = menuKey.split('-').map((i) => +i);
      const group = menus[groupIdx];
      if (!group) {
        return;
      }
      Transforms.delete(editor, { distance: 1, unit: 'character', reverse: true });
      const item = group.list[itemIdx];
      const match = Editor.nodes(editor, {
        match: (n) => Editor.isBlock(editor, n),
        mode: 'lowest',
      });
      if (!match) {
        return;
      }
      try {
        const [[_node, path]] = match;
        const node = _node as IElement;
        const curIsList = LIST_ITEM_TYPE_DICT[node.type];
        const nextPath = Path.next(path);
        const generate = GENERATOR[item.value] || GENERATOR.paragraph;
        const nextElement = generate({});
        if (node.type === ElementType.PARAGRAPH && Node.string(node) === '' && !nextElement.isVoid) {
          toggleBlock(editor, item.value as ElementType);
          return;
        }
        // If the inserted position is originally a list, is there a more efficient way to insert a paragraph element first,
        // then split the list and then set it to the element that should be inserted?
        Transforms.insertNodes(editor, curIsList ? GENERATOR.paragraph({}) : nextElement, { at: nextPath });
        Transforms.select(editor, nextPath);
        if (curIsList) {
          Transforms.unwrapNodes(editor, {
            match: (n) => !Editor.isEditor(n) && Element.isElement(n) && LIST_TYPE_DICT[(n as IElement).type],
            split: true,
          });
          Transforms.setNodes(editor, nextElement);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [editor, hide, menus],
  );

  const handleOk = useCallback(() => {
    action(selected);
  }, [action, selected]);

  const handleMenuClick = useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      e.preventDefault();
      const target = e.currentTarget;
      if (!target) {
        return;
      }
      const dataKey = getElementDataset(target, 'key');
      if (!dataKey) {
        return;
      }
      action(dataKey);
    },
    [action],
  );

  useEffect(() => {
    const changeVisible = (next: boolean) => {
      next ? show() : hide();
    };
    const handleScroll = () => changeVisible(false);
    editor.on(BUILT_IN_EVENTS.TOGGLE_INSERT_PANEL, changeVisible);
    editor.on(BUILT_IN_EVENTS.EDITOR_SCROLL, handleScroll);
    return () => {
      editor.off(BUILT_IN_EVENTS.TOGGLE_INSERT_PANEL, changeVisible);
      editor.off(BUILT_IN_EVENTS.EDITOR_SCROLL, handleScroll);
    };
  }, [editor, hide, show]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (visible) {
        switch (e.code) {
          // up
          case 'ArrowUp': {
            e.preventDefault();
            changeSelectedRef.current(true);
            break;
          }

          // down
          case 'ArrowDown': {
            e.preventDefault();
            changeSelectedRef.current(false);
            break;
          }

          // confirm
          case 'Space':
          case 'Enter': {
            e.preventDefault();
            handleOk();
            break;
          }
          default:
            hide();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, handleOk, hide]);

  useEffect(() => {
    document.addEventListener('click', hide);
    return () => {
      document.removeEventListener('click', hide);
    };
  }, [hide]);

  useEffect(() => {
    const el = wrapRef.current;
    const { selection } = editor;
    if (!el) {
      return;
    }

    if (!visible || !selection) {
      el.removeAttribute('style');
      return;
    }

    const domRange = ReactEditor.toDOMRange(editor, selection);
    const rect = domRange.getBoundingClientRect();
    if (!rect) {
      hide();
      return;
    }
    const position = getValidPopupPosition({
      anchor: rect,
      popup: el.getBoundingClientRect(),
      offset: { x: 10, y: 0 },
    });
    el.style.opacity = '1';
    el.style.top = `${position.top}px`;
    el.style.left = `${position.left}px`;
  }, [visible, editor, hide]);

  useEffect(
    () => () => {
      if (timer.current) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }
    },
    [],
  );

  useEffect(() => {
    const el = wrapRef.current;
    if (!visible || !el) {
      return;
    }
    const activeEle = el.querySelector('[data-active="true"]') as HTMLLIElement;
    if (activeEle) {
      const offsetTop = activeEle.offsetTop;
      const offsetHeight = activeEle.offsetHeight;
      const halfHeight = offsetHeight / 2;
      const wrapHeight = el.offsetHeight;
      const wrapScrollTop = el.scrollTop;
      // Half of them are outside the visible range, then they need to be rolled.
      if (offsetTop > wrapHeight + wrapScrollTop - halfHeight || offsetTop + halfHeight < wrapScrollTop) {
        activeEle.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  return (
    <Portal zIndex={Z_INDEX.HOVERING_TOOLBAR}>
      <div className={styles.wrap} ref={wrapRef}>
        <Menu menus={menus} active={selected} onMenuClick={handleMenuClick} />
      </div>
    </Portal>
  );
};
