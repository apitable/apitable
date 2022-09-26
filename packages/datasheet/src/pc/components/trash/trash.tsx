import { Button, Skeleton, TextButton, Typography, useThemeColors } from '@vikadata/components';
import { Api, IReduxState, Navigation, Settings, StoreActions, Strings, t } from '@vikadata/core';
import classnames from 'classnames';
import { last } from 'lodash';
import Image from 'next/image';
import { triggerUsageAlert } from 'pc/common/billing';
import { SubscribeUsageTipType } from 'pc/common/billing/subscribe_usage_check';
import { getSocialWecomUnitName } from 'pc/components/home/social_platform';
import { Router } from 'pc/components/route_manager/router';
import { SubscribeGrade } from 'pc/components/subscribe_system/subscribe_label';
import { useRequest } from 'pc/hooks';
import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HelpIcon from 'static/icon/common/common_icon_information.svg';
import MoreIcon from 'static/icon/common/common_icon_more_stand.svg';
import RecoverIcon from 'static/icon/datasheet/rightclick/recover.svg';
import EmptyPng from 'static/icon/workbench/notification/workbench_img_no_notification.png';
import { UnitTag } from '../catalog/permission_settings/permission/select_unit_modal/unit_tag';
import { ButtonPlus, Message, Tooltip } from '../common';
import { ComponentDisplay, ScreenSize } from '../common/component_display';
import { TComponent } from '../common/t_component';
import styles from './style.module.less';
import { TrashContextMenu } from './trash_context_menu';

export interface ITrashItem {
  nodeId: string;
  nodeName: string;
  type: number;
  icon: string;
  memberName: string;
  avatar: string;
  uuid: string;
  deletedAt: string;
  delPath: string;
  remainDay: number;
  isMemberNameModified?: boolean;
}

