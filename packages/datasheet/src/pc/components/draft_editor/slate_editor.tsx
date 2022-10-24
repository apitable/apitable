import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { Api, DatasheetApi, StoreActions, Strings, t } from '@apitable/core';
import { Spin, Tooltip } from 'antd';
import { find, keyBy, toPairs, values, keys, get } from 'lodash';
import { expandUnitModal, SelectUnitSource } from 'pc/components/catalog/permission_settings/permission/select_unit_modal';
import { MemberOptionList } from 'pc/components/list';
import { usePlatform } from 'pc/hooks/use_platform';
import { useSelector } from 'react-redux';
import styles from './styles/style.module.less';

import { useMemo, useCallback, useRef, useEffect, useState, useContext, useImperativeHandle, forwardRef } from 'react';

import * as React from 'react';
import ReactDOM from 'react-dom';
import { Editor, Transforms, Range, createEditor, Descendant, Text, Node } from 'slate';
import { withHistory } from 'slate-history';
import { MemberItem } from 'pc/components/multi_grid/cell/cell_member/member_item';
import { Slate, Editable, ReactEditor, withReact, useSelected, useFocused } from 'slate-react';
import { IS_FIREFOX } from 'pc/components/slate_editor/helpers/browser';
import { store } from 'pc/store';
import { Emoji } from 'pc/components/common';
import { ActivityContext } from '../expand_record/activity_pane/activity_context';
import { draft2slate, EMPTY_CONTENT } from './utils/draft_slate';
import classnames from 'classnames';
import { getValidSelection } from 'pc/components/slate_editor/helpers/utils';
import { getSocialWecomUnitName } from 'pc/components/home/social_platform';
import { fixImeInputBug } from 'pc/components/slate_editor/slate_editor';

const withLastSelection = editor => {
  // 失焦记录位置
  const { onChange } = editor;
  editor.onChange = (...params) => {
    // 记录最后一次selection值，确保编辑器失焦后能将新节点插入正确的位置，比如新加一个链接元素
    if (editor.selection) {
      // ref.current = editor.selection as unknown as Selection;
      editor.lastSelection = (editor.selection as unknown) as Selection;
    }
    onChange(...params);
  };
  return editor;
};

