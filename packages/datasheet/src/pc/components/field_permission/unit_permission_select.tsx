import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import * as React from 'react';
import styles from './styles.module.less';
import { PopStructure } from 'pc/components/editors/pop_structure';
import { MemberOptionList } from 'pc/components/list';
import { useSelector } from 'react-redux';
import { ConfigConstant, Selectors, Strings, t } from '@vikadata/core';
import { Divider } from 'antd';
import { MemberItem } from 'pc/components/multi_grid/cell/cell_member/member_item';
import { stopPropagation } from 'pc/utils';
import IconClose from 'static/icon/datasheet/datasheet_icon_exit.svg';
import { DoubleSelect, Typography, Button, useThemeColors } from '@vikadata/components';
import { IUnitPermissionSelectProps } from './interface';
import classnames from 'classnames';
import { useClickAway } from 'ahooks';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import PulldownIcon from 'static/icon/common/common_icon_pulldown_line.svg';
import { MobileSelect } from 'pc/components/common';
import { AddOutlined, CheckOutlined } from '@vikadata/icons';
import { Message } from 'pc/components/common/message/message';

export const UnitPermissionSelect: React.FC<IUnitPermissionSelectProps> = props => {
  const colors = useThemeColors();
  const { permissionList, onSubmit, classNames, adminAndOwnerUnitIds = [], showTeams, searchEmail } = props;
  const unitMap =
    useSelector(state => {
      return Selectors.getUnitMap(state);
    }) || {};
  const datasheetId = useSelector(state => state.pageParams.datasheetId)!;
  const [height, setHeight] = useState(0);
  const [editing, setEditing] = useState(false);
  const [unitValue, setUnitValue] = useState<string[]>([]);
  const [permissionValue, setPermissionValue] = useState(permissionList[2]);
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

  const changePermission = (option, index) => {
    setPermissionValue(option);
  };

  useLayoutEffect(() => {
    if (containerRef.current) {
      setHeight(containerRef.current.clientHeight);
    }
  }, [editing, unitValue]);

  const onMentionSelect = value => {
    setUnitValue(value);
  };

  const openMemberList = (e, toggleClose = true) => {
    // 用来处理 modal 对于 select 的事件阻止
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

  const submitPermission = e => {
    if (!unitValue.length) {
      openMemberList(e, false);
      return;
    }
    const unitInfos = unitValue.map(unitId => {
      return unitMap[unitId];
    });

    // 检查选择的人中是否有管理员
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
            <Typography variant="body3" color={colors.thirdLevelText} style={{ lineHeight: 1.1, wordBreak: 'keep-all' }}>
              {unitValue.length ? t(Strings.add) : t(Strings.add_member_or_unit)}
            </Typography>
          </div>
          {unitValue.map((unitId, index) => {
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
          <Divider type={'vertical'} style={{ height: 12, marginRight: 0, top: 1 }} />

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
                      {permissionList.map((item, index) => (
                        <div
                          className={styles.mobileOption}
                          key={item.value}
                          onClick={() => {
                            changePermission(item, index);
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
            <PopStructure style={{}} width={280} height={height} editing className={styles.memberList} onClose={() => {}}>
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
