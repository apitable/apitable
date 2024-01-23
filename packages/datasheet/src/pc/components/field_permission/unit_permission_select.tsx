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

import { useClickAway } from 'ahooks';
import { Divider } from 'antd';
import classnames from 'classnames';
import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import * as React from 'react';
import { DoubleSelect, Typography, Button, useThemeColors, IDoubleOptions } from '@apitable/components';
import { ConfigConstant, Selectors, Strings, t, IUnitIds } from '@apitable/core';
import { AddOutlined, CheckOutlined, ChevronDownOutlined, CloseOutlined } from '@apitable/icons';
import { MobileSelect } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Message } from 'pc/components/common/message/message';
import { PopStructure } from 'pc/components/editors/pop_structure';
import { MemberOptionList } from 'pc/components/list';
import { MemberItem } from 'pc/components/multi_grid/cell/cell_member/member_item';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from 'pc/utils';
import { IUnitPermissionSelectProps } from './interface';
import styles from './styles.module.less';

export const UnitPermissionSelect: React.FC<React.PropsWithChildren<IUnitPermissionSelectProps>> = (props) => {
  const colors = useThemeColors();
  const { permissionList, onSubmit, classNames, adminAndOwnerUnitIds = [], showTeams, searchEmail } = props;
  const unitMap =
    useAppSelector((state) => {
      return Selectors.getUnitMap(state);
    }) || {};
  const datasheetId = useAppSelector((state) => state.pageParams.datasheetId)!;
  const [height, setHeight] = useState(0);
  const [editing, setEditing] = useState(false);
  const [unitValue, setUnitValue] = useState<IUnitIds>([]);
  const [permissionValue, setPermissionValue] = useState(permissionList[2] || permissionList[0]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const unitListRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const noPermissionMembers = useAppSelector((state) => state.catalogTree.noPermissionMembers);
  const permissionCommitRemindStatus = useAppSelector((state) => state.catalogTree.permissionCommitRemindStatus);
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
      setEditing((editing) => !editing);
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
    const unitInfos = unitValue.map((unitId) => {
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
    setUnitValue((value) => {
      return value.filter((id) => {
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
            {!unitValue.length && (
              <Typography variant="body3" color={colors.thirdLevelText} style={{ lineHeight: 1.1, wordBreak: 'keep-all', marginLeft: 8 }}>
                {t(Strings.add_member_or_unit)}
              </Typography>
            )}
          </div>
          {unitValue.map((unitId) => {
            const unitInfo = unitMap[unitId];
            return (
              <MemberItem unitInfo={unitInfo} key={unitId}>
                <div
                  onClick={(e) => {
                    stopPropagation(e);
                    removeUnit(unitId);
                  }}
                  onMouseDown={stopPropagation}
                  style={{ cursor: 'pointer' }}
                >
                  <CloseOutlined size={8} color={colors.secondLevelText} />
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
              options={permissionList.map((item) => {
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
                    {<ChevronDownOutlined className={styles.arrowIcon} size={16} color={colors.fourthLevelText} />}
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
