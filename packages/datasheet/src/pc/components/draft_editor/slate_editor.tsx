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

import { Spin, Tooltip } from 'antd';
import classnames from 'classnames';
import { find, get, keyBy, keys, toPairs, values } from 'lodash';
import * as React from 'react';
import { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { createEditor, Descendant, Editor, Node, Range, Text, Transforms } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import { Editable, ReactEditor, Slate, useFocused, useSelected, withReact } from 'slate-react';
import { Api, DatasheetApi, StoreActions, Strings, t } from '@apitable/core';
import { LoadingOutlined } from '@apitable/icons';
import { expandUnitModal, SelectUnitSource } from 'pc/components/catalog/permission_settings/permission/select_unit_modal';
import { Emoji } from 'pc/components/common';
import { MemberOptionList } from 'pc/components/list';
import { MemberItem } from 'pc/components/multi_grid/cell/cell_member/member_item';
import { IS_FIREFOX } from 'pc/components/slate_editor/helpers/browser';
import { getValidSelection } from 'pc/components/slate_editor/helpers/utils';
import { fixImeInputBug } from 'pc/components/slate_editor/slate_editor';
import { usePlatform } from 'pc/hooks/use_platform';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { ActivityContext } from '../expand_record/activity_pane/activity_context';
import styles from './styles/style.module.less';
import { draft2slate, EMPTY_CONTENT } from './utils/draft_slate';
// @ts-ignore
import { getSocialWecomUnitName } from 'enterprise/home';

const withLastSelection = (editor: ReactEditor) => {
  const { onChange } = editor;
  editor.onChange = (...params) => {
    if (editor.selection) {
      // ref.current = editor.selection as unknown as Selection;
      // @ts-ignore
      editor.lastSelection = editor.selection as unknown as Selection;
    }
    onChange(...params);
  };
  return editor;
};

const Portal = ({ children }: { children: any }) => {
  return typeof document === 'object' ? ReactDOM.createPortal(children, document.body) : null;
};

export type IText = {
  text: string;
};

export type IMentionElement = {
  type: 'mention';
  data: object;
  children: IText[];
};

const LINE_HEIGHT = 22;

function calcContainerStyle(maxRow: number): React.CSSProperties {
  return {
    maxHeight: maxRow * LINE_HEIGHT + 'px',
    overflowY: 'auto',
  };
}

const SlateEditor = (props: any, ref: React.Ref<unknown>) => {
  const { readOnly, placeHolder, submit, syncContent, noMention, maxRow, initialValue, emojis, handleEmoji, onBlur, className } = props;
  // blocks
  const membersListRef = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState<Descendant[]>(() => {
    return draft2slate(initialValue);
  });
  const selfUserId = useAppSelector((state) => state.user.info?.userId);
  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);
  const { mobile } = usePlatform();
  const {
    unitMap,
    datasheetId,
    // focus: focusStatus, setFocus,
    replyUnitId,
  } = useContext(ActivityContext);
  const imeInputText = useRef('');

  const fixFirefoxImeInputRepeatWordBug = () => {
    if (imeInputText.current && IS_FIREFOX) {
      const imeText = imeInputText.current;
      imeInputText.current = '';
      const [match] = Editor.nodes(editor, { match: (n) => Text.isText(n) });
      if (match) {
        const [node, path] = match;
        const lastLevel = path.pop();
        const nodeText = Node.string(node);
        if (!lastLevel) {
          const firstPath = [...path, 0];
          if (nodeText === imeText) {
            Transforms.removeNodes(editor, { at: firstPath });
            requestAnimationFrame(() => {
              Transforms.select(editor, firstPath);
              Transforms.collapse(editor, { edge: 'end' });
              Transforms.insertNodes(editor, { text: nodeText }, { at: firstPath });
              Transforms.delete(editor, { unit: 'character', distance: nodeText.length, reverse: true });
            });
          }
        }
      }
    }
  };

  useEffect(() => {
    toPairs(emojis).forEach(([, v]) => {
      if (v && (v as any).length) {
        (v as any).forEach((userId: string) => {
          const unit = find(values(unitMap), { userId });
          if (!unit) {
            DatasheetApi.fetchUserList(datasheetId, [userId]).then((res) => {
              const {
                data: { data: resData, success },
              } = res as any;
              if (!resData?.length || !success) {
                console.log(`User ${userId} Failed to get`);
              } else {
                store.dispatch(StoreActions.updateUserMap(keyBy(resData, 'userId')));
              }
            });
          }
        });
      }
    });
    // eslint-disable-next-line
  }, [datasheetId, JSON.stringify(emojis), unitMap]);

  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [members, setMembers] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const editor = useMemo(() => withLink(withMentions(withReact(withHistory(withLastSelection(createEditor() as ReactEditor))))), []);

  const clearContent = useCallback(() => {
    const point = { path: [0, 0], offset: 0 };
    editor.selection = { anchor: point, focus: point }; // clean up selection
    editor.history = { redos: [], undos: [] }; // clean up history
    editor.children = EMPTY_CONTENT; // reset to empty state
    setValue(EMPTY_CONTENT); // reset to empty state
    syncContent && syncContent(EMPTY_CONTENT);
  }, [editor, syncContent]);

  const focus = (isInsert?: boolean) => {
    ReactEditor.focus(editor);
    if (isInsert) {
      Transforms.insertNodes(editor, { text: '' });
    }
  };

  const insertMention = useCallback(
    (editor: any, member: any) => {
      if (!member) {
        return;
      }
      const selection = getValidSelection(editor);
      Transforms.select(editor, selection);
      Transforms.delete(editor, { distance: search.length + 1, reverse: true, unit: 'character' });
      const mention: IMentionElement = {
        type: 'mention',
        data: member,
        children: [{ text: '' }],
      };
      Transforms.insertNodes(editor, mention);
      Transforms.move(editor);
    },
    [search.length],
  );

  useEffect(() => {
    if (readOnly) return;
    if (replyUnitId) {
      const unit = unitMap![replyUnitId];
      const isSelf = selfUserId === unit.userId;
      if (!isSelf) {
        const mention: IMentionElement = {
          type: 'mention',
          data: unit,
          children: [{ text: '' }],
        };
        Transforms.delete(editor, {
          at: {
            anchor: Editor.start(editor, []),
            focus: Editor.end(editor, []),
          },
        });
        Transforms.insertNodes(editor, mention);
        Transforms.move(editor);
      } else {
        clearContent();
      }
    }
    // eslint-disable-next-line
  }, [replyUnitId]);

  useImperativeHandle(ref, () => ({
    clear: clearContent,
    focus,
  }));

  const getMembers = (keyword = '') => {
    setMembers([]);
    setLoading(true);
    Api.loadOrSearch({ keyword })
      .then((res) => {
        setMembers(res.data?.data ?? []);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onKeyDown = useCallback(
    (event: any) => {
      if (visible) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            const prevIndex = index >= members.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          case 'ArrowUp':
            event.preventDefault();
            const nextIndex = index <= 0 ? members.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          case 'Tab':
          case 'Enter':
            event.preventDefault();
            insertMention(editor, members[index]);
            setVisible(false);
            break;
          case 'Escape':
            event.preventDefault();
            setVisible(false);
            break;
        }
      } else {
        if (event.keyCode === 13) {
          if (mobile) {
            return;
          }
          if (event.shiftKey) {
            return;
          }
          event.preventDefault();
          submit && submit();
          submit && clearContent();
          return;
        }
      }
    },
    [visible, index, members, insertMention, editor, mobile, submit, clearContent],
  );

  useEffect(() => {
    if (visible) {
      const el = membersListRef.current as HTMLElement;
      const selection = getValidSelection(editor);
      const domRange = ReactEditor.toDOMRange(editor, selection);
      const rect = domRange.getBoundingClientRect();
      let height = 0;
      const HEIGHT = mobile ? 48 : 32;
      const LEN = mobile ? 7 : 10;
      if (members.length * HEIGHT > 312) {
        height = LEN * HEIGHT + 30;
      } else {
        height = members.length * HEIGHT + 30;
      }

      el.style.height = `${height}px`;

      el.style.bottom = `${window.innerHeight - rect.bottom + 16}px`;

      if (rect.left + el.offsetWidth + 8 > window.innerWidth) {
        el.style.left = `${window.innerWidth - el.offsetWidth - 8 + window.pageXOffset}px`;
      } else {
        el.style.left = `${rect.left + window.pageXOffset}px`;
      }
    }
  }, [members.length, editor, index, search, visible, loading, mobile]);

  const changeHandler = (value: Descendant[]) => {
    if (readOnly) return;
    setValue(value);
    syncContent && syncContent(value);
    fixFirefoxImeInputRepeatWordBug();
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection);
      const wordBefore = Editor.before(editor, start, { unit: 'word' });
      const beforeWordRange = wordBefore && Editor.range(editor, wordBefore, start);
      const beforeWord = beforeWordRange && Editor.string(editor, beforeWordRange);
      const before = wordBefore && Editor.before(editor, wordBefore);
      const beforeRange = before && Editor.range(editor, before, start);
      const beforeText = beforeRange && Editor.string(editor, beforeRange);
      const testMatchText = beforeText || beforeWord;
      const beforeMatch = testMatchText && testMatchText.match(/^.*@([\u4e00-\u9fa5\w]{1,5})?$/);
      const after = Editor.after(editor, start);
      const afterRange = Editor.range(editor, start, after);
      const afterText = Editor.string(editor, afterRange);
      const afterMatch = afterText.match(/^(\s|$)/);
      const wordBeforePath = wordBefore && [...wordBefore.path];
      const startPath = [...start.path];
      wordBeforePath && wordBeforePath.pop();
      startPath.pop();
      // const isSameBlock = wordBeforePath && Path.equals(wordBeforePath, startPath);
      if (beforeMatch && afterMatch && !noMention) {
        const keyword = beforeMatch[1] || '';
        setVisible(true);
        getMembers(keyword);
        setSearch(keyword);
        setIndex(0);
        return;
      }
    }

    setVisible(false);
  };

  return (
    <div className={styles.slateEditor} style={{ ...calcContainerStyle(maxRow) }}>
      <Slate editor={editor} value={value} onChange={changeHandler}>
        <Editable
          readOnly={readOnly}
          renderElement={renderElement}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          className={classnames(styles.edit, className)}
          placeholder={readOnly ? '' : placeHolder || t(Strings.comment_editor_default_tip)}
          onCompositionEnd={(e: React.CompositionEvent) => {
            const data = e.data;
            IS_FIREFOX && (imeInputText.current = data);
            return fixImeInputBug(e, editor);
          }}
        />
        <Portal>
          {visible && (
            <div ref={membersListRef} className={styles.members} data-cy="mentions-portal">
              {loading ? (
                <div className={styles.loading}>
                  <Spin size="small" indicator={<LoadingOutlined className="circle-loading" />} />
                </div>
              ) : (
                <>
                  <MemberOptionList
                    listData={members}
                    existValues={[]}
                    multiMode={false}
                    onClickItem={(data) => {
                      const memberId = data && data[0];
                      const member = members.find((item) => item.unitId === memberId);
                      if (member) {
                        insertMention(editor, member);
                      }
                      setVisible(false);
                    }}
                    activeIndex={index}
                    showMoreTipButton={false}
                    showSearchInput={false}
                    sourceId={datasheetId}
                    uniqId={'unitId'}
                    unitMap={unitMap}
                  />
                  {members.length > 0 && (
                    <div
                      className={styles.seeMore}
                      onMouseUp={() => {
                        setVisible(false);
                        expandUnitModal({
                          source: SelectUnitSource.Member,
                          onSubmit: (values) => {
                            const _member = values[0];
                            if ('roleId' in _member) {
                              insertMention(editor, {
                                ..._member,
                                isDeleted: false,
                                type: 1,
                                name: _member.roleName,
                              });
                              return;
                            }
                            if (get(_member, 'teamId')) {
                              if ('teamName' in _member) {
                                insertMention(editor, {
                                  ..._member,
                                  isDeleted: false,
                                  type: 1,
                                  name: _member.teamName,
                                });
                              }
                              return;
                            }
                            if ('memberName' in _member) {
                              insertMention(editor, {
                                ..._member,
                                isDeleted: false,
                                type: 3,
                                name: _member.originName || _member.memberName,
                              });
                            }
                          },
                          isSingleSelect: true,
                          onClose: () => {},
                          showTab: true,
                        });
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                    >
                      {t(Strings.see_more)}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </Portal>
      </Slate>
      {Boolean(emojis) && (
        <div className={styles.emojiWrapper}>
          {keys(emojis).map((k, index) => {
            const v = emojis[k];
            if (!v || !v.length) {
              return null;
            }
            const names = v.map((userId: string) => {
              const unit = find(values(unitMap), { userId });
              return (
                getSocialWecomUnitName?.({
                  name: unit?.name,
                  isModified: unit?.isMemberNameModified,
                  spaceInfo,
                }) || unit?.name
              );
            });
            const namesShow = names.map((name: any, idx: number) => (
              <span key={idx}>
                {name}
                {names.length - 1 !== idx && t(Strings.comma)}
              </span>
            ));
            return (
              <div className={styles.emojiUser} key={index}>
                <span className={styles.emojiToggle} onClick={() => handleEmoji && handleEmoji(k)}>
                  <Emoji emoji={k === 'good' ? '+1' : 'ok_hand'} size={16} />
                </span>
                {names.length > 2 ? (
                  <Tooltip title={namesShow}>
                    <span className={styles.emojiCount}>+{names.length}</span>
                  </Tooltip>
                ) : (
                  namesShow
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const withMentions = (editor: ReactEditor & HistoryEditor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element: any) => {
    return element.type === 'mention' || isInline(element);
  };

  editor.isVoid = (element: any) => {
    return element.type === 'mention' || isVoid(element);
  };

  return editor;
};

const withLink = (editor: ReactEditor & HistoryEditor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element: any) => {
    return element.type === 'link' || isInline(element);
  };

  editor.isVoid = (element: any) => {
    return element.type === 'link' || isVoid(element);
  };

  return editor;
};

const Element = (props: any) => {
  const { attributes, children, element } = props;
  if (element.type === 'link') {
    return <LinkElement {...props} />;
  } else if (element.type === 'mention') {
    return <MentionElement {...props} />;
  }
  return <div {...attributes}>{children}</div>;
};

const MentionElement = ({ attributes, children, element }: any) => {
  const adjustStyle = element.data?.avatar ? {} : { top: 0 };
  const focused = useFocused();
  const selected = useSelected();

  return (
    <span {...attributes} className={styles.wrap}>
      <span contentEditable={false} className={styles.mention} style={adjustStyle}>
        <MemberItem selected={selected && focused} unitInfo={element.data} style={{ margin: 0 }} />
      </span>
      {children}
    </span>
  );
};

const LinkElement = ({ attributes, children, element }: any) => {
  return (
    <span {...attributes} className={styles.link}>
      <a href={element.data.href} target="_blank" rel="noreferrer">
        {element.data.raw}
      </a>
      {children}
    </span>
  );
};

export default forwardRef(SlateEditor);