const Portal = ({ children }) => {
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

export type ILinkElement = {
  type: 'link';
  data: {
    href: string;
    text: string;
  };
  children: IText[];
};

const LINE_HEIGHT = 22;
function calcContainerStyle(maxRow: number): React.CSSProperties{
  return {
    maxHeight: maxRow * LINE_HEIGHT + 'px',
    overflowY: 'auto',
  };
}

const SlateEditor = (props, ref) => {
  const { readOnly, placeHolder, submit, syncContent, noMention, maxRow,
    initialValue, emojis, handleEmoji, onBlur, className } = props;
  // blocks
  const membersListRef = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState<Descendant[]>(() => {
    return draft2slate(initialValue);
  });
  const selfUserId = useSelector(state => state.user.info?.userId);
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
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
      const [match] = Editor.nodes(editor, { match: n => Text.isText(n) });
      if (match) {
        const [node, path] = match;
        const lastLevel = path.pop();
        const nodeText = Node.string(node);
        if (!lastLevel) {
          // 修复firefox在一行开头混合输入文字重复
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

  // 同步点赞用户的信息
  useEffect(() => {
    toPairs(emojis).forEach(([k, v]) => {
      if (v && (v as any).length) {
        (v as any).forEach(userId => {
          const unit = find(values(unitMap), { userId });
          if (!unit) {
            DatasheetApi.fetchUserList(datasheetId, [userId]).then(res => {
              const {
                data: { data: resData, success },
              } = res as any;
              if (!resData?.length || !success) {
                console.log(`用户 ${userId} 获取失败`);
              } else {
                store.dispatch(StoreActions.updateUserMap(keyBy(resData, 'userId')));
              }
            });
          }
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasheetId, JSON.stringify(emojis), unitMap]);

  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [members, setMembers] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const renderElement = useCallback(props => <Element {...props}/>, []);
  const editor = useMemo(
    () => withLink(withMentions(withReact(withHistory(withLastSelection(createEditor() as ReactEditor))))),
    []
  );

  const clearContent = useCallback(() => {
    const point = { path: [0, 0], offset: 0 };
    editor.selection = { anchor: point, focus: point }; // clean up selection
    editor.history = { redos: [], undos: [] }; // clean up history
    setValue(EMPTY_CONTENT); // reset to empty state
    syncContent && syncContent(EMPTY_CONTENT);
  }, [editor, syncContent]);

  const focus = (isInsert?: boolean) => {
    ReactEditor.focus(editor);
    // 手动设置鼠标定位展示
    if (isInsert) {
      Transforms.insertNodes(editor, { text: '' });
    }
  };

  const insertMention = useCallback((editor, member) => {
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
  }, [search.length]);

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
        // 清除内容
        clearContent();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replyUnitId]);

  useImperativeHandle(ref, () => ({
    clear: clearContent,
    focus,
  }));

  const getMembers = (keyword = '') => {
    setMembers([]);
    setLoading(true);
    Api.loadOrSearch({ keyword })
      .then(res => {
        setMembers(res.data?.data ?? []);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onKeyDown = useCallback(
    (event) => {
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
      // 最后一级为text节点，需要比较上一级节点的path
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
            <div
              ref={membersListRef}
              className={styles.members}
              data-cy="mentions-portal"
            >
              {loading ? <div className={styles.loading}>
                <Spin size="small" indicator={<LoadingOutlined />} />
              </div> :
                <>
                  <MemberOptionList
                    listData={members}
                    existValues={[]}
                    multiMode={false}
                    onClickItem={(data)=>{
                      const memberId = data && data[0];
                      const member = members.find(item => item.unitId === memberId);
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
                      onMouseUp={e => {
                        setVisible(false);
                        expandUnitModal({
                          source: SelectUnitSource.Member,
                          onSubmit: values => {
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
                      onMouseDown={e => {
                        e.preventDefault();
                      }}
                    >
                      {t(Strings.see_more)}
                    </div>
                  )}
                </>
              }
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
            const names = v.map(userId => {
              const unit = find(values(unitMap), { userId });
              const title = getSocialWecomUnitName({
                name: unit?.name,
                isModified: unit?.isMemberNameModified,
                spaceInfo,
              });
              return title;
            });
            const namesShow = names.map((name, idx) => (
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

const withMentions = editor => {
  const { isInline, isVoid } = editor;

  editor.isInline = element => {
    return element.type === 'mention' || isInline(element);
  };

  editor.isVoid = element => {
    return element.type === 'mention' || isVoid(element);
  };

  return editor;
};

const withLink = editor => {
  const { isInline, isVoid } = editor;

  editor.isInline = element => {
    return element.type === 'link' || isInline(element);
  };

  editor.isVoid = element => {
    return element.type === 'link' || isVoid(element);
  };

  return editor;
};

const Element = props => {
  const { attributes, children, element } = props;
  if (element.type === 'link') {
    return <LinkElement {...props} />;
  } else if (element.type === 'mention') {
    return <MentionElement {...props} />;
  }
  return <div {...attributes}>{children}</div>;
};

const MentionElement = ({ attributes, children, element }) => {
  const adjustStyle = element.data?.avatar ? {} : { top: 0 };
  const focused = useFocused();
  const selected = useSelected();

  return (
    <span
      {...attributes}
      className={styles.wrap}
    >
      <span
        contentEditable={false}
        className={styles.mention}
        style={adjustStyle}>
        <MemberItem
          selected={selected && focused}
          unitInfo={element.data}
          style={{ margin: 0 }}/>
      </span>
      {children}
    </span>
  );
};

const LinkElement = ({ attributes, children, element }) => {
  return (
    <span
      {...attributes}
      className={styles.link}
    >
      <a href={element.data.href} target='_blank' rel="noreferrer">{element.data.raw}</a>
      {children}
    </span>
  );
};

export default forwardRef(SlateEditor);
