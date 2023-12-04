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

import classnames from 'classnames';
import dayjs from 'dayjs';
import { last } from 'lodash';
import Image from 'next/image';
import { FC, useState } from 'react';
import { Button, Skeleton, TextButton, Typography, useThemeColors, ThemeName } from '@apitable/components';
import { Api, IReduxState, Navigation, StoreActions, Strings, t } from '@apitable/core';
import { QuestionCircleOutlined, MoreStandOutlined, HistoryOutlined } from '@apitable/icons';
import { Router } from 'pc/components/route_manager/router';
import { formIdReg, mirrorIdReg, useRequest } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import EmptyPngDark from 'static/icon/datasheet/empty_state_dark.png';
import EmptyPngLight from 'static/icon/datasheet/empty_state_light.png';
import { UnitTag } from '../catalog/permission_settings/permission/select_unit_modal/unit_tag';
import { ButtonPlus, Message, Tooltip } from '../common';
import { ComponentDisplay, ScreenSize } from '../common/component_display';
import { TComponent } from '../common/t_component';
import { TrashContextMenu } from './trash_context_menu';
// @ts-ignore
import { SubscribeUsageTipType, triggerUsageAlert } from 'enterprise/billing/trigger_usage_alert';
// @ts-ignore
import { getSocialWecomUnitName } from 'enterprise/home/social_platform/utils';
// @ts-ignore
import { SubscribeGrade } from 'enterprise/subscribe_system/subscribe_label/subscribe_label';
import styles from './style.module.less';

export interface ITrashItem {
  nodeId: string;
  nodeName: string;
  type: number;
  icon: string;
  nickName: string;
  memberName: string;
  avatar: string;
  avatarColor: number | null;
  uuid: string;
  deletedAt: string;
  delPath: string;
  remainDay: number;
  isMemberNameModified?: boolean;
}

