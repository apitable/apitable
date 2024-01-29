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

import { useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import Fuse from 'fuse.js';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Api,
  IMember,
  IUnitIds,
  IUnitMap,
  IUnitValue,
  IUserValue,
  IUuids,
  MemberType,
  OtherTypeUnitId,
  StoreActions,
  Strings,
  t,
  UnitItem,
} from '@apitable/core';
import { useGetMemberStash } from 'modules/space/member_stash/hooks/use_get_member_stash';
import { memberStash } from 'modules/space/member_stash/member_stash';
import { InfoCard } from 'pc/components/common/info_card';
import { expandInviteModal } from 'pc/components/invite';
import { CommonList } from 'pc/components/list/common_list';
import { useRequest } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import { stopPropagation } from '../../../utils/dom';
import { expandUnitModal, SelectUnitSource } from '../../catalog/permission_settings/permission/select_unit_modal';
import { Check } from '../common_list/check';
import { IMemberOptionListProps } from './member_option_list.interface';
// @ts-ignore
import { getSocialWecomUnitName } from 'enterprise/home/social_platform/utils';
import styles from './styles.module.less';

const triggerBase = {
  action: ['hover'],

  popupAlign: {
    points: ['cr', 'cl'],
    offset: [-24, 0],
    overflow: { adjustX: true, adjustY: true },
  },
};

export const MemberOptionList: React.FC<
  React.PropsWithChildren<
    IMemberOptionListProps & {
      inputRef?: React.RefObject<HTMLInputElement>;
    }
  >
