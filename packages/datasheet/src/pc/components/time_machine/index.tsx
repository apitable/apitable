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

import { Box, IconButton, Loading, Skeleton, TextButton, Tooltip, Typography } from '@apitable/components';
import {
  Api, CollaCommandName, DatasheetApi, fastCloneDeep, getRollbackActions, IChangesetPack, IMemberInfoInAddressList, IRemoteChangeset, 
  PREVIEW_DATASHEET_ID, ResourceType, Selectors, StoreActions, Strings, t
} from '@apitable/core';
import { CloseMiddleOutlined, InformationSmallOutlined } from '@apitable/icons';
import { useScroll } from 'ahooks';
import { message } from 'antd';
import dayjs from 'dayjs';
import { difference } from 'lodash';
import { Modal } from 'pc/components/common';
import { notify } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { Portal } from 'pc/components/portal';
import { Beta } from 'pc/components/robot/robot_panel/robot_list_head';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
// @ts-ignore
import { getSocialWecomUnitName } from 'enterprise';

import styles from './style.module.less';
import { getForeignDatasheetIdsByOp } from './utils';

const MAX_COUNT = Number.MAX_SAFE_INTEGER;

export const TimeMachine: React.FC<{ onClose: (visible: boolean) => void }> = ({ onClose }) => {
  const datasheetId = useSelector(Selectors.getActiveDatasheetId)!;
  const curDatasheet = useSelector((state) => Selectors.getDatasheet(state, datasheetId));
  const [curPreview, setCurPreview] = useState<number>();
  const [changesetList, setChangesetList] = useState<IRemoteChangeset[]>([]);
  const [fetching, setFetching] = useState(false);
  const [uuidMap, setUuidMap] = useState<Record<string, IMemberInfoInAddressList>>();
  const [expandMap, setExpandMap] = useState<Record<number, boolean>>({});
  const currentRevision = useSelector(state => Selectors.getResourceRevision(state, datasheetId, ResourceType.Datasheet)!);
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
  const uuids = useMemo(() => {
    const uuids = changesetList && changesetList.map(item => {
      return item.userId!;
    });
    return Array.from<string>(new Set(uuids || []));
  }, [changesetList]);

  const isEmpty = useMemo(() => {
    return !changesetList?.length;
  }, [changesetList?.length]);

  const currentDatasheetIds = useSelector(Selectors.getDatasheetIds);
  const [rollbackIng, setRollbackIng] = useState(false);
  const dispatch = useAppDispatch();

  const fetchChangesets = (lastRevision) => {
    setFetching(true);
    const startRevision = lastRevision - 99 > 0 ? lastRevision - 99 : 1;
    DatasheetApi.fetchChangesets<IChangesetPack>(datasheetId, ResourceType.Datasheet, startRevision, lastRevision + 1)
      .then(res => {
        // The returned data is from low to high, when displaying, you need to display the high version first
        const csl = res.data.data.reverse();
        console.log('Load changesetList: ', csl);
        const nextCsl = changesetList.concat(csl);
        setChangesetList(nextCsl);
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
    Promise.all(uuids.map(id => {
      return Api.getMemberInfo({ uuid: id });
    })).then(results => {
      const map = {};
      results.forEach((result, index) => {
        map[uuids[index]] = result.data.data;
      });
      setUuidMap(map);
    });
  }, [uuids]);

  const onExpandClick = (index: number) => {
    setExpandMap({
      ...expandMap,
      [index]: !expandMap[index],
    });
  };

  const executeRollback = useCallback((operations) => {
    try {
      resourceService.instance!.commandManager.execute({
        cmd: CollaCommandName.Rollback,
        datasheetId,
        data: {
          operations
        }
      });
      notify.open({ message: t(Strings.rollback_tip), key: NotifyKey.Rollback });
    } catch (error) {
      Modal.confirm({
        title: t(Strings.rollback_fail_title),
        content: <div dangerouslySetInnerHTML={{ __html: t(Strings.rollback_fail_content, { url: '/help/manual-timemachine/' }) }} />
      });
    }
    dispatch(StoreActions.resetDatasheet(PREVIEW_DATASHEET_ID));
  }, [datasheetId, dispatch]);

  const executePreview = useCallback((operations, index) => {
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
        content: <div dangerouslySetInnerHTML={{ __html: t(Strings.preview_fail_content, { url: '/help/manual-timemachine/' }) }} />
      });
    }
  }, [dispatch, changesetList, curDatasheet]);

  const execute = useCallback((index: number, preview = false) => {
    const operations = changesetList.slice(0, index+1).map(cs => {
      // op needs to be executed in reverse when rolling back, so the order should also be reversed first
      return cs.operations.filter(op => !op.cmd.startsWith('System')).reverse();
    }).flat(1);
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
      Promise.all(diff.map(dsId => {
        return dispatch(StoreActions.fetchDatasheet(dsId));
      }))
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
  }, [executePreview, executeRollback, currentDatasheetIds, dispatch, changesetList]);

  const onPreviewClick = useCallback((index: number) => {
    execute(index, true);
  }, [execute]);

  const onRollbackClick = useCallback((index: number) => {
    Modal.confirm({
      title: t(Strings.rollback_title, { revision: changesetList![index].revision }),
      width: 620,
      zIndex: 5001,
      content: <>
        <p>操作前阅读：</p>
        <p>点击确定后，会将数据从最新版本回滚到指定版本，目标版本以前的所有改动将会被撤销掉。 </p>
        <p>回滚不是直接删除修改，而是通过新的操作把原来的操作抵消掉，所以回滚操作(Rollback)也会出现在历史记录中。</p>
        <p>回滚过程中若遇到不可逆的操作，如：关联字段的关联表被删除，则不能恢复此操作相关的数据。</p>
        <p className={styles.danger}>请在回滚之前先预览要回滚的版本，以确保回退到正确的版本。</p>
        <p className={styles.danger}>回滚功能目前处于Beta版本，未经严格测试，具有一定风险性，请确认自己非常清楚正在做什么，否则有数据丢失的风险！</p>
      </>,
      okButtonProps: {
        color: 'danger'
      },
      onOk() {
        execute(index, false);
      }
    });
  }, [changesetList, execute]);

  if (!changesetList) {
    return (
      <>
        <Skeleton width="38%" />
        <Skeleton count={2} />
        <Skeleton width="61%"/>
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
              icon={InformationSmallOutlined} onClick={() => {
                window.open(t(Strings.timemachine_help_url));
              }} />
          </Box>
        </Tooltip>
        <Beta />
        <IconButton
          shape="square"
          onClick={() => onClose(false)}
          icon={CloseMiddleOutlined}
          style={{ position: 'absolute', right: 16 }}
        />
      </div>
      <div className={styles.content} ref={contentRef}>

        {isEmpty ?
          <div className={styles.noList}>{t(Strings.rollback_history_empty)}</div> :
          changesetList.map((item, index) => {
            const memberInfo = uuidMap && uuidMap[item.userId!];
            const title = memberInfo ? (getSocialWecomUnitName?.({
              name: memberInfo?.memberName,
              isModified: memberInfo?.isMemberNameModified,
              spaceInfo
            }) || memberInfo?.memberName) : '';
            const ops = item.operations.filter(op => !op.cmd.startsWith('System'));
            const expanded = expandMap[index];
            return (
              <section className={styles.listItem} key={item.messageId} data-active={index === curPreview}>
                <h5>Message Id: {item.messageId}</h5>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{t(Strings.rollback_version_field)}{item.revision}</span>
                  <span>{t(Strings.rollback_time_field)}{dayjs(item.createdAt).format('MM/DD HH:mm:ss')}</span>
                  <span>{t(Strings.rollback_operator_field)}{title}</span>
                </div>
                <div className={styles.operationWrap}>
                  <div className={styles.cmdText}>
                    cmd: {ops.map(op => op.cmd).join()}
                  </div>
                  <div className={styles.operation}>
                    <TextButton disabled={isEmpty} onClick={() => onExpandClick(index)}>
                      { expanded ? t(Strings.collapse) : t(Strings.expand)}
                    </TextButton>
                    <TextButton color="primary" disabled={isEmpty} onClick={() => onPreviewClick(index)}>{t(Strings.preview_revision)}</TextButton>
                    <TextButton color="danger" disabled={isEmpty} onClick={() => onRollbackClick(index)}>{t(Strings.rollback_revision)}</TextButton>
                  </div>
                </div>
                {expanded && <pre><code>{JSON.stringify(ops, null, 2)}</code></pre>}
              </section>
            );
          })}
        {
          !isEmpty && <div className={styles.bottomTip}>
            {
              noMore ? t(Strings.no_more) : t(Strings.data_loading)
            }
          </div>
        }
      </div>

      <Portal visible={rollbackIng} zIndex={2000}>
        <div className={styles.mask}>
          <i><Loading /></i>
          <p>{t(Strings.rollbacking)}</p>
        </div>
      </Portal>
    </div>
  );
};