const Trash: FC<React.PropsWithChildren<unknown>> = () => {
  const colors = useThemeColors();
  const spaceName = useAppSelector((state: IReduxState) => state.user.info?.spaceName);
  const spaceId = useAppSelector((state: IReduxState) => state.space.activeId);
  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);
  const product = useAppSelector((state: IReduxState) => state.billing?.subscription?.product);
  const maxRemainTrashDays = useAppSelector((state: IReduxState) => state.billing?.subscription?.maxRemainTrashDays || 0);
  const [trashList, setTrashList] = useState<ITrashItem[]>([]);
  const dispatch = useAppDispatch();
  const { loading: recoverLoading, run: trashRecover } = useRequest((nodeId) => Api.trashRecover(nodeId), { manual: true });
  const themeName = useAppSelector((state) => state.theme);
  const EmptyPng = themeName === ThemeName.Light ? EmptyPngLight : EmptyPngDark;

  const [lastNodeId, setLastNodeId] = useState<string | undefined>(undefined);
  const [noMore, setNoMore] = useState(false);
  const handleSuccess = (res: { data: { success: any; data: any } }) => {
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
    setTrashList(trashList.filter((item) => item.nodeId !== nodeId));
  };

  const recoverHandler = async (nodeId: string) => {
    if (recoverLoading) {
      return;
    }
    const result = triggerUsageAlert?.('maxSheetNums', { usage: spaceInfo!.sheetNums + 1, alwaysAlert: true }, SubscribeUsageTipType?.Alert);
    if (result) {
      return;
    }

    if (formIdReg.test(`/${nodeId}`)) {
      const result = triggerUsageAlert?.(
        'maxFormViewsInSpace',
        { usage: spaceInfo!.formViewNums + 1, alwaysAlert: true },
        SubscribeUsageTipType?.Alert,
      );
      if (result) {
        return;
      }
    }

    if (mirrorIdReg.test(`/${nodeId}`)) {
      const result = triggerUsageAlert?.('maxMirrorNums', { usage: spaceInfo!.mirrorNums + 1, alwaysAlert: true }, SubscribeUsageTipType?.Alert);
      if (result) {
        return;
      }
    }

    const res = await trashRecover(nodeId);
    const { success, data } = res.data;
    if (success) {
      dispatch(StoreActions.addNodeToMap([data]));
      dispatch(StoreActions.datasheetErrorCode(nodeId, null));
      dispatch(StoreActions.getSpaceInfo(spaceId!, true));
      deleteTrashItem(nodeId);
      Router.push(Navigation.WORKBENCH, { params: { spaceId, nodeId } });
      Message.success({ content: t(Strings.recover_node_success) });
      return;
    }
    Message.error({ content: t(Strings.recover_node_fail) });
  };

  const data = [
    {
      icon: <HistoryOutlined />,
      text: t(Strings.recover_node),
      onClick: recoverHandler,
    },
  ];

  const _loadMore = () => {
    if (!noMore) {
      loadMore();
      return;
    }
    triggerUsageAlert?.(
      'maxRemainTrashDays',
      // Here maxRemainTrashDays is obtained as the value in billing,
      // which is actually the maximum allowed, so in order to trigger the popup, you need +1.
      { usage: maxRemainTrashDays + 1, alwaysAlert: true },
      SubscribeUsageTipType?.Alert,
    );
  };

  return (
    <div className={styles.trashWrapper}>
      <div className={styles.container}>
        <div className={styles.title}>
          {t(Strings.trash)}
          <Tooltip title={t(Strings.form_tour_desc)} trigger="hover" placement="right">
            <a
              href={getEnvVariables().TRASH_HELP_URL}
              rel="noopener noreferrer"
              target="_blank"
              style={{
                cursor: 'pointer',
                marginLeft: 8,
                display: 'inline-block',
                fontSize: 24,
              }}
            >
              <QuestionCircleOutlined color={colors.thirdLevelText} />
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
              {trashList.map((trashItem) => {
                const { memberName, isMemberNameModified, nodeName, nodeId, remainDay, avatar, uuid, deletedAt, delPath, nickName, avatarColor } =
                  trashItem;
                const title =
                  getSocialWecomUnitName?.({
                    name: memberName,
                    isModified: isMemberNameModified,
                    spaceInfo,
                  }) || memberName;

                return (
                  <div className={styles.trashListItem} key={nodeId}>
                    <Typography ellipsis className={styles.nodeName}>
                      {nodeName}
                    </Typography>
                    <div className={styles.remainingTime}>
                      <div className={classnames([styles.days, remainDay <= 3 && styles.redPrompt])}>
                        {remainDay < 0 ? t(Strings.expired) : remainDay}
                      </div>
                      {remainDay > 0 && t(Strings.day)}
                    </div>
                    <div className={styles.user}>
                      <UnitTag
                        unitId={uuid}
                        avatar={avatar}
                        avatarColor={avatarColor}
                        nickName={nickName}
                        name={memberName}
                        deletable={false}
                        title={title}
                      />
                    </div>
                    <Tooltip title={deletedAt} textEllipsis>
                      <div className={styles.expirationTime}>{dayjs.tz(deletedAt).format('YYYY-MM-DD HH:mm:ss')}</div>
                    </Tooltip>

                    <Tooltip title={delPath || spaceName} textEllipsis>
                      <div className={styles.path}>{delPath || spaceName}</div>
                    </Tooltip>
                    <TrashContextMenu nodeId={nodeId} data={data}>
                      <ButtonPlus.Icon icon={<MoreStandOutlined />} />
                    </TrashContextMenu>
                  </div>
                );
              })}
              <div className={styles.bottom}>
                {noMore && <span className={styles.end}>{t(Strings.end)}</span>}
                {(product !== SubscribeGrade?.Enterprise || (product === SubscribeGrade?.Enterprise && !noMore)) && (
                  <div style={{ marginTop: 8 }}>
                    {moreLoading ? (
                      <Button loading variant="jelly">
                        {t(Strings.loading)}
                      </Button>
                    ) : (
                      <TextButton onClick={_loadMore} color="primary">
                        {t(Strings.click_load_more)}
                      </TextButton>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : loading || moreLoading ? (
            <>
              <Skeleton width="38%" />
              <Skeleton />
              <Skeleton width="61%" />
            </>
          ) : (
            <div className={styles.empty}>
              <Image src={EmptyPng} alt="empty" width={320} height={240} />
              <div className={styles.tip}>{t(Strings.empty_trash, { day: maxRemainTrashDays })}</div>
              <TextButton onClick={_loadMore} color="primary" style={{ marginTop: 8 }}>
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
