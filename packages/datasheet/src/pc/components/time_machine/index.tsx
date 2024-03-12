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

import { useScroll } from 'ahooks';
import { message, Tabs } from 'antd';
import dayjs from 'dayjs';
import { difference } from 'lodash';
import Image from 'next/image';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, IconButton, Loading, Skeleton, Tooltip, Typography } from '@apitable/components';
import {
  Api,
  CollaCommandName,
  DatasheetApi,
  fastCloneDeep,
  getRollbackActions,
  IChangesetPack,
  IMemberInfoInAddressList,
  IRemoteChangeset,
  PREVIEW_DATASHEET_ID,
  ResourceType,
  Selectors,
  StoreActions,
  Strings,
  t,
  ThemeName,
} from '@apitable/core';
import { CloseOutlined, QuestionCircleOutlined } from '@apitable/icons';
import { Avatar, Modal } from 'pc/components/common';
import { notify } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { Portal } from 'pc/components/portal';
import { Beta } from 'pc/components/robot/robot_panel/robot_list_head';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import DataEmptyDark from 'static/icon/common/time_machine_empty_dark.png';
import DataEmptyLight from 'static/icon/common/time_machine_empty_light.png';
import { TabPaneKeys } from './interface';
import { getForeignDatasheetIdsByOp, getOperationInfo } from './utils';
// @ts-ignore
import { getSocialWecomUnitName } from 'enterprise/home/social_platform/utils';
// @ts-ignore
import { Backup } from 'enterprise/time_machine/backup/backup';
import styles from './style.module.less';

const { TabPane } = Tabs;

const MAX_COUNT = Number.MAX_SAFE_INTEGER;
const DATEFORMAT = 'YYYY-MM-DD HH:mm:ss';