> = (props) => {
  const {
    linkId,
    unitMap,
    listData,
    onClickItem,
    showSearchInput,
    showMoreTipButton,
    multiMode,
    existValues,
    uniqId,
    activeIndex,
    showInviteTip = true,
    inputRef,
    monitorId,
    className,
    searchEmail,
  } = props;
  const { loading: memberLoading, memberStashList } = useGetMemberStash();
  const initList = Array.isArray(listData) ? listData : memberStashList;
  const [memberList, setMemberList] = useState<(IUnitValue | IUserValue)[]>(() => {
    // Whether or not you want to enable remote search, you need to make a backup of the data, especially the local data passed in by the component
    return initList;
  });
  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);
  const dispatch = useDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const { formId, embedId } = useAppSelector((state) => state.pageParams);
  const shareId = useAppSelector((state) => state.pageParams.shareId);

  const refreshMemberList = useCallback(() => {
    // listData is not passed in, use stash directly
    if (!listData) {
      setMemberList(memberStash.getMemberStash());
      return;
    }
    setMemberList(listData);
  }, [listData, memberLoading]);

  useEffect(() => {
    refreshMemberList();
  }, [refreshMemberList]);

  const loadOrSearchMember = async (keyword?: string) => {
    if (!showSearchInput && listData != null) {
      // If remote search is not enabled, the raw data needs to be read from the external incoming complete data,
      // not the data cached within the component
      const fuse = new Fuse(listData, { keys: ['name'] });
      if (keyword) {
        return fuse.search(keyword).map((item) => (item as any).item); // FIXME:TYPE
      }
      return listData;
    }
    if (!keyword?.length) {
      return initList;
    }
    let res;
    if (embedId) {
      res = await Api.loadOrSearchEmbed(embedId, { filterIds: '', keyword, linkId, searchEmail });
    } else {
      res = await Api.loadOrSearch({ filterIds: '', keyword, linkId, searchEmail });
    }
    const data: IUnitValue[] = res.data.data;
    if (uniqId === 'userId') {
      return data.filter((unitValue) => unitValue.type === MemberType.Member && Boolean(unitValue.userId));
    }
    return data;
  };

  const { data, run } = useRequest(loadOrSearchMember, {
    debounceWait: 200,
    manual: true,
  });

  useUpdateEffect(() => {
    // FIXME: The API should have a return type
    if (Array.isArray(data)) {
      setMemberList(data);
    }
  }, [data]);

  // Select a new member and update the information of that member to the unitMap
  function updateMemberInfo(unit: IUnitValue | IUserValue) {
    const { unitId, userId, name, avatar } = unit;
    // If the filter value is "Current User" or "Anonymous", you do not need to update it to the corresponding Map
    if ([unitId, userId].includes(OtherTypeUnitId.Self) || [unitId, userId].includes(OtherTypeUnitId.Alien)) {
      return;
    }

    memberStash.updateStash(unit as IUnitValue);

    const _unitMap = unitMap || {};
    const currentUnitId = (uniqId === 'unitId' ? unitId : userId)!;
    if (_unitMap[currentUnitId] && _unitMap[currentUnitId].name === name && _unitMap[currentUnitId].avatar === avatar) {
      return;
    }
    if (uniqId === 'unitId') {
      dispatch(StoreActions.updateUnitMap({ [currentUnitId]: unit } as IUnitMap));
    } else {
      dispatch(StoreActions.updateUserMap({ [currentUnitId]: unit } as IUnitMap));
    }
  }

  function handleSubmit(values: UnitItem[]) {
    const newValues = values.map((value) => {
      if ('roleId' in value) {
        const result = {
          type: MemberType.Team,
          unitId: value.unitId,
          name: value.roleName,
          avatar: '',
          isDelete: false,
        };
        updateMemberInfo(result);
        return result;
      }
      if ('teamId' in value) {
        const result = {
          type: MemberType.Team,
          unitId: value.unitId,
          name: value['name'] || value.originName || value.teamName,
          avatar: '',
          isDelete: false,
        };
        updateMemberInfo(result);
        return result;
      }
      const item = value as IMember;
      const result = {
        type: MemberType.Member,
        unitId: item.unitId,
        userId: item.uuid,
        name: item['name'] || item.originName || item.memberName,
        avatar: item.avatar,
        isActive: item.isActive,
        isDelete: false,
      };
      updateMemberInfo(result);
      return result;
    });
    onClickItem(newValues.map((item) => item.unitId));
  }

  function standardStructure(cv: IUnitIds | IUuids | null) {
    if (!unitMap || !cv) {
      return [];
    }
    return cv
      .filter((item) => {
        return unitMap[item];
      })
      .map((item) => {
        const info = unitMap[item];
        return {
          avatar: info.avatar,
          avatarColor: info.avatarColor,
          nickName: info.nickName,
          name: info.name,
          isTeam: info.type === MemberType.Team,
          type: info.type,
          unitId: item,
          userId: info.userId,
          isActive: info.isActive,
          isDeleted: info.isDeleted,
          isMemberNameModified: info.isMemberNameModified,
        } as any;
      });
  }

  function clickItem(e: React.MouseEvent | null, index: number) {
    e && stopPropagation(e);
    const unit = memberList[index];
    updateMemberInfo(unit);
    const unitId = uniqId === 'unitId' ? unit.unitId : unit.userId;
    const hasChecked = Boolean(existValues && existValues.includes(unitId!));
    if (multiMode) {
      if (hasChecked) {
        return onClickItem((existValues as IUnitIds).filter((item) => item !== unitId));
      }
      return onClickItem([...(existValues ? (existValues as IUnitIds) : []), unitId!]);
    }
    return onClickItem(hasChecked ? [] : [unitId!]);
  }

  return (
    <div className={classNames('memberOptionList', styles.memberOptionList, className)} tabIndex={0} ref={containerRef}>
      <CommonList
        monitorId={monitorId}
        inputRef={inputRef}
        value={existValues}
        onClickItem={clickItem}
        showInput={showSearchInput}
        activeIndex={activeIndex}
        inputStyle={{ padding: 8 }}
        onInputClear={() => setMemberList(initList)}
        isLoadingData={memberLoading}
        noSearchResult={() => {
          return (
            <span className={styles.noResult}>
              {uniqId == 'unitId' ? t(Strings.cell_not_find_member_or_team) : t(Strings.cell_not_find_member)}
              {showInviteTip && !formId && !shareId && !embedId && (
                <span className={styles.inviteMember} onClick={() => expandInviteModal()}>
                  {t(Strings.invite_member)}
                </span>
              )}
            </span>
          );
        }}
        onSearchChange={(_e, keyword) => {
          run(keyword);
        }}
        // The share page is not allowed to appear View More, the organization in the space station will be leaked
        footerComponent={
          showMoreTipButton && !shareId && !embedId
            ? () => {
              return (
                <div
                  className={styles.seeMore}
                  onMouseUp={() => {
                    expandUnitModal({
                      source: SelectUnitSource.Member,
                      onSubmit: (values) => handleSubmit(values),
                      isSingleSelect: !multiMode,
                      checkedList: standardStructure(existValues),
                      onClose: () => refreshMemberList(),
                      showTab: true,
                    });
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                >
                  {t(Strings.see_more)}
                </div>
              );
            }
            : undefined
        }
      >
        {memberList.map((item, index) => {
          const { userId, uuid, name, nickName, isMemberNameModified, teamData, avatar, avatarColor, unitRefId, type, isDeleted, isActive, desc } =
            item;
          const unitId = uniqId === 'unitId' ? item.unitId : userId;
          const title =
            getSocialWecomUnitName?.({
              name,
              isModified: isMemberNameModified,
              spaceInfo,
            }) || name;
          return (
            <CommonList.Option
              key={item[uniqId] || index}
              currentIndex={index}
              id={item[uniqId] || ''}
              onMouseDown={(e: React.MouseEvent) => {
                e.preventDefault();
              }}
              className={styles.memberOptionItemWrapper}
            >
              <InfoCard
                title={title}
                description={teamData && getEnvVariables().UNIT_LIST_TEAM_INFO_VISIBLE ? teamData[0]?.fullHierarchyTeamName : ''}
                avatarProps={{
                  id: unitId || '',
                  title: nickName || name,
                  src: avatar,
                  avatarColor,
                }}
                userId={userId || uuid}
                memberId={unitRefId}
                triggerBase={triggerBase}
                className={styles.memberInfoCard}
                isDeleted={isDeleted}
                memberType={type}
                isActive={isActive}
                desc={desc}
                isMemberOptionList
              />
              <Check isChecked={Boolean(existValues && existValues.includes(unitId!))} />
            </CommonList.Option>
          );
        })}
      </CommonList>
    </div>
  );
};
