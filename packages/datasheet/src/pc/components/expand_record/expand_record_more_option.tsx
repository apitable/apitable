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

import { useContext } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import urlcat from 'urlcat';
import { useToggle, useClickAway } from 'ahooks';
import { useRequest } from 'pc/hooks';
import { Menu, Dropdown, Switch } from 'antd';
import { CollaCommandName, ExecuteResult, Selectors, ConfigConstant, Strings, t } from '@apitable/core';
import { LinkOutlined, DeleteOutlined, MoreOutlined, HistoryOutlined, InfoCircleOutlined } from '@apitable/icons';
import { IconButton, useThemeColors } from '@apitable/components';

import { Message } from 'pc/components/common';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { notifyWithUndo } from 'pc/components/common/notify';

import { useCatalogTreeRequest } from 'pc/hooks';

import { resourceService } from 'pc/resource_service';

import { EXPAND_RECORD_OPERATE_BUTTON } from 'pc/utils/test_id_constant';
import { copy2clipBoard } from 'pc/utils';

import styles from 'pc/components/expand_record/style.module.less';
import EditorTitleContext from './editor_title_context';
import classNames from 'classnames';

interface IExpandRecordMoreOptionProps {
  expandRecordId: string;
  modalClose(): void;
  datasheetId: string;
  fromCurrentDatasheet: boolean;
  sourceViewId?: string;
}

const MORE_BTN_CLASS_NAME = 'expand-record-more-btn';

