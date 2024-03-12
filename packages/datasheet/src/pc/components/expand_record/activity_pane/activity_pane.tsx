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

import { useLocalStorageState } from 'ahooks';
import { Dropdown, Menu } from 'antd';
import classNames from 'classnames';
import { pick } from 'lodash';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { IconButton, useThemeColors } from '@apitable/components';
import { CollaCommandName, Selectors, Strings, t } from '@apitable/core';
import { CloseOutlined, DeleteOutlined, QuestionCircleOutlined, ChevronDownOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { MobileContextMenu, Tooltip } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { Modal } from 'pc/components/common/mobile/modal';
import { useResponsive } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { ACTIVITY_SELECT_MAP, ActivitySelectType } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { ActivityContext } from './activity_context';
import { ActivityList } from './activity_list/activity_list';

import { CommentEditor } from './comment_editor';
import { IActivityPaneProps, ICacheType, IChooseComment } from './interface';
import styles from './style.module.less';

export const ActivityPaneBase: React.FC<React.PropsWithChildren<IActivityPaneProps>> = (props) => {
  const { expandRecordId, datasheetId, viewId, mirrorId, fromCurrentDatasheet, style, closable, onClose } = props;
  const colors = useThemeColors();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const [focus, setFocus] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [emojis, setEmojis] = useState({});
  const [commentReplyMap, updateCommentReplyMap] = useState({});
  const [replyUnitId, setReplyUnitId] = useState<string>();

  const [chooseComment, setChooseComment] = React.useState<IChooseComment>();

  const [selectOpen, setSelectOpen] = useState(false);

  // Current operating mode
  const unitMap = useAppSelector((state) => Selectors.getUnitMap(state));
  const showRecordHistory = useAppSelector((state) => Selectors.getRecordHistoryStatus(state, datasheetId))!;
  const [cacheType, setCacheType] = useLocalStorageState<ICacheType>('vika_activity_type', { defaultValue: {} });
  const handleCacheType = useCallback(
    (type: ActivitySelectType) => {
      setCacheType({
        ...cacheType,
        [datasheetId]: type,
      });
    },
    [cacheType, datasheetId, setCacheType],
  );
  const [selectType, setSelectType] = useState<ActivitySelectType>(() => {
    let curDSType = cacheType && cacheType[datasheetId];
    if (curDSType === ActivitySelectType.NONE) {
      // Mask out the case of NONE because ACTIVITY_SELECT_MAP does not have a value corresponding to NONE
      curDSType = ActivitySelectType.All;
    }
    if (!showRecordHistory && curDSType !== ActivitySelectType.Comment) {
      handleCacheType(ActivitySelectType.Comment);
    }
    return showRecordHistory ? curDSType || ActivitySelectType.All : ActivitySelectType.Comment;
  });

  useEffect(() => {
    if (!showRecordHistory && selectType !== ActivitySelectType.Comment) {
      setSelectType(ActivitySelectType.Comment);
      handleCacheType(ActivitySelectType.Comment);
    }
  }, [showRecordHistory, selectType, handleCacheType]);

  const handleMenuClick = (e: { key: string }) => {
    const menuKey = e.key as ActivitySelectType;
    if (ACTIVITY_SELECT_MAP[menuKey]) {
      setSelectType(menuKey);
      handleCacheType(menuKey);
      setSelectOpen(false);
    }
  };

  return (
    <ActivityContext.Provider
      value={{
        replyText,
        setReplyText,
        emojis,
        setEmojis,
        unitMap,
        datasheetId,
        focus,
        setFocus,
        replyUnitId,
        setReplyUnitId,
        commentReplyMap,
        updateCommentReplyMap,
      }}
    >
      <div className={styles.activityPane} style={style}>
        <div className={styles.paneHeader}>
          {!closable && (
            <div className={styles.paneTitle}>
              {t(Strings.activity)}
              <Tooltip title={t(Strings.activity_tip)} trigger={'hover'}>
                <a
                  href={getEnvVariables().RECORD_ACTIVITY_HELP_URL}
                  rel="noopener noreferrer"
                  target="_blank"
                  style={{ cursor: 'pointer', verticalAlign: '-0.125em', marginLeft: 4, display: 'inline-block' }}
                >
                  <QuestionCircleOutlined color={colors.thirdLevelText} />
                </a>
              </Tooltip>
            </div>
          )}
          <div>
            <Dropdown
              trigger={['click']}
              placement={closable ? 'bottomLeft' : 'bottomRight'}
              className={styles.activitySelect}
              onVisibleChange={(visible) => setSelectOpen(visible)}
              overlay={
                <Menu onClick={handleMenuClick}>
                  {Object.entries(showRecordHistory ? ACTIVITY_SELECT_MAP : pick(ACTIVITY_SELECT_MAP, ActivitySelectType.Comment)).map(
                    ([sKey, sValue]) => (
                      <Menu.Item className={classNames({ active: sKey === selectType })} key={sKey}>
                        {sValue[1]}
                      </Menu.Item>
                    ),
                  )}
                </Menu>
              }
            >
              <div>
                {ACTIVITY_SELECT_MAP[selectType][1]}
                <span className={classNames(styles.selectIcon, { [styles.open!]: selectOpen })}>
                  <ChevronDownOutlined size={16} color={colors.thirdLevelText} />
                </span>
              </div>
            </Dropdown>
          </div>
          {closable && !isMobile && (
            <IconButton
              icon={CloseOutlined}
              shape="square"
              onClick={() => {
                onClose && onClose();
              }}
            />
          )}
        </div>
        <ActivityList
          expandRecordId={expandRecordId}
          datasheetId={datasheetId}
          mirrorId={mirrorId}
          selectType={selectType}
          setChooseComment={setChooseComment}
          fromCurrentDatasheet={fromCurrentDatasheet}
        />
        {selectType !== ActivitySelectType.Changeset && (
          <div className={styles.panelBottom}>
            <div className={styles.dividerLine} />
            <CommentEditor expandRecordId={expandRecordId} datasheetId={datasheetId} viewId={viewId} />
          </div>
        )}
        <MobileContextMenu
          title={t(Strings.operation)}
          visible={Boolean(chooseComment)}
          onClose={() => {
            setChooseComment(undefined);
          }}
          data={[
            [
              {
                icon: <DeleteOutlined color={colors.thirdLevelText} />,
                text: t(Strings.delete),
                isWarn: true,
                onClick: () => {
                  if (chooseComment) {
                    const { comment, datasheetId, expandRecordId } = chooseComment;
                    Modal.warning({
                      title: t(Strings.delete_comment_tip_title),
                      content: t(Strings.delete_comment_tip_content),
                      okText: t(Strings.delete),
                      onOk: () => {
                        resourceService.instance!.commandManager.execute({
                          cmd: CollaCommandName.DeleteComment,
                          datasheetId: datasheetId,
                          recordId: expandRecordId,
                          comment,
                        });
                        setChooseComment(undefined);
                      },
                    });
                  }
                },
              },
            ],
          ]}
          height="auto"
        />
      </div>
    </ActivityContext.Provider>
  );
};

const ActivityPane = React.memo(ActivityPaneBase);

export default ActivityPane;
