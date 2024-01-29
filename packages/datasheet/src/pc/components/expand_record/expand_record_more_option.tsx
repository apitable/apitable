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

import { useToggle, useClickAway } from 'ahooks';
import { Menu, Dropdown } from 'antd';
import classNames from 'classnames';
import parser from 'html-react-parser';
import { useContext } from 'react';
import * as React from 'react';
import urlcat from 'urlcat';
import { IconButton, useThemeColors, Switch } from '@apitable/components';
import { CollaCommandName, ExecuteResult, Selectors, ConfigConstant, Strings, t } from '@apitable/core';
import { LinkOutlined, DeleteOutlined, MoreOutlined, HistoryOutlined, InfoCircleOutlined, ArchiveOutlined } from '@apitable/icons';
import { Message } from 'pc/components/common/message/message';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { notifyWithUndo } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import styles from 'pc/components/expand_record/style.module.less';
import { useCatalogTreeRequest } from 'pc/hooks/use_catalogtree_request';
import { useRequest } from 'pc/hooks/use_request';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { copy2clipBoard } from 'pc/utils/dom';
import { EXPAND_RECORD_OPERATE_BUTTON } from 'pc/utils/test_id_constant';
import EditorTitleContext from './editor_title_context';

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
  const rowRemovable = useAppSelector((state) => Selectors.getPermissions(state, datasheetId).rowRemovable);
  const viewId = useAppSelector((state) => {
    return sourceViewId || Selectors.getCurrentView(state, datasheetId)!.id;
  });
  const mirrorId = useAppSelector((state) => state.pageParams.mirrorId);
  const showRecordHistory = useAppSelector((state) => Selectors.getRecordHistoryStatus(state, datasheetId))!;

  const permissions = useAppSelector((state) => Selectors.getPermissions(state, datasheetId, undefined, mirrorId));
  const curMirrorId = useAppSelector((state) => mirrorId || state.pageParams.mirrorId);
  const showHistorySwitch = permissions.manageable && !curMirrorId;

  const isEmbed = useAppSelector((state) => Boolean(state.pageParams.embedId));

  const { updateNodeRecordHistoryReq } = useCatalogTreeRequest();
  const { run: updateNodeRecordHistory } = useRequest(updateNodeRecordHistoryReq, { manual: true });

  const { fieldDescCollapseStatusMap = {}, setFieldDescCollapseStatusMap } = useContext(EditorTitleContext);

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

  const archiveRecord = () => {
    const { result } = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.ArchiveRecords,
      data: [expandRecordId],
      datasheetId: datasheetId,
    });

    if (ExecuteResult.Success === result) {
      Message.success({ content: t(Strings.archive_record_success) });
    }

    toggleMenu();
    modalClose();
  };

  const deleteRecord = () => {
    const { result } = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.DeleteRecords,
      data: [expandRecordId],
      datasheetId: datasheetId,
    });

    if (ExecuteResult.Success === result) {
      notifyWithUndo(
        t(Strings.notification_delete_record_by_count, {
          count: 1,
        }),
        NotifyKey.DeleteRecord,
      );
    }

    toggleMenu();
    modalClose();
  };

  const copyLink = () => {
    let thisRecordURL = urlcat(window.location.origin, '/workbench/:datasheetId/:viewId/:expandRecordId', {
      datasheetId,
      viewId,
      expandRecordId,
    });
    if (mirrorId && fromCurrentDatasheet) {
      thisRecordURL = urlcat(window.location.origin, '/workbench/:mirrorId/:datasheetId/:viewId/:expandRecordId', {
        datasheetId,
        viewId,
        expandRecordId,
        mirrorId,
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
      showRecordHistory ? ConfigConstant.ShowRecordHistory.CLOSE : ConfigConstant.ShowRecordHistory.OPEN,
    ).then(() => {
      setSwitchLoading(false);
    });
  };

  const toggleFieldsDesc = () => {
    const nextState = !closeAllFieldsDesc;
    const fieldDescCollapseMap = fieldDescCollapseStatus?.fieldDescCollapseMap || {};
    const nextFieldDescCollapseMap = Object.keys(fieldDescCollapseMap).reduce((acc, cur) => {
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

  const getArchiveNotice = (content) => {
    return <div>{parser(content)}</div>;
  };

  const renderMenu = () => (
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
            <span className={styles.showHistoryMenuText}>{t(Strings.show_record_history)}</span>
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
          <span className={styles.showHistoryMenuText}>{t(Strings.expand_all_field_desc)}</span>
          <Switch size="small" checked={!closeAllFieldsDesc} />
        </div>
      </Menu.Item>

      {rowRemovable && <Menu.Divider />}
      {fromCurrentDatasheet && rowRemovable && !mirrorId && permissions.manageable && (
        <Menu.Item
          key="archive"
          icon={<ArchiveOutlined color={colors.thirdLevelText} />}
          className={styles.moreOptionMenuItemWrapper}
          onClick={() => {
            Modal.warning({
              title: t(Strings.archive_record_in_menu),
              content: getArchiveNotice(t(Strings.archive_notice)),
              onOk: () => archiveRecord(),
              closable: true,
              hiddenCancelBtn: false,
            });
          }}
        >
          {t(Strings.archive_record_in_menu)}
        </Menu.Item>
      )}
      {rowRemovable && (
        <Menu.Item
          key="delete"
          icon={<DeleteOutlined color={colors.thirdLevelText} />}
          className={styles.moreOptionMenuItemWrapper}
          onClick={() => deleteRecord()}
        >
          {t(Strings.delete_row)}
        </Menu.Item>
      )}
    </Menu>
  );

  /* TODO: ContextMenu does not support non-String types, you need to upgrade ContextMenu to not use antd */
  return (
    <Dropdown overlay={renderMenu()} visible={menuVisible} className={styles.moreOptionMenuDropdown}>
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
