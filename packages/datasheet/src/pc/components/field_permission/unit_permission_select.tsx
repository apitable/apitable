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

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import * as React from 'react';
import styles from './styles.module.less';
import { PopStructure } from 'pc/components/editors/pop_structure';
import { MemberOptionList } from 'pc/components/list';
import { useSelector } from 'react-redux';
import { ConfigConstant, Selectors, Strings, t, IUnitIds } from '@apitable/core';
import { Divider } from 'antd';
import { MemberItem } from 'pc/components/multi_grid/cell/cell_member/member_item';
import { stopPropagation } from 'pc/utils';
import IconClose from 'static/icon/datasheet/datasheet_icon_exit.svg';
import { DoubleSelect, Typography, Button, useThemeColors, IDoubleOptions } from '@apitable/components';
import { IUnitPermissionSelectProps } from './interface';
import classnames from 'classnames';
import { useClickAway } from 'ahooks';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import PulldownIcon from 'static/icon/common/common_icon_pulldown_line.svg';
import { MobileSelect } from 'pc/components/common';
import { AddOutlined, CheckOutlined } from '@apitable/icons';
import { Message } from 'pc/components/common/message/message';

export const UnitPermissionSelect: React.FC<React.PropsWithChildren<IUnitPermissionSelectProps>> = props => {
  const colors = useThemeColors();
  const { permissionList, onSubmit, classNames, adminAndOwnerUnitIds = [], showTeams, searchEmail } = props;
  const unitMap =
    useSelector(state => {
      return Selectors.getUnitMap(state);
    }) || {};
  const datasheetId = useSelector(state => state.pageParams.datasheetId)!;
  const [height, setHeight] = useState(0);
  const [editing, setEditing] = useState(false);
  const [unitValue, setUnitValue] = useState<IUnitIds>([]);
  const [permissionValue, setPermissionValue] = useState(permissionList[2] || permissionList[0]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const unitListRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const noPermissionMembers = useSelector(state => state.catalogTree.noPermissionMembers);
  const permissionCommitRemindStatus = useSelector(state => state.catalogTree.permissionCommitRemindStatus);
  useEffect(() => {
    if (permissionCommitRemindStatus && noPermissionMembers) {
      setUnitValue([...noPermissionMembers]);
    }
  }, [permissionCommitRemindStatus, noPermissionMembers]);

  const changePermission = (option: React.SetStateAction<IDoubleOptions>) => {
    setPermissionValue(option);
  };

  useLayoutEffect(() => {
    if (containerRef.current) {
      setHeight(containerRef.current.clientHeight);
    }
  }, [editing, unitValue]);

  const onMentionSelect = (value: IUnitIds) => {
    setUnitValue(value);
  };

  const openMemberList = (e: React.MouseEvent, toggleClose = true) => {
    !editing && document.body.click();
    stopPropagation(e);
    if (toggleClose) {
      setEditing(editing => !editing);
    } else {
      setEditing(true);
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  useClickAway(
    () => {
      setEditing(false);
    },
    unitListRef,
    'click',
  );

  const submitPermission = (e: React.MouseEvent) => {
    if (!unitValue.length) {
      openMemberList(e, false);
      return;
    }
    const unitInfos = unitValue.map(unitId => {
      return unitMap[unitId];
    });
    
    if (unitInfos.some(({ unitId }) => adminAndOwnerUnitIds.includes(unitId))) {
      Message.error({ content: t(Strings.no_permission_setting_admin) });
      return;
    }

    onSubmit(unitInfos, permissionValue);
    setUnitValue([]);
  };

  const removeUnit = (unitId: string) => {
    setUnitValue(value => {
      return value.filter(id => {
        return id !== unitId;
      });
    });
  };

  return (
    <div className={classnames(styles.unitPermissionSelectWrapper, classNames)}>
      <div className={styles.unitValueWrapper} ref={containerRef} tabIndex={-1}>
        <div className={styles.unitValue} onClick={openMemberList} tabIndex={-1}>
          <div className={styles.placeholder}>
            <AddOutlined color={colors.thirdLevelText} />
            {!unitValue.length && <Typography variant="body3" color={colors.thirdLevelText} style={{ lineHeight: 1.1, wordBreak: 'keep-all' }}>
              {t(Strings.add_member_or_unit)}
            </Typography>}
          </div>
          {unitValue.map((unitId) => {
            const unitInfo = unitMap[unitId];
            return (
              <MemberItem unitInfo={unitInfo} key={unitId}>
                <div
                  onClick={e => {
                    stopPropagation(e);
                    removeUnit(unitId);
                  }}
                  onMouseDown={stopPropagation}
                  style={{ cursor: 'pointer' }}
                >
                  <IconClose width={8} height={8} fill={colors.secondLevelText} />
                </div>
              </MemberItem>
            );
          })}
        </div>
        <div className={styles.unitPermission}>
          <Divider type={'vertical'} style={{ height: 12, marginRight: 0, top: 1, borderLeftColor: colors.borderCommonDefault }} />

          <ComponentDisplay minWidthCompatible={ScreenSize.md}>
            <DoubleSelect
              value={permissionValue.value}
              disabled={false}
              onSelected={changePermission}
              triggerCls={styles.doubleSelect}
              options={permissionList.map(item => {
                return {
                  label: item.label,
                  subLabel: item.subLabel,
                  value: item.value,
                };
              })}
            />
          </ComponentDisplay>
          <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
            {
              <MobileSelect
                triggerComponent={
                  <div className={styles.mobileRoleSelect}>
                    {ConfigConstant.permissionText[permissionValue.value!]}
                    {<PulldownIcon className={styles.arrowIcon} width={16} height={16} fill={colors.fourthLevelText} />}
                  </div>
                }
                renderList={({ setVisible }) => {
                  return (
                    <div style={{ borderRadius: 8, padding: '0 16px' }}>
                      {permissionList.map((item) => (
                        <div
                          className={styles.mobileOption}
                          key={item.value}
                          onClick={() => {
                            changePermission(item);
                            setVisible(false);
                          }}
                        >
                          <div>
                            <Typography variant={'body2'}>{item.label}</Typography>
                            <Typography variant={'body4'}>{item.subLabel}</Typography>
                          </div>
                          {item.value === permissionValue.value && <CheckOutlined color={colors.primaryColor} />}
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
            }
          </ComponentDisplay>
        </div>
        {editing && (
          <div ref={unitListRef} className={styles.memberListWrapper}>
            <PopStructure style={{}} width={280} height={height} editing className={styles.memberList} onClose={() => setEditing(false)}>
              <MemberOptionList
                showSearchInput
                uniqId={'unitId'}
                onClickItem={onMentionSelect}
                showMoreTipButton
                multiMode
                existValues={unitValue}
                sourceId={datasheetId}
                unitMap={unitMap}
                inputRef={inputRef}
                searchEmail={searchEmail}
                showTeams={showTeams}
              />
            </PopStructure>
          </div>
        )}
      </div>
      <Button className={styles.addBtn} color="primary" onClick={submitPermission}>
        {t(Strings.add)}
      </Button>
    </div>
  );
};