export const ExpandRecordMoreOption: React.FC<React.PropsWithChildren<IExpandRecordMoreOptionProps>> = (props) => {
  const { expandRecordId, modalClose, datasheetId, sourceViewId, fromCurrentDatasheet } = props;
  const colors = useThemeColors();
  const rowRemovable = useSelector(state => Selectors.getPermissions(state, datasheetId).rowRemovable);
  const viewId = useSelector(state => {
    return sourceViewId || Selectors.getCurrentView(state, datasheetId)!.id;
  });
  const mirrorId = useSelector(state => state.pageParams.mirrorId);
  const showRecordHistory = useSelector(state => Selectors.getRecordHistoryStatus(state, datasheetId))!;

  const permissions = useSelector(state => Selectors.getPermissions(state, datasheetId, undefined, mirrorId));
  const curMirrorId = useSelector(state => mirrorId || state.pageParams.mirrorId);
  const showHistorySwitch = permissions.manageable && !curMirrorId;

  const isEmbed = useSelector(state => Boolean(state.pageParams.embedId));

  const { updateNodeRecordHistoryReq } = useCatalogTreeRequest();
  const { run: updateNodeRecordHistory } = useRequest(updateNodeRecordHistoryReq, { manual: true });

  const {
    fieldDescCollapseStatusMap = {},
    setFieldDescCollapseStatusMap,
  } = useContext(EditorTitleContext);

  const fieldDescCollapseStatus = fieldDescCollapseStatusMap![datasheetId];
  const closeAllFieldsDesc = Boolean(fieldDescCollapseStatus?.collapseAll);

  const [switchLoading, { toggle: toggleSwitchLoading, set: setSwitchLoading }] = useToggle(false);
  const [menuVisible, { toggle: toggleMenu }] = useToggle(false);

  useClickAway(() => {
    if (!menuVisible) return;

    toggleMenu();
  }, [
    () => {
      const list: NodeListOf<HTMLElement> = document.querySelectorAll(`.${MORE_BTN_CLASS_NAME}`);
      return list.length ? list[list.length - 1] : null;
    },
    () => document.querySelector(`.${styles.moreOptionMenu}`),
  ]);

  const deleteRecord = () => {
    const { result } = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.DeleteRecords,
      data: [expandRecordId],
      datasheetId: datasheetId,
    });

    if (ExecuteResult.Success === result) {
      notifyWithUndo(t(Strings.notification_delete_record_by_count, {
        count: 1,
      }), NotifyKey.DeleteRecord);
    }

    toggleMenu();
    modalClose();
  };

  const copyLink = () => {
    let thisRecordURL = urlcat(window.location.origin, '/workbench/:datasheetId/:viewId/:expandRecordId', {
      datasheetId, viewId, expandRecordId,
    });
    if (mirrorId && fromCurrentDatasheet) {
      thisRecordURL = urlcat(window.location.origin, '/workbench/:mirrorId/:datasheetId/:viewId/:expandRecordId', {
        datasheetId, viewId, expandRecordId, mirrorId,
      });
    }

    copy2clipBoard(thisRecordURL, () => {
      Message.success({ content: t(Strings.link_copy_success) });
    });

    toggleMenu();
  };

  const handleHistorySwitch = () => {
    toggleSwitchLoading();
    updateNodeRecordHistory(
      datasheetId,
      ConfigConstant.NodeType.DATASHEET,
      showRecordHistory ? ConfigConstant.ShowRecordHistory.CLOSE : ConfigConstant.ShowRecordHistory.OPEN
    ).then(() => {
      setSwitchLoading(false);
    });
  };

  const toggleFieldsDesc = () => {
    const nextState = !closeAllFieldsDesc;
    const fieldDescCollapseMap = fieldDescCollapseStatus?.fieldDescCollapseMap || {};
    const nextFieldDescCollapseMap =
      Object.keys(fieldDescCollapseMap)
        .reduce((acc, cur) => {
          acc[cur] = nextState;
          return acc;
        }, {});

    setFieldDescCollapseStatusMap({
      ...fieldDescCollapseStatusMap,
      [datasheetId]: {
        ...fieldDescCollapseStatus,
        collapseAll: nextState,
        fieldDescCollapseMap: nextFieldDescCollapseMap,
      },
    });
    if (nextState) {
      Message.info({ content: t(Strings.message_hidden_field_desc) });
    } else {
      Message.info({ content: t(Strings.message_shown_field_desc) });
    }
  };

  const renderMenu = () => (
    (
      <Menu className={styles.moreOptionMenu}>
        <Menu.Item
          key="copy"
          icon={<LinkOutlined color={colors.thirdLevelText} />}
          className={styles.moreOptionMenuItemWrapper}
          onClick={() => copyLink()}
          hidden={isEmbed}
        >
          {t(Strings.copy_url_line)}
        </Menu.Item>
        {showHistorySwitch && (
          <Menu.Item
            key="show-history"
            icon={<HistoryOutlined color={colors.thirdLevelText} />}
            className={styles.moreOptionMenuItemWrapper}
            onClick={() => handleHistorySwitch()}
          >
            <div className={styles.showHistoryMenuItem}>
              <span className={styles.showHistoryMenuText}>
                {t(Strings.show_record_history)}
              </span>
              <Switch loading={switchLoading} size="small" checked={showRecordHistory} />
            </div>
          </Menu.Item>
        )}

        <Menu.Item
          key="expand-desc"
          icon={<InfoCircleOutlined color={colors.thirdLevelText} />}
          className={styles.moreOptionMenuItemWrapper}
          onClick={() => toggleFieldsDesc()}
        >
          <div className={styles.showHistoryMenuItem}>
            <span className={styles.showHistoryMenuText}>
              {t(Strings.expand_all_field_desc)}
            </span>
            <Switch
              size="small"
              checked={!closeAllFieldsDesc}
            />
          </div>
        </Menu.Item>

        {rowRemovable && <Menu.Divider />}
        {rowRemovable && <Menu.Item
          key="delete"
          icon={<DeleteOutlined color={colors.thirdLevelText} />}
          className={styles.moreOptionMenuItemWrapper}
          onClick={() => deleteRecord()}
        >
          {t(Strings.delete_row)}
        </Menu.Item>}
      </Menu>
    )
  );

  /* TODO: ContextMenu does not support non-String types, you need to upgrade ContextMenu to not use antd */
  return (
    <Dropdown overlay={renderMenu()} visible={menuVisible} className={styles.moreOptionMenuDropdown} >
      <IconButton
        data-test-id={EXPAND_RECORD_OPERATE_BUTTON}
        component="button"
        shape="square"
        className={classNames(styles.icon, MORE_BTN_CLASS_NAME)}
        icon={() => <MoreOutlined size={16} color={colors.thirdLevelText} />}
        onClick={() => toggleMenu()}
      />
    </Dropdown>
  );
};
