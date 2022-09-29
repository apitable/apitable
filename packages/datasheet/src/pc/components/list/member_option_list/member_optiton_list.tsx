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
} from '@vikadata/core';
import { useUpdateEffect } from 'ahooks';
import { useRequest } from 'pc/hooks';
import classNames from 'classnames';
import Fuse from 'fuse.js';
import { memberStash } from 'pc/common/member_stash/member_stash';
import { expandInviteModal } from 'pc/components/invite';
import { CommonList } from 'pc/components/list/common_list';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { stopPropagation } from '../../../utils/dom';
import { expandUnitModal, SelectUnitSource } from '../../catalog/permission_settings/permission/select_unit_modal';
import { Check } from '../common_list/check';
import { IMemberOptionListProps } from './member_option_list.interface';
import styles from './styles.module.less';
import { InfoCard } from 'pc/components/common/info_card';

const triggerBase = {
  action: ['hover'],

  popupAlign: {
    points: ['cr', 'cl'],
    offset: [-24, 0],
    overflow: { adjustX: true, adjustY: true },
  }
};

export const MemberOptionList: React.FC<IMemberOptionListProps & { inputRef?: React.RefObject<HTMLInputElement> }> = props => {
  const {
    linkId, unitMap, listData, onClickItem, showSearchInput,
    showMoreTipButton, multiMode, existValues, uniqId, activeIndex, showInviteTip = true,
    inputRef, monitorId, className, searchEmail
  } = props;
  const initList = Array.isArray(listData) ? listData : memberStash.getMemberStash();
  const [memberList, setMemberList] = useState<(IUnitValue | IUserValue)[]>(() => {
    // 无论是否要开启远程搜索，都需要对数据做一次备份，尤其是组件传入的 local data
    return initList;
  });
  const dispatch = useDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const { formId } = useSelector(state => state.pageParams);
  const shareId = useSelector(state => state.pageParams.shareId);

  const refreshMemberList = useCallback(() => {
    // listData 未传入，直接使用 stash
    if (!listData) {
      setMemberList(memberStash.getMemberStash());
      return;
    }
    setMemberList(listData);
  }, [listData]);

  useEffect(() => {
    refreshMemberList();
  }, [refreshMemberList]);

  const loadOrSearchMember = async(keyword?: string) => {
    if (!showSearchInput && listData != null) {
      // 不开启远程搜索的情况下，原始数据需要读取从外部传入的完整数据，不可以用组件内缓存的数据
      const fuse = new Fuse(listData, { keys: ['name'] });
      if (keyword) {
        return fuse.search(keyword).map(item => (item as any).item); // FIXME:TYPE
      }
      return listData;
    }
    if (!keyword?.length) {
      return initList;
    }
    const res = await Api.loadOrSearch({ filterIds: '', keyword, linkId, searchEmail });
    const data: IUnitValue[] = res.data.data;
    if (uniqId === 'userId') {
      return data.filter(unitValue => unitValue.type === MemberType.Member && Boolean(unitValue.userId));
    }
    return data;
  };

  const { data, run } = useRequest(loadOrSearchMember, {
    debounceWait: 200,
    manual: true,
  });

  useUpdateEffect(() => {
    // FIXME: API 应该有返回类型
    if (Array.isArray(data)) {
      setMemberList(data);
    }
  }, [data]);

  // 选择一个新的成员，将该成员的信息更新到 unitMap 中
  function updateMemberInfo(unit: IUnitValue | IUserValue) {
    const { unitId, userId, name, avatar } = unit;
    // 若筛选值为 ”当前用户“ 或 ”匿名者“，则不需要将其更新到对应 Map 中
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
    const newValues = values.map(value => {
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
    onClickItem(newValues.map(item => item.unitId));
  }

  function standardStructure(cv: IUnitIds | IUuids | null) {
    if (!unitMap || !cv) {
      return [];
    }
    return cv
      .filter(item => {
        return unitMap[item];
      })
      .map(item => {
        const info = unitMap[item];
        return {
          avatar: info.avatar,
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
        return onClickItem((existValues as IUnitIds).filter(item => item !== unitId));
      }
      return onClickItem([...(existValues ? (existValues as IUnitIds) : []), unitId!]);
    }
    return onClickItem(hasChecked ? [] : [unitId!]);
  }

  return (
    <div
      className={classNames('memberOptionList', styles.memberOptionList, className)}
      tabIndex={0}
      ref={containerRef}
    >
      <CommonList
        monitorId={monitorId}
        inputRef={inputRef}
        value={existValues}
        onClickItem={clickItem}
        showInput={showSearchInput}
        activeIndex={activeIndex}
        inputStyle={{ padding: 8 }}
        onInputClear={() => setMemberList(initList)}
        noSearchResult={
          () => {
            return <span className={styles.noResult}>
              {uniqId == 'unitId' ? t(Strings.cell_not_find_member_or_team) : t(Strings.cell_not_find_member)}
              {
                (showInviteTip && !formId && !shareId) &&
                <span className={styles.inviteMember} onClick={() => expandInviteModal()}>
                  {t(Strings.invite_member)}
                </span>
              }
            </span>;
          }
        }
        onSearchChange={(e, keyword) => {
          run(keyword);
        }}
        // 分享页面不允许出现查看更多，空间站内的组织结构会泄露
        footerComponent={showMoreTipButton && !shareId ? () => {
          return <div
            className={styles.seeMore}
            onMouseUp={e => {
              expandUnitModal({
                source: SelectUnitSource.Member,
                onSubmit: values => handleSubmit(values),
                isSingleSelect: !multiMode,
                checkedList: standardStructure(existValues),
                onClose: () => refreshMemberList(),
                showTab: true,
              });
            }}
            onMouseDown={e => {
              e.preventDefault();
            }}
          >
            {t(Strings.see_more)}
          </div>;
        } : undefined}
      >
        {
          memberList.map((item, index) => {
            const unitId = uniqId === 'unitId' ? item.unitId : item.userId;
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
                  title={item.name}
                  description={item.teamData ? item.teamData[0]?.fullHierarchyTeamName : ''}
                  avatarProps={{
                    id: unitId || '',
                    title: item.name,
                    src: item.avatar,
                  }}
                  userId={item.userId || item.uuid}
                  memberId={item.unitRefId}
                  triggerBase={triggerBase}
                  className={styles.memberInfoCard}
                  isDeleted={item.isDeleted}
                  memberType={item.type}
                  isActive={item.isActive}
                  desc={item.desc}
                />
                <Check isChecked={Boolean(existValues && existValues.includes(unitId!))} />
              </CommonList.Option>
            );
          })
        }
      </CommonList>
    </div>
  );
};
