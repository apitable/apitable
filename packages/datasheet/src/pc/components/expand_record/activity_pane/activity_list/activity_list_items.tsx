import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { LinkButton, Typography, useThemeColors } from '@vikadata/components';
import {
  Api, CollaCommandName, ConfigConstant, DatasheetApi, IActivityListParams, ICommentMsg, IJOTAction, integrateCdnHost, IRemoteChangeset, MemberType,
  OPEventNameEnums, OtherTypeUnitId, ResourceType, Selectors, Settings, StoreActions, Strings, t, WithOptional,
} from '@vikadata/core';
import { Spin } from 'antd';
import axios, { CancelTokenSource } from 'axios';
import { clone, find, get, has, isEmpty, keyBy, set, toPairs, uniq, values } from 'lodash';
import Image from 'next/image';
import { SubscribeUsageTipType, triggerUsageAlert } from 'pc/common/billing';
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

// 默认分页获取 10 条数据
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
    return state.billing.subscription?.maxRemainRecordActivityDays || LIMIT_DAY;
  });
  // 镜像视图检查是否是当前表的行面板
  const resourceId = mirrorId ? mirrorId : datasheetId;
  const cancelsRef = useRef<CancelTokenSource[]>([]);
  const [listHeight, setListHeight] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver>();
  const productName = useSelector(state => String(state.billing.subscription?.product).toLowerCase());

  const product = useMemo(() => {
    return SpaceLevelInfo[productName]?.title || '';
  }, [productName]);

  const scrollTo = (isBottom?: boolean) => {
    // 等列表更新后再滚动
    window.setTimeout(() => {
      const containerDom = containerRef.current;
      const listDom = listRef.current;
      if (!containerDom || !listDom) {
        return;
      }
      const height = listDom.offsetHeight;
      // 38 是 loading 占用的高度
      containerDom.scrollTop = isBottom ? height : height - listHeight - 38;
      setListHeight(height);
    });
  };

  // 缓存单选，多选切换类型或者删除 op 操作时丢失的数据（od）
  const [cacheFieldOptions, setCacheFieldOptions] = useState({});

  // 列表渲染操作的数据
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
      // 获取新数据后滚动到原先位置
      scrollTo();
      setAdding(false);
    };
    getRecordList();
  };

  const { opEventManager } = resourceService.instance!;

  useEffect(() => {
    setMaxRemainRecordActivityDays(_maxRemainRecordActivityDays);
  }, [_maxRemainRecordActivityDays]);

  // 协同更新评论删除、添加
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
          // uniq 去重
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
              // 新增评论滚动到最底部
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

      // 删除评论
      if (hasDeleteComment && !hasAddComment) {
        const commentId = get(action, 'ld.commentId');
        const filterRecordList: WithOptional<IRemoteChangeset, 'messageId' | 'resourceType'>[] = [];
        recordList.forEach(rc => {
          // 过滤已删除评论
          if (get(rc, 'operations.0.actions.0.li.commentId') !== commentId) {
            // 已删除评论在回复中标记为已删除
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
      // FIXME: 取消监听需要优化。
      opEventManager.removeEventListener(OPEventNameEnums.RecordCommentUpdated, recordCommentUpdatedCallBack);
    };
    // currUserId 添加会导致评论概率闪现问题
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // 更新成员信息
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
            // 获取切换、删除 field 第一个 action 的 od
            const firstOd = get(action, 'od');
            // 如果是单选、多选则加入缓存中
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
      // 取消返回异常视为正常
      if (!axios.isCancel(err)) {
        Message.warning({
          content: t(Strings.resource_load_failed),
        });
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    // 观察者模式实现滚动加载
    observerRef.current = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        // 进入可视区
        if (entry.isIntersecting) {
          if (topRef.current) {
            topRef.current.click();
          }
        }
      });
    });
    return () => {
      // 停止观察
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
      // 滚动到底部后开始监听观察
      setTimeout(() => {
        topTarget = topRef.current;
        if (topTarget) {
          observerRef.current?.observe(topTarget);
        }
      });
    });

    return () => {
      // 取消失效的活动 API 请求
      cancelsRef.current.forEach(c => c.cancel());
      cancelsRef.current = [];
      if (topTarget) {
        observerRef.current?.unobserve(topTarget);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          avatar: integrateCdnHost(Settings.anonymous_avatar.value),
          name: t(Strings.anonymous),
          isActive: true,
        };
        // 评论删除后改变 key 更新组件
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
