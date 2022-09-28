import {
  IBreadCrumbData,
  IMember,
  ITeam,
  IUnit,
  Selectors,
  Strings,
  t,
  getCustomConfig,
  ISpaceInfo,
  ISpaceBasicInfo,
  UnitItem,
} from '@vikadata/core';
import { Breadcrumb, Radio, Checkbox, Tabs } from 'antd';
import { AvatarType, ButtonPlus, HorizontalScroll, InfoCard, SearchInput } from 'pc/components/common';
import { ReactChild, useCallback, useEffect, useState } from 'react';
import * as React from 'react';
import styles from './style.module.less';
import LevelRightIcon from 'static/icon/common/common_icon_right_line.svg';
import { SearchResult } from '../search_result';
import { SelectUnitSource } from '.';
import { RadioChangeEvent } from 'antd/lib/radio';
import { useDebounceFn, useMount } from 'ahooks';
import { useCatalogTreeRequest, useResponsive, useRequest } from 'pc/hooks';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useSelector } from 'react-redux';
import { ScreenSize } from 'pc/components/common/component_display';
import classnames from 'classnames';
import { Loading, stopPropagation, useThemeColors } from '@vikadata/components';
import { getSocialWecomUnitName } from 'pc/components/home/social_platform';
import { IRoleItem, useRoleRequest } from 'pc/hooks/use_role';

export interface ISelectUnitLeftProps {
  isSingleSelect?: boolean;
  source?: SelectUnitSource;
  checkedList: UnitItem[];
  setCheckedList: React.Dispatch<React.SetStateAction<UnitItem[]>>;
  disableList?: string[];
  disableIdList?: string[];
  units: IUnit | null;
  setUnits: React.Dispatch<React.SetStateAction<IUnit | null>>;
  spaceInfo?: ISpaceInfo | ISpaceBasicInfo | null;
  showTab?: boolean;
}

enum TabKey {
  Org = 'org',
  Role = 'role',
}

const BreadcrumbItem = Breadcrumb.Item;
const { TabPane } = Tabs;

const triggerBase = {
  action: ['hover'],
  popupAlign: {
    points: ['tl', 'bl'],
    offset: [0, 18],
    overflow: { adjustX: true, adjustY: true },
  }
};

