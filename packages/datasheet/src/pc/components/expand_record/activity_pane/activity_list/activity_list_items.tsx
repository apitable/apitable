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

import { LinkButton, Typography, useThemeColors } from '@apitable/components';
import {
  Api, CollaCommandName, ConfigConstant, DatasheetApi, IActivityListParams, ICommentMsg, IJOTAction, integrateCdnHost, IRemoteChangeset, MemberType,
  OPEventNameEnums, OtherTypeUnitId, ResourceType, Selectors, Settings, StoreActions, Strings, t, WithOptional,
} from '@apitable/core';
import { Spin } from 'antd';
import axios, { CancelTokenSource } from 'axios';
import { clone, find, get, has, isEmpty, keyBy, set, toPairs, uniq, values } from 'lodash';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Message } from 'pc/components/common';
import { SpaceLevelInfo } from 'pc/components/space_manage/space_info/utils';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { ACTIVITY_SELECT_MAP, ActivitySelectType } from 'pc/utils';
import * as React from 'react';
import { FC, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconNoList from 'static/icon/datasheet/activity/datasheet_img_activity_record.png';
import { ActivityContext } from '../activity_context';
import { ChangesetItem } from '../activity_item';
import { IActivityPaneProps, IChooseComment } from '../interface';
import styles from './style.module.less';
// @ts-ignore
import { SubscribeUsageTipType, triggerUsageAlert } from 'enterprise';

const LoadingOutlined = dynamic(() => import('@ant-design/icons/LoadingOutlined'), { ssr: false });

const PAGE_SIZE = 10;
const LIMIT_DAY = 90;
const MAX_LIMIT_DAY = 730;

export type IActivityListProps = IActivityPaneProps & {
  selectType: ActivitySelectType;
  setChooseComment: (item: IChooseComment) => void;
};

interface ICommentUpdatedContext {
  recordId: string;
  action: IJOTAction;
  datasheetId: string;
}

export type IChangeSet = WithOptional<IRemoteChangeset, 'messageId' | 'resourceType'>;

export const ActivityListItems: FC<IActivityListProps & {
  containerRef: React.RefObject<HTMLDivElement>;
  listRef: React.RefObject<HTMLDivElement>;
  setEmpty: (bool: boolean) => void;
}> = props => {
  const colors = useThemeColors();
  const { expandRecordId, datasheetId, selectType, setChooseComment, containerRef, listRef, setEmpty, mirrorId } = props;
  const dispatch = useDispatch();
  const { emojis, setEmojis, unitMap, updateCommentReplyMap } = useContext(ActivityContext);
  const currUserId = useSelector(state => state.user.info?.userId);
  const _maxRemainRecordActivityDays = useSelector(state => {
    return state.billing?.subscription?.maxRemainRecordActivityDays || LIMIT_DAY;
  });
  // Mirror view to check if it is the current table's row panel
  const resourceId = mirrorId ? mirrorId : datasheetId;
  const cancelsRef = useRef<CancelTokenSource[]>([]);
  const [listHeight, setListHeight] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver>();
  const productName = useSelector(state => String(state.billing?.subscription?.product).toLowerCase());

  const product = useMemo(() => {
    return SpaceLevelInfo[productName]?.title || '';
  }, [productName]);

  const scrollTo = (isBottom?: boolean) => {
    // Wait for the list to update before scrolling
    window.setTimeout(() => {
      const containerDom = containerRef.current;
      const listDom = listRef.current;
      if (!containerDom || !listDom) {
        return;
      }
      const height = listDom.offsetHeight;
      // 38 is the height occupied by loading
      containerDom.scrollTop = isBottom ? height : height - listHeight - 38;
      setListHeight(height);
    });
  };

  // Cache data lost during single-select, multi-select switch types or delete op operations (od)
  const [cacheFieldOptions, setCacheFieldOptions] = useState({});

  // Data for list rendering operations
  const [maxRemainRecordActivityDays, setMaxRemainRecordActivityDays] = useState<undefined | number>();
  const [recordList, setRecordList] = useState<IChangeSet[]>([]);
  const [minRevision, setMinRevision] = useState<number>();
  const [isAdding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [more, setMore] = useState(true);
  const [end, setEnd] = useState(false);

  const loadOverLimitData = () => {
    const result = triggerUsageAlert('maxRemainRecordActivityDays', { usage: MAX_LIMIT_DAY, alwaysAlert: true }, SubscribeUsageTipType.Alert);
    if (result) {
      return;
    }
    setEnd(false);
    setMaxRemainRecordActivityDays(MAX_LIMIT_DAY);
  };

  const loadMore = () => {
    const getRecordList = async() => {
      setAdding(true);
      await getActivityList(resourceId, expandRecordId, ACTIVITY_SELECT_MAP[selectType][0] as ConfigConstant.ActivityListParamsType);
      // Scroll to original position after getting new data
      scrollTo();
      setAdding(false);
    };
    getRecordList();
  };

  const { opEventManager } = resourceService.instance!;

  useEffect(() => {
    setMaxRemainRecordActivityDays(_maxRemainRecordActivityDays);
  }, [_maxRemainRecordActivityDays]);

  // Collaborative update comment deletion, addition
  useEffect(() => {
    const recordCommentUpdatedCallBack = (context: ICommentUpdatedContext) => {
      const { recordId, action, datasheetId } = context;
      const revision = Selectors.getResourceRevision(store.getState(), datasheetId, ResourceType.Datasheet)!;
      const hasAddComment = has(action, 'li');
      const hasDeleteComment = has(action, 'ld');
      const hasAddEmoji = has(action, 'li.commentMsg.emojis');
      const hasDeleteEmoji = has(action, 'ld.commentMsg.emojis');
      if (expandRecordId === recordId) {
        if (hasAddEmoji) {
          const commentId: string = get(action, 'li.commentId');
          const curEmojis: ICommentMsg['emojis'] = get(action, 'li.commentMsg.emojis');
          const [[emojiKey, emojiUserIds]] = toPairs(curEmojis);
          const newEmojis = clone(emojis);
          const newUserIds = get(newEmojis, `${commentId}.${emojiKey}`, []) as string[];
          set(newEmojis, `${commentId}.${emojiKey}`, uniq([...emojiUserIds, ...newUserIds]));
          setEmojis(newEmojis);
          return;
        }
        if (hasDeleteEmoji) {
          const commentId: string = get(action, 'ld.commentId');
          const curEmojis: ICommentMsg['emojis'] = get(action, 'ld.commentMsg.emojis');
          const [[emojiKey, emojiUserIds]] = toPairs(curEmojis);
          const newEmojis = clone(emojis);
          const newUserIds = get(newEmojis, `${commentId}.${emojiKey}`, []) as string[];
          set(
            newEmojis,
            `${commentId}.${emojiKey}`,
            newUserIds.filter(id => id !== emojiUserIds[0]),
          );
          setEmojis(newEmojis);
          return;
        }
        if (hasAddComment && !hasDeleteComment) {
          const createdAt: number = get(action, 'li.createdAt');
          const unitId: string = get(action, 'li.unitId');
          const userId = unitMap ? unitMap[unitId]?.userId : undefined;
          const addComment = (uid?: string) => {
            setRecordList([
              {
                createdAt,
                resourceId: datasheetId,
                operations: [
                  {
                    cmd: CollaCommandName.InsertComment,
                    actions: [action],
                  },
                ],
                revision: revision + 1,
                userId: uid || userId,
              },
              ...(recordList.length === 0 ? [] : recordList),
            ]);
            if (recordList.length === 0) {
              setEnd(true);
            }
            if (userId === currUserId) {
              scrollTo(true);
            }
          };
          if (userId) {
            addComment();
          } else {
            Api.loadOrSearch({ unitIds: unitId }).then(res => {
              const {
                data: { data: resData, success },
              } = res;
              if (!resData.length || !success) {
                return;
              }
              const newUser = resData[0];
              dispatch(
                StoreActions.updateUnitMap({
                  [unitId]: newUser,
                }),
              );
              addComment(newUser.userId);
            });
          }
        }
      }

      if (hasDeleteComment && !hasAddComment) {
        const commentId = get(action, 'ld.commentId');
        const filterRecordList: WithOptional<IRemoteChangeset, 'messageId' | 'resourceType'>[] = [];
        recordList.forEach(rc => {
          // Filter deleted comments
          if (get(rc, 'operations.0.actions.0.li.commentId') !== commentId) {
            // Deleted comments are marked as deleted in the reply
            rc.operations.forEach((op, opIdx) => {
              const curAction = get(op, 'actions.0');
              const isSameComment = get(curAction, 'li.commentMsg.reply.commentId') === commentId;
              if (isSameComment) {
                set(rc, `operations.${opIdx}.actions.0.li.commentMsg.reply`, { isDeleted: true, commentId });
              }
            });
            filterRecordList.push(rc);
          }
        });
        setRecordList(filterRecordList);
      }
    };
    opEventManager.addEventListener(OPEventNameEnums.RecordCommentUpdated, recordCommentUpdatedCallBack);
    return () => {
      // FIXME: The cancellation of the listening needs to be optimised.
      opEventManager.removeEventListener(OPEventNameEnums.RecordCommentUpdated, recordCommentUpdatedCallBack);
    };
    // currUserId Adding will cause comment probability flashing issues
    // eslint-disable-next-line
  }, [expandRecordId, recordList, selectType, unitMap, emojis]);

  const clearRecordList = () => {
    setRecordList([]);
    setMinRevision(undefined);
    setCacheFieldOptions([]);
  };

  async function getActivityList(resourceId: string, recId: string, type: ConfigConstant.ActivityListParamsType, isClear?: boolean) {
    isClear && clearRecordList();
    const params: IActivityListParams = { type, pageSize: PAGE_SIZE, limitDays: maxRemainRecordActivityDays };
    if (!isClear && minRevision) {
      params.maxRevision = minRevision;
    }

    try {
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      cancelsRef.current.push(source);
      setLoading(true);
      const res = await DatasheetApi.getActivityList(resourceId, recId, params, source);
      setLoading(false);
      cancelsRef.current.pop();
      const { data, success, message } = res.data;

      if (!success) {
        Message.warning({
          content: message,
        });
        return;
      }

      if (data) {
        const { changesets, units, emojis: newEmojis, commentReplyMap } = data;
        setEmojis({ ...emojis, ...newEmojis });
        updateCommentReplyMap(pre => ({ ...pre, ...commentReplyMap }));
        // Update membership information
        dispatch(StoreActions.updateUnitMap(keyBy(units, 'unitId')));

        const newCacheFieldOptions = isClear ? {} : cacheFieldOptions;

        changesets.forEach((cs: IRemoteChangeset) => {
          const { operations, revision } = cs;
          const firstOperation = operations[0];
          if (!firstOperation) {
            return;
          }
          const { actions } = firstOperation;
          actions.forEach(action => {
            // Get the od for switching, deleting the first action of the field
            const firstOd = get(action, 'od');
            // Add to cache if single, multi-select
            if (
              has(firstOd, 'property.options') ||
              has(firstOd, 'property.icon') ||
              has(firstOd, 'property.precision') ||
              has(firstOd, 'property.unitIds') ||
              has(firstOd, 'property.dateFormat') ||
              has(firstOd, 'property.foreignDatasheetId')
            ) {
              set(newCacheFieldOptions, `${firstOd.id}.revision_${revision}`, firstOd);
            }
          });
        });
        const newList = isClear ? changesets : [...recordList, ...changesets];
        if (newList.length > 0 && changesets.length < PAGE_SIZE) {
          setEnd(true);
          setMore(false);
        }
        setCacheFieldOptions(newCacheFieldOptions);
        setRecordList(newList);
        changesets[changesets.length - 1] && setMinRevision(changesets[changesets.length - 1].revision);
      }
    } catch (err) {
      // Cancel return exception as normal
      if (!axios.isCancel(err)) {
        Message.warning({
          content: t(Strings.resource_load_failed),
        });
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    // Observer pattern for scrolling loading
    observerRef.current = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        // Access to the visual area
        if (entry.isIntersecting) {
          if (topRef.current) {
            topRef.current.click();
          }
        }
      });
    });
    return () => {
      // Stop Watch
      observerRef.current?.disconnect();
    };
  }, []);

  const isEmptyList = recordList.length === 0;

  useEffect(() => {
    setEmpty(isEmptyList);
  }, [isEmptyList, setEmpty]);

  useEffect(() => {
    if (!more) {
      setEnd(false);
      setMore(true);
    }
    if (!maxRemainRecordActivityDays) {
      return;
    }
    let topTarget: HTMLDivElement | null = null;
    getActivityList(resourceId, expandRecordId, ACTIVITY_SELECT_MAP[selectType][0] as ConfigConstant.ActivityListParamsType, true).then(() => {
      scrollTo(true);
      // Scroll to the bottom and start listening for observations
      setTimeout(() => {
        topTarget = topRef.current;
        if (topTarget) {
          observerRef.current?.observe(topTarget);
        }
      });
    });

    return () => {
      // Canceling a failed active API request
      cancelsRef.current.forEach(c => c.cancel());
      cancelsRef.current = [];
      if (topTarget) {
        observerRef.current?.unobserve(topTarget);
      }
    };
    // eslint-disable-next-line
  }, [expandRecordId, datasheetId, selectType, maxRemainRecordActivityDays]);

  if (isEmpty(recordList) && cancelsRef.current.length > 0 && loading) {
    return (
      <div className={styles.spin}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </div>
    );
  }
  if (isEmpty(recordList)) {
    return (
      <div className={styles.blankTip}>
        <Image src={IconNoList} alt='' width={160} height={120} />
        <div>{t(Strings.no_comment_tip)}</div>
        <div>
          {selectType !== ActivitySelectType.Comment && t(Strings.history_view_tip, { day: maxRemainRecordActivityDays })}
          <LinkButton href={t(Strings.record_history_help_url)} color={colors.thirdLevelText} className={styles.more} target='_blank'>
            {t(Strings.know_more)}
          </LinkButton>
        </div>
        {selectType !== ActivitySelectType.Comment && maxRemainRecordActivityDays !== MAX_LIMIT_DAY && (
          <div onClick={loadOverLimitData} className={styles.loadMaxList} style={{ marginTop: 8 }}>
            <Typography variant={'body3'} color={colors.primaryColor}>
              {t(Strings.history_view_more)}
            </Typography>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {recordList.map((item: IChangeSet, index) => {
        const unit = find(values(unitMap), { userId: item.userId }) || {
          type: MemberType.Member,
          userId: OtherTypeUnitId.Alien,
          unitId: OtherTypeUnitId.Alien,
          avatar: integrateCdnHost(Settings.datasheet_unlogin_user_avatar.value),
          name: t(Strings.anonymous),
          isActive: true,
        };
        // Change key update component after comment deletion
        const isCommentDeleted = get(item, 'operations.0.actions.0.li.commentMsg.reply.isDeleted', false);
        return (
          <ChangesetItem
            key={`${item.revision}-${index}-${isCommentDeleted ? 'delete' : ''}`}
            datasheetId={datasheetId}
            expandRecordId={expandRecordId}
            changeset={item}
            cacheFieldOptions={cacheFieldOptions}
            setChooseComment={setChooseComment}
            unit={unit}
          />
        );
      })}
      {more && <div className={styles.loadTrigger} ref={topRef} onClick={() => loadMore()} />}
      {isAdding && (
        <div className={styles.spin}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 14 }} spin />} />
        </div>
      )}
      {end &&
        (selectType === ActivitySelectType.Comment ? (
          <div className={styles.commentTop} />
        ) : (
          <div className={styles.top}>
            {maxRemainRecordActivityDays !== MAX_LIMIT_DAY && (
              <div onClick={loadOverLimitData} className={styles.loadMaxList}>
                <Typography variant={'body3'} color={colors.primaryColor}>
                  {t(Strings.history_view_more)}
                </Typography>
              </div>
            )}
            {maxRemainRecordActivityDays !== MAX_LIMIT_DAY ? (
              <div>
                「{product}」{t(Strings.history_view_tip, { day: maxRemainRecordActivityDays })}
                <LinkButton href={t(Strings.record_history_help_url)} color={colors.thirdLevelText} className={styles.more} target='_blank'>
                  {t(Strings.know_more)}
                </LinkButton>
              </div>
            ) : (
              <div>{t(Strings.record_activity_experience_tips, { day: MAX_LIMIT_DAY })}</div>
            )}
          </div>
        ))}
    </>
  );
};
