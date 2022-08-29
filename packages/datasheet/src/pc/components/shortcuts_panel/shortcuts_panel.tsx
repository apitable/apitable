import { FC } from 'react';
import * as React from 'react';
import { SystemConfig, t, Strings, StoreActions } from '@vikadata/core';
import { getShortcutKeyString } from 'pc/common/shortcut_key/keybinding_config';
import styles from './style.module.less';
import { BaseModal } from '../common';
import CloseIcon from 'static/icon/common/common_icon_close_large.svg';
import { Space } from 'antd';
import { useDispatch } from 'react-redux';
import ShortcutKeyIcon from 'static/icon/workbench/keyboardshortcuts.svg';
import { browser } from 'pc/common/browser';

export const ShortcutsPanel: FC = () => {
  const dispatch = useDispatch();

  const closeShortcutKeyPanel = () => {
    dispatch(StoreActions.setShortcutKeyPanelVisible(false));
  };

  /** 获取要显示的快捷键的数据源 */
  const generateData = () => {
    const data = new Map<string, any>();
    for (const shortcutKey of SystemConfig.shortcut_keys) {
      if (shortcutKey.show) {
        const groupName = shortcutKey.type!.toString();
        if (!data.has(groupName)) {
          data.set(groupName, []);
        }
        const findShortcut = data.get(groupName).find(element => element.descKey === shortcutKey.name!.toString());
        if (findShortcut) {
          findShortcut.keys.push(getShortcutKeyString(shortcutKey));
          continue;
        }
        data.get(groupName).push({
          keys: [getShortcutKeyString(shortcutKey)],
          descKey: shortcutKey.name!.toString(),
        });
      }
    }
    return data;
  };

  const renderList = () => {
    const list: React.ReactElement[] = [];
    generateData().forEach((value, groupName) => {
      list.push(
        <div className={styles.group}>
          <div className={styles.groupName}>{t(Strings[groupName])}</div>
          <Space className={styles.groupContent} direction="vertical" size={18}>
            {value.map(shortcutKey => (
              <div key={shortcutKey.name} className={styles.shortcutKeyItem}>
                <Space className={styles.keys} size={0}>
                  {shortcutKey.keys.map((key: string, index) => (
                    <>
                      <Space key={key} >
                        {key.split(browser.is('Windows') ? ' + ' : ' ').map(item => (
                          <div className={styles.keyItem}>{item}</div>
                        ))}
                      </Space>
                      <span className={styles.or}>{index !== shortcutKey.keys.length - 1 && t(Strings.or)}</span>
                    </>
                  ))}
                </Space>
                <div className={styles.desc}>{t(Strings[shortcutKey.descKey])}</div>
              </div>
            ))}
          </Space>
        </div>,
      );
    });
    return list;
  };

  return (
    <BaseModal
      title={
        <div className={styles.title}><ShortcutKeyIcon />{t(Strings.keybinding_show_keyboard_shortcuts_panel)}</div>
      }
      closeIcon={<CloseIcon />}
      showButton={false}
      onCancel={closeShortcutKeyPanel}
    >
      <div className={styles.container}>
        {renderList()}
      </div>
    </BaseModal>
  );
};