export const SelectUnitLeft: React.FC<ISelectUnitLeftProps> = props => {
  const colors = useThemeColors();
  const {
    isSingleSelect,
    source,
    disableList,
    disableIdList,
    units,
    setUnits,
    checkedList,
    setCheckedList,
    spaceInfo: defaultSpaceInfo,
    showTab,
  } = props;
  const { getSubUnitListReq, searchUnitReq } = useCatalogTreeRequest();
  const { run: getSubUnitList, data: unitsData, loading: unitListloading } = useRequest(getSubUnitListReq, { manual: true });
  const { run: searchUnit, data: searchUnitData } = useRequest(searchUnitReq, { manual: true });
  const { run: search } = useDebounceFn(searchUnit, { wait: 100 });
  // 面包屑数据源
  const [breadCrumbData, setBreadCrumbData] = useState<IBreadCrumbData[]>([{ name: t(Strings.contacts), teamId: '' }]);
  // 搜索关键字
  const [keyword, setKeyword] = useState('');
  // 全选checkbox的状态
  const [checkedAll, setCheckedAll] = useState(false);

  const [clickedTeamId, setClickedTeamId] = useState<string>();

  const [tabActiveKey, setTabActiveKey] = useState<TabKey>(TabKey.Org);

  // role
  const isRole = tabActiveKey === TabKey.Role;
  const { run: getRoleList, data } = useRoleRequest();
  const { isOpen: roleIsOpen, roles: roleList } = data;

  let linkId = useSelector(Selectors.getLinkId);
  const spaceInfo = useSelector(state => state.space.curSpaceInfo) || defaultSpaceInfo;

  const { syncTeamsAndMembersLinkId } = getCustomConfig();

  if (syncTeamsAndMembersLinkId && source === SelectUnitSource.SyncMember) {
    linkId = syncTeamsAndMembersLinkId;
  }

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  useMount(() => {
    showTab && getRoleList();
  });

  useEffect(() => {
    if (isRole || keyword) {
      return;
    }
    getSubUnitList(breadCrumbData[breadCrumbData.length - 1].teamId, linkId);
  }, [keyword, getSubUnitList, breadCrumbData, linkId, isRole]);

  useEffect(() => {
    if (isRole || !keyword) {
      return;
    }
    search(keyword, linkId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, linkId, isRole]);

  useEffect(() => {
    if (source === SelectUnitSource.ChangeMemberTeam && unitsData && 'members' in unitsData) {
      setUnits({ ...unitsData, members: [] });
      return;
    }
    setUnits(unitsData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitsData, source]);

  // 判断是否disabled
  const isDisabled = useCallback(
    (data: UnitItem) => {
      if (source === SelectUnitSource.Admin && 'teamId' in data) {
        return true;
      }
      if (disableList) {
        return disableList.includes(data.unitId);
      }
      if (source === SelectUnitSource.Admin && disableIdList) {
        return disableIdList.includes((data as IMember).memberId);
      }
      if (source === SelectUnitSource.ChangeMemberTeam && disableIdList) {
        return disableIdList.includes((data as ITeam).teamId);
      }
      if (source === SelectUnitSource.TeamAddMember && disableIdList) {
        if ('teamId' in data) {
          return disableIdList.includes((data as ITeam).teamId);
        }
        if ('memberId' in data) {
          return disableIdList.includes((data as IMember).memberId);
        }
      }
      return false;
    },
    [disableList, disableIdList, source],
  );
  // 判断是否有下一级
  const canEntrySubItem = (item: ITeam) => {
    if (source === SelectUnitSource.ChangeMemberTeam) {
      return item.hasChildrenTeam;
    }
    return item.hasChildren;
  };
  useEffect(() => {
    if (!units) {
      return;
    }
    // 判断当前数据是否全部在已选列表中
    const unitsMemberWithoutDisabled = units.members.filter(item => !isDisabled(item));
    const unitsTeamWithoutDisabled = units.teams.filter(item => !isDisabled(item));
    const membersCheckedAll =
      unitsMemberWithoutDisabled.length !== 0
        ? unitsMemberWithoutDisabled.every(item => checkedList.findIndex(checkedItem => checkedItem.unitId === item.unitId) !== -1)
        : true;
    const teamsCheckedAll =
      unitsTeamWithoutDisabled.length !== 0
        ? unitsTeamWithoutDisabled.every(item => checkedList.findIndex(checkedItem => checkedItem.unitId === item.unitId) !== -1)
        : true;
    setCheckedAll(membersCheckedAll && teamsCheckedAll);
  }, [units, checkedList, isDisabled]);

  // 面包屑点击事件
  const skipUnit = (teamId: string) => {
    const index = breadCrumbData.findIndex(item => item.teamId === teamId);
    setBreadCrumbData(breadCrumbData.slice(0, index + 1));
    setClickedTeamId(teamId);
    getSubUnitList(teamId, linkId);
  };

  // 点击下级事件
  const onClickTeamItem = (unit: ITeam) => {
    if (unitListloading || !canEntrySubItem(unit)) {
      return;
    }
    setClickedTeamId(unit.teamId);

    getSubUnitList(unit.teamId, linkId);
    setBreadCrumbData([...breadCrumbData, { name: unit.teamName, teamId: unit.teamId }]);
  };

  // 选中时unit
  const onChangeChecked = (e: CheckboxChangeEvent, unit: UnitItem) => {
    const idx = checkedList.findIndex(item => item.unitId === unit.unitId);
    if (idx !== -1) {
      setCheckedList(checkedList.filter(item => item.unitId !== unit.unitId));
      return;
    }
    setCheckedList([...checkedList, unit]);
  };

  if (!units) {
    return (
      <div className={styles.left}>
        <Loading />
      </div>
    );
  }

  const ItemWrapper = (props: { item: IMember | ITeam; children: ReactChild }) => {
    const { item, children } = props;
    if (isSingleSelect) {
      return React.createElement(Radio, {
        value: item.unitId,
        disabled: source === SelectUnitSource.Admin && ('teamId' in item || (disableIdList && disableIdList.includes((item as IMember).memberId))),
        children,
      });
    }
    const shouldDisableCheckbox =
      (disableList && disableList.includes(item.unitId)) ||
      (source === SelectUnitSource.Admin && 'teamId' in item) ||
      (disableIdList && disableIdList.includes((item as IMember).memberId)) ||
      (source === SelectUnitSource.TeamAddMember &&
        disableIdList &&
        (('teamId' in item && disableIdList.includes((item as ITeam).teamId)) ||
          ('memberId' in item && disableIdList.includes((item as IMember).memberId)))) ||
      (source === SelectUnitSource.ChangeMemberTeam && disableIdList && disableIdList.includes((item as ITeam).teamId));
    return React.createElement(Checkbox, {
      value: item.unitId,
      onChange: e => onChangeChecked(e, item),
      children,
      disabled: shouldDisableCheckbox,
    });
  };

  const MemberItem = (inSearch = false) => (item: IMember) => {
    let _item = item;

    if (source === SelectUnitSource.SyncMember) {
      _item = {
        ...item,
        syncingTeamId: clickedTeamId || '',
      } as any;
    }

    const title = spaceInfo
      ? getSocialWecomUnitName({
        name: _item.originName || _item.memberName,
        isModified: _item.isMemberNameModified,
        spaceInfo,
      })
      : '';

    return (
      <div className={classnames(styles.item, inSearch && styles.searchItem)} key={_item.unitId}>
        <div className={styles.checkWrapper}>
          <ItemWrapper item={_item}>
            <div className={styles.itemContent}>
              <InfoCard
                title={title || t(Strings.unnamed)}
                originTitle={_item.memberName || t(Strings.unnamed)}
                description={_item.teamData ? _item.teamData[0].fullHierarchyTeamName : ''}
                style={{ backgroundColor: 'transparent' }}
                inSearch={inSearch}
                userId={_item.uuid}
                triggerBase={triggerBase}
                avatarProps={{
                  id: _item.unitId,
                  src: _item.avatar,
                  title: _item.originName || _item.memberName || t(Strings.unnamed),
                }}
              />
            </div>
          </ItemWrapper>
        </div>
      </div>
    );
  };

  const TeamItem = (inSearch = false) => (item: ITeam) => (
    <div className={classnames(styles.item, inSearch && styles.searchItem)} key={item.unitId}>
      <div className={styles.checkWrapper}>
        <ItemWrapper item={item}>
          <div className={styles.itemContent} onClick={() => !inSearch && onClickTeamItem(item)}>
            <InfoCard
              title={item.teamName}
              originTitle={item.teamName}
              description={t(Strings.display_member_by_count, {
                memberCount: item.memberCount,
              })}
              style={{ backgroundColor: 'transparent' }}
              inSearch={inSearch}
              avatarProps={{
                id: item.unitId,
                src: '',
                title: item.teamName,
                type: AvatarType.Team,
              }}
            />
          </div>
        </ItemWrapper>
      </div>
      {canEntrySubItem(item) && !inSearch && (
        <ButtonPlus.Icon
          onClick={e => {
            stopPropagation(e);
            onClickTeamItem(item);
          }}
          icon={<LevelRightIcon width={16} height={16} fill={colors.fourthLevelText} />}
        />
      )}
    </div>
  );

  const RoleItem = (item: IRoleItem) => (
    <div className={styles.item} key={item.unitId}>
      <div className={styles.checkWrapper}>
        <Checkbox value={item.unitId} disabled={disableList && disableList.includes(item.unitId)} onChange={e => onChangeChecked(e, item)}>
          <div className={styles.itemContent}>
            <InfoCard
              title={item.roleName}
              originTitle={item.roleName}
              description={t(Strings.display_member_by_count, {
                memberCount: item.memberCount,
              })}
              style={{ backgroundColor: 'transparent' }}
              avatarProps={{
                id: item.unitId,
                src: '',
                title: item.roleName,
                type: AvatarType.Team,
              }}
            />
          </div>
        </Checkbox>
      </div>
    </div>
  );

  function RadioList(data: IUnit | IRoleItem[], inSearch = false) {
    if (!data) return;

    const units = isRole ? null : (data as IUnit);
    const roleList = isRole ? (data as IRoleItem[]) : [];

    function handleUnitRadioChecked(e: RadioChangeEvent) {
      const unitId = e.target.value;
      const selectUnit = units
        ? Object.values(units)
          .flat(1)
          .filter(item => item.unitId === unitId)
        : [];
      setCheckedList(selectUnit);
    }

    function handleRoleRadioChecked(e: RadioChangeEvent) {
      const unitId = e.target.value;
      setCheckedList([unitId]);
    }

    function handleRadioChecked(e: RadioChangeEvent) {
      isRole ? handleRoleRadioChecked(e) : handleUnitRadioChecked(e);
    }

    const members = units?.members || [];
    const teams = units?.teams || [];

    return (
      <div className={styles.dataListWrapper}>
        <Radio.Group value={checkedList.length && checkedList[0].unitId} onChange={handleRadioChecked}>
          {isRole ? (
            <>{roleList.map(RoleItem)}</>
          ) : (
            <>
              {inSearch && teams.length !== 0 && <div className={styles.unitType}>{t(Strings.team)}</div>}
              {teams.map(TeamItem(inSearch))}
              {inSearch && members.length !== 0 && <div className={styles.unitType}>{t(Strings.member)}</div>}
              {members.map(MemberItem(inSearch))}
            </>
          )}
        </Radio.Group>
      </div>
    );
  }

  function CheckboxList(data: IUnit | IRoleItem[], inSearch = false) {
    if (!data) return;

    const units = isRole ? ({} as IUnit) : (data as IUnit);
    const roleList = isRole ? (data as IRoleItem[]) : [];
    const members = units?.members || [];
    const teams = units?.teams || [];

    // 勾选全选
    const onCheckAllChange = () => {
      if (isSingleSelect) return;
      // 全选时
      if (!checkedAll) {
        const newCheckedList: UnitItem[] = Object.values(units)
          .flat()
          .filter(item => {
            if (isDisabled(item)) {
              return false;
            }
            return checkedList.findIndex(listItem => listItem.unitId === item.unitId) === -1;
          })
          .map(item => {
            if ((item as IMember).memberId) {
              return {
                ...item,
                syncingTeamId: clickedTeamId || '',
              };
            }
            return item;
          });

        const data = [...checkedList, ...newCheckedList];

        setCheckedList(data);
      } else {
        // 取消全选
        const newCheckedList = checkedList.filter(listItem => {
          let isExist = true;
          Object.values(units).forEach(eachUnits => {
            if (isExist) {
              isExist = eachUnits.findIndex(item => item.unitId === listItem.unitId) === -1;
            }
          });
          return isExist;
        });
        setCheckedList(newCheckedList);
      }
      setCheckedAll(!checkedAll);
    };

    return (
      <>
        {!isRole && (
          <div className={styles.allCheck}>
            <Checkbox onChange={onCheckAllChange} checked={checkedAll}>
              {t(Strings.select_all)}
            </Checkbox>
          </div>
        )}
        <div className={styles.dataListWrapper}>
          <Checkbox.Group value={checkedList.map(item => item.unitId)}>
            {isRole ? (
              <>{roleList.map(RoleItem)}</>
            ) : (
              <>
                {inSearch && teams.length !== 0 && <div className={styles.unitType}>{t(Strings.team)}</div>}
                {teams.map(TeamItem(inSearch))}
                {inSearch && members.length !== 0 && <div className={styles.unitType}>{t(Strings.member)}</div>}
                {members.map(MemberItem(inSearch))}
              </>
            )}
          </Checkbox.Group>
        </div>
      </>
    );
  }

  const orgSearchData =
    source === SelectUnitSource.ChangeMemberTeam ? searchUnitData && { ...searchUnitData, tags: [], members: [] } : searchUnitData;

  const listData = isRole ? roleList : units;
  const searchData = isRole ? roleList.filter(v => !keyword || v.roleName.includes(keyword)) : orgSearchData;

  // search result is empty
  const isEmptySearch = isRole
    ? !roleList.length
    : !orgSearchData || (!orgSearchData.teams?.length && !orgSearchData.members?.length && !orgSearchData.tags?.length);

  return (
    <div className={styles.left}>
      <div className={styles.searchWrapper}>
        <SearchInput
          placeholder={t(Strings.set_permission_add_member_modal_search)}
          size={isMobile ? 'large' : 'small'}
          keyword={keyword}
          change={setKeyword}
        />
      </div>
      {roleIsOpen && (
        <Tabs
          className={classnames(styles.tabWrap, isRole && styles.tabWrapRole)}
          activeKey={tabActiveKey}
          onChange={value => setTabActiveKey(value as TabKey)}
        >
          <TabPane key={TabKey.Org} tab="组织架构" />
          <TabPane key={TabKey.Role} tab="角色" />
        </Tabs>
      )}
      {!isRole && (
        <div className={styles.breadcrumb}>
          <HorizontalScroll>
            <Breadcrumb separator="/">
              {breadCrumbData.map(breadItem => (
                <BreadcrumbItem key={breadItem.teamId || breadItem.name} onClick={() => skipUnit(breadItem.teamId)}>
                  {breadItem.name}
                </BreadcrumbItem>
              ))}
            </Breadcrumb>
          </HorizontalScroll>
        </div>
      )}
      {isSingleSelect ? RadioList(listData) : CheckboxList(listData)}
      {keyword && (
        <div className={classnames(styles.searchListWrapper, roleIsOpen && styles.searchListWrapperRoleIsOpen)}>
          <SearchResult isEmpty={isEmptySearch}>{isSingleSelect ? RadioList(searchData, true) : CheckboxList(searchData, true)}</SearchResult>
        </div>
      )}
    </div>
  );
};