const Trash: FC = () => {
  const colors = useThemeColors();
  const spaceName = useSelector((state: IReduxState) => state.user.info?.spaceName);
  const spaceId = useSelector((state: IReduxState) => state.space.activeId);
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
  const product = useSelector((state: IReduxState) => state.billing.subscription?.product);
  const maxRemainTrashDays = useSelector((state: IReduxState) => state.billing.subscription?.maxRemainTrashDays || 0);
  const [trashList, setTrashList] = useState<ITrashItem[]>([]);
  const dispatch = useDispatch();
  const { loading: recoverLoading, run: trashRecover } = useRequest(nodeId => Api.trashRecover(nodeId), { manual: true });

  const [lastNodeId, setLastNodeId] = useState<string | undefined>(undefined);
  const [noMore, setNoMore] = useState(false);
  const handleSuccess = res => {
    const { success, data } = res.data;
    if (success) {
      const lastDataItem = last(data as ITrashItem[]);
      lastDataItem && setLastNodeId(lastDataItem.nodeId);
      if (trashList.length > 0 && lastNodeId) {
        setTrashList([...trashList, ...data]);
      } else {
        setTrashList(data);
      }
      if (data.length === 0) {
        setNoMore(true);
      }
    }
  };

  const { loading } = useRequest(() => Api.getTrashList(), {
    onSuccess: handleSuccess,
  });

  const { loading: moreLoading, run: loadMore } = useRequest(
    () =>
      Api.getTrashList({
        lastNodeId,
      }),
    {
      manual: true,
      onSuccess: handleSuccess,
    },
  );

  const deleteTrashItem = (nodeId: string) => {
    setTrashList(trashList.filter(item => item.nodeId !== nodeId));
  };

  const recoverHandler = async(nodeId: string) => {
    if (recoverLoading) {
      return;
    }
    const res = await trashRecover(nodeId);
    const { success, data } = res.data;
    if (success) {
      dispatch(StoreActions.addNodeToMap([data]));
      dispatch(StoreActions.datasheetErrorCode(nodeId, null));
      deleteTrashItem(nodeId);
      Router.push(Navigation.WORKBENCH, { params: { spaceId, nodeId }});
      Message.success({ content: t(Strings.recover_node_success) });
      return;
    }
    Message.error({ content: t(Strings.recover_node_fail) });
  };

  const data = [
    {
      icon: <RecoverIcon />,
      text: t(Strings.recover_node),
      onClick: recoverHandler,
    },
  ];

  const _loadMore = () => {
    if (!noMore) {
      loadMore();
      return;
    }
    triggerUsageAlert(
      'maxRemainTrashDays',
      // 这里 maxRemainTrashDays 取得为 billing 里的值，其实就是允许的最大值，所以为了触发弹窗，需要 +1
      { usage: maxRemainTrashDays + 1, alwaysAlert: true },
      SubscribeUsageTipType.Alert,
    );
  };

  return (
    <div className={styles.trashWrapper}>
      <div className={styles.container}>
        <div className={styles.title}>
          {t(Strings.trash)}
          <Tooltip title={t(Strings.form_tour_desc)} trigger='hover' placement='right'>
            <a href={Settings.trash_url.value} rel='noopener noreferrer' target='_blank'>
              <HelpIcon
                style={{
                  cursor: 'pointer',
                  marginLeft: 8,
                  display: 'inline-block',
                  fontSize: 24,
                }}
                fill={colors.thirdLevelText}
              />
            </a>
          </Tooltip>
        </div>
        <div className={styles.tip}>
          <TComponent
            tkey={t(Strings.trash_tip)}
            params={{
              day: <span className={styles.maxRemainTrashDays}>{maxRemainTrashDays}</span>,
            }}
          />
        </div>
        <div className={styles.trashList}>
          <ComponentDisplay minWidthCompatible={ScreenSize.md}>
            <div className={styles.listTitle}>
              <div>{t(Strings.node_name)}</div>
              <div>{t(Strings.remaining_time)}</div>
              <div>{t(Strings.delete_person)}</div>
              <div>{t(Strings.expiration_time)}</div>
              <div>{t(Strings.path)}</div>
              <div>{t(Strings.operation)}</div>
            </div>
          </ComponentDisplay>

          {trashList?.length ? (
            <div className={styles.listBody}>
              {trashList.map(trashItem => {
                const title = getSocialWecomUnitName({
                  name: trashItem.memberName,
                  isModified: trashItem.isMemberNameModified,
                  spaceInfo,
                });
                return (
                  <div className={styles.trashListItem} key={trashItem.nodeId}>
                    <Typography ellipsis className={styles.nodeName}>
                      {trashItem.nodeName}
                    </Typography>
                    <div className={styles.remainingTime}>
                      <div className={classnames([styles.days, trashItem.remainDay <= 3 && styles.redPrompt])}>
                        {trashItem.remainDay < 0 ? t(Strings.expired) : trashItem.remainDay}
                      </div>
                      {trashItem.remainDay > 0 && t(Strings.day)}
                    </div>
                    <div className={styles.user}>
                      <UnitTag unitId={trashItem.uuid} avatar={trashItem.avatar} name={trashItem.memberName} deletable={false} title={title} />
                    </div>
                    <Tooltip title={trashItem.deletedAt} textEllipsis>
                      <div className={styles.expirationTime}>{trashItem.deletedAt}</div>
                    </Tooltip>

                    <Tooltip title={trashItem.delPath || spaceName} textEllipsis>
                      <div className={styles.path}>{trashItem.delPath || spaceName}</div>
                    </Tooltip>
                    <TrashContextMenu nodeId={trashItem.nodeId} data={data}>
                      <ButtonPlus.Icon icon={<MoreIcon />} />
                    </TrashContextMenu>
                  </div>
                );
              })}
              <div className={styles.bottom}>
                {
                  noMore && <span className={styles.end}>{t(Strings.end)}</span>
                }
                {
                  (product !== SubscribeGrade.Enterprise || (product === SubscribeGrade.Enterprise && !noMore)) && <div style={{ marginTop: 8 }}>
                    {
                      moreLoading ?
                        <Button loading variant='jelly'>
                          {t(Strings.loading)}
                        </Button>
                        : <TextButton onClick={_loadMore} color='primary'>
                          {t(Strings.click_load_more)}
                        </TextButton>

                    }
                  </div>
                }
              </div>
            </div>
          ) : loading || moreLoading ? (
            <>
              <Skeleton width='38%' />
              <Skeleton />
              <Skeleton width='61%' />
            </>
          ) : (
            <div className={styles.empty}>
              <Image src={EmptyPng} alt='empty' width={320} height={240} />
              <div className={styles.tip}>{t(Strings.empty_trash, { day: maxRemainTrashDays })}</div>
              <TextButton onClick={_loadMore} color='primary' style={{ marginTop: 8 }}>
                {t(Strings.click_load_more)}
              </TextButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Trash;