export const TimeMachine: React.FC<React.PropsWithChildren<{ onClose: (visible: boolean) => void }>> = ({ onClose }) => {
  const datasheetId = useAppSelector(Selectors.getActiveDatasheetId)!;
  const curDatasheet = useAppSelector((state) => Selectors.getDatasheet(state, datasheetId));
  const activeNodePrivate = useAppSelector((state) => Selectors.getActiveNodePrivate(state));
  const [curPreview, setCurPreview] = useState<number | string>();
  const [changesetList, setChangesetList] = useState<IRemoteChangeset[]>([]);
  const [fetching, setFetching] = useState(false);
  const [uuidMap, setUuidMap] = useState<Record<string, IMemberInfoInAddressList>>();
  const currentRevision = useAppSelector((state) => Selectors.getResourceRevision(state, datasheetId, ResourceType.Datasheet)!);
  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);

  const uuids = useMemo(() => {
    const uuids =
      changesetList &&
      changesetList.map((item) => {
        return item.userId!;
      });
    return Array.from<string>(new Set(uuids || []));
  }, [changesetList]);

  const isEmpty = useMemo(() => {
    return !changesetList?.length;
  }, [changesetList?.length]);

  const currentDatasheetIds = useAppSelector(Selectors.getDatasheetIds);
  const [rollbackIng, setRollbackIng] = useState(false);
  const dispatch = useAppDispatch();

  const theme = useAppSelector((state) => state.theme);
  const DataEmpty = theme === ThemeName.Light ? DataEmptyLight : DataEmptyDark;

  const fetchChangesets = (lastRevision: number) => {
    setFetching(true);
    const startRevision = lastRevision - 99 > 0 ? lastRevision - 99 : 1;
    DatasheetApi.fetchChangesets<IChangesetPack>(datasheetId, ResourceType.Datasheet, startRevision, lastRevision + 1)
      .then((res) => {
        // The returned data is from low to high, when displaying, you need to display the high version first
        const csl = res.data.data.reverse();
        console.log('Load changesetList: ', csl);
        const nextCsl = changesetList.concat(csl);
        setChangesetList(nextCsl.filter((item) => item.operations.filter((op) => !op.cmd.startsWith('System')).length > 0));
      })
      .finally(() => {
        setFetching(false);
      });
  };

  const lastChangeset = changesetList[changesetList.length - 1];
  const noMore = !lastChangeset || lastChangeset.revision === 1 || changesetList.length >= MAX_COUNT;
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollInfo = useScroll(contentRef);

  useEffect(() => {
    // Load up to 500 most recent versions
    if (!contentRef.current || fetching || noMore) {
      return;
    }
    const offsetHeight = contentRef.current.offsetHeight;
    const scrollHeight = contentRef.current.scrollHeight;
    if (scrollInfo && offsetHeight + scrollInfo.top + 30 > scrollHeight) {
      fetchChangesets(lastChangeset.revision - 1);
    }
    // eslint-disable-next-line
  }, [scrollInfo]);

  useEffect(() => {
    fetchChangesets(currentRevision);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    Promise.all(
      uuids.map((id) => {
        return Api.getMemberInfo({ uuid: id });
      }),
    ).then((results) => {
      const map = {};
      results.forEach((result, index) => {
        map[uuids[index]] = result.data.data;
      });
      setUuidMap(map);
    });
  }, [uuids]);

  const executeRollback = useCallback(
    (operations: any) => {
      try {
        resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.Rollback,
          datasheetId,
          data: {
            operations,
          },
        });
        notify.open({ message: t(Strings.rollback_tip), key: NotifyKey.Rollback });
      } catch (error) {
        Modal.confirm({
          title: t(Strings.rollback_fail_title),
          content: <div dangerouslySetInnerHTML={{ __html: t(Strings.rollback_fail_content, { url: '/help/manual-timemachine/' }) }} />,
        });
      }
      dispatch(StoreActions.resetDatasheet(PREVIEW_DATASHEET_ID));
    },
    [datasheetId, dispatch],
  );

  const executePreview = useCallback(
    (operations: any, index: any) => {
      const cloneDatasheet = fastCloneDeep(curDatasheet)!;
      const actions = getRollbackActions(operations, store.getState(), cloneDatasheet.snapshot);
      console.log('---------preview actions', actions);
      const revision = `${changesetList[index].revision}`;
      setCurPreview(index);

      cloneDatasheet.id = PREVIEW_DATASHEET_ID;
      cloneDatasheet.snapshot.datasheetId = PREVIEW_DATASHEET_ID;
      // Proactively setting editable to false bypasses conflict detection and avoids pop-ups that automatically restore modal boxes
      cloneDatasheet.permissions = { ...cloneDatasheet.permissions, editable: false };
      // Identifies the current data as preview data and indicates the version of the preview
      cloneDatasheet.preview = revision;
      // Proactively setting editable to false bypasses conflict detection and avoids pop-ups that automatically restore modal boxes
      const previewSnapshot = cloneDatasheet.snapshot;
      try {
        dispatch(StoreActions.receiveDataPack({ snapshot: previewSnapshot, datasheet: cloneDatasheet }, { isPartOfData: false }));
      } catch (error) {
        console.log(error);
        Modal.error({
          title: t(Strings.preview_fail_title),
          content: <div dangerouslySetInnerHTML={{ __html: t(Strings.preview_fail_content, { url: '/help/manual-timemachine/' }) }} />,
        });
      }
    },
    [dispatch, changesetList, curDatasheet],
  );

  const execute = useCallback(
    (index: number, preview = false) => {
      const operations = changesetList
        .slice(0, index + 1)
        .map((cs) => {
          // op needs to be executed in reverse when rolling back, so the order should also be reversed first
          return cs.operations.filter((op) => !op.cmd.startsWith('System')).reverse();
        })
        .flat(1);
      const msgText = preview ? t(Strings.preview) : t(Strings.rollback);

      const foreignDatasheetIds = getForeignDatasheetIdsByOp(operations);
      const diff = difference(foreignDatasheetIds, currentDatasheetIds);
      const cmdExecute = () => {
        if (preview) {
          executePreview(operations, index);
        } else {
          executeRollback(operations);
        }
      };
      if (diff.length) {
        setRollbackIng(true);
        Promise.all(
          diff.map((dsId) => {
            return dispatch(StoreActions.fetchDatasheet(dsId));
          }),
        )
          .then(() => {
            cmdExecute();
          })
          .catch(() => {
            message.error(t(Strings.rollback_fail_tip, { type: msgText }));
          })
          .finally(() => {
            setRollbackIng(false);
          });
      } else {
        cmdExecute();
      }
    },
    [executePreview, executeRollback, currentDatasheetIds, dispatch, changesetList],
  );

  const onPreviewClick = useCallback(
    (index: number) => {
      execute(index, true);
    },
    [execute],
  );

  if (!changesetList) {
    return (
      <>
        <Skeleton width="38%" />
        <Skeleton count={2} />
        <Skeleton width="61%" />
      </>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <Typography variant="h6">{t(Strings.time_machine)}</Typography>
        <Tooltip content={t(Strings.robot_panel_help_tooltip)} placement="top-center">
          <Box display="flex" alignItems="center">
            <IconButton
              shape="square"
              icon={QuestionCircleOutlined}
              onClick={() => {
                window.open(t(Strings.timemachine_help_url));
              }}
            />
          </Box>
        </Tooltip>
        <Beta />
        <IconButton shape="square" onClick={() => onClose(false)} icon={CloseOutlined} style={{ position: 'absolute', right: 16 }} />
      </div>
      <Tabs
        className={styles.tabs}
        onChange={() => {
          dispatch(StoreActions.resetDatasheet(PREVIEW_DATASHEET_ID));
          setCurPreview(undefined);
        }}
      >
        <TabPane tab={t(Strings.time_machine_action_title)} key={TabPaneKeys.ACTION}>
          <div className={styles.content} ref={contentRef}>
            {isEmpty ? (
              <div className={styles.noList}>
                <Image src={DataEmpty} width={240} height={180} alt="" />
                <p>{t(Strings.rollback_history_empty)}</p>
              </div>
            ) : (
              changesetList.map((item, index) => {
                const memberInfo = uuidMap && uuidMap[item.userId!];
                const title =
                  getSocialWecomUnitName?.({
                    name: memberInfo?.memberName,
                    isModified: memberInfo?.isMemberNameModified,
                    spaceInfo,
                  }) || '';
                const ops = item.operations.filter((op) => !op.cmd.startsWith('System'));
                return (
                  <section
                    className={styles.listItem}
                    key={`${item.messageId}-${item.revision}`}
                    data-active={index === curPreview}
                    onClick={() => {
                      onPreviewClick(index);
                      console.log('ops', ops);
                    }}
                  >
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Avatar id={item.userId || ''} title={typeof title === 'string' ? title : ''} size={24} src={memberInfo?.avatar} />
                      <div>
                        <div className={styles.title}>
                          <span style={{ paddingRight: '4px' }}>{title}</span>
                          <span>{getOperationInfo(ops)}</span>
                        </div>
                        <div className={styles.timestamp}>{dayjs.tz(item.createdAt).format(DATEFORMAT)}</div>
                      </div>
                    </div>
                  </section>
                );
              })
            )}
            {!isEmpty && <div className={styles.bottomTip}>{noMore ? t(Strings.no_more) : t(Strings.data_loading)}</div>}
          </div>
        </TabPane>
        {Boolean(Backup) && !activeNodePrivate && (
          <TabPane tab={t(Strings.backup_title)} key={TabPaneKeys.BACKUP}>
            <Backup datasheetId={datasheetId} setCurPreview={setCurPreview} curPreview={curPreview!} />
          </TabPane>
        )}
      </Tabs>

      <Portal visible={rollbackIng} zIndex={2000}>
        <div className={styles.mask}>
          <i>
            <Loading />
          </i>
          <p>{t(Strings.rollbacking)}</p>
        </div>
      </Portal>
    </div>
  );
};
