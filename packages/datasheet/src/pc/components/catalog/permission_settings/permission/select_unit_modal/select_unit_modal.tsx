// TODO 重构通讯录
import { IModalProps } from 'pc/components/common/modal/modal/modal.interface';
import { FC, useState } from 'react';
import * as React from 'react';
import { BaseModal } from 'pc/components/common';
import { IUnit, Strings, t, Selectors, UnitItem } from '@vikadata/core';
import { Button, ThemeProvider, TextButton } from '@vikadata/components';
import styles from './style.module.less';
import { stopPropagation } from 'pc/utils';
import InviteIcon from 'static/icon/space/space_icon_invite.svg';
import { expandInviteModal } from 'pc/components/invite';
import { useSelector, Provider } from 'react-redux';
import { store } from 'pc/store';
import ReactDOM from 'react-dom';
import { SelectUnitLeft } from './select_unit_left';
import { SelectUnitRight } from './select_unit_right';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { SelectUnitPopup } from './select_unit_popup';
import { useSpaceInfo } from 'pc/hooks';

export enum SelectUnitSource {
  Perm = 'perm',
  Member = 'member',
  Admin = 'admin',
  TeamAddMember = 'teamAddMember',
  ChangeMemberTeam = 'changeMemberTeam',
  SyncMember = 'syncMember',
}

// source的说明：perm-权限，member-成员字段，admin-子管理员，changeMemberTeam-分配小组，teamAddMember-添加成员
export interface ISelectUnitModalProps extends Omit<IModalProps, 'onCancel'> {
  isSingleSelect?: boolean;
  checkedList?: UnitItem[];
  source?: SelectUnitSource; // 用于标示该组件用在什么地方。此组件内部通过这个判断是否需要特殊处理数据
  disableList?: string[]; // 不可勾选的 unit id; source== admin 时，小组也不可勾选
  disableIdList?: string[]; // 不可勾选的id
  onSubmit: (checkedList: UnitItem[]) => void;
  onCancel: React.Dispatch<React.SetStateAction<string>>;
  onClose?: () => void;
  hiddenInviteBtn?: boolean;
  // 企微管理面板不在空间内，需要单独传 spaceId
  spaceId?: string;
  allowEmtpyCheckedList?: boolean; // 部分影响允许清空选择项
  showTab?: boolean; // show role and org tab
}

export const SelectUnitModal: FC<ISelectUnitModalProps> = props => {
  const {
    isSingleSelect,
    checkedList: propsCheckedList,
    source,
    disableList,
    disableIdList,
    onCancel: propsCancel,
    onSubmit: propsOk,
    hiddenInviteBtn,
    spaceId,
    allowEmtpyCheckedList,
    showTab,
    ...rest
  } = props;

  // 企微管理面板不在空间内，需要单独处理 spaceInfo
  const { spaceInfo } = useSpaceInfo(spaceId);
  const cacheTheme = useSelector(Selectors.getTheme);

  // 已选列表（数据源）
  const [checkedList, setCheckedList] = useState<UnitItem[]>(propsCheckedList ? propsCheckedList : []);

  // unitList数据源
  const [units, setUnits] = useState<IUnit | null>(null);

  const linkId = useSelector(Selectors.getLinkId);
  const formId = useSelector(state => state.pageParams.formId);

  const onCancel = (e?) => {
    propsCancel('');
  };

  // 去掉指定的已选unit
  const cancelCheck = (unitId: string) => {
    setCheckedList(checkedList.filter(item => item.unitId !== unitId));
  };

  const onOk = () => {
    propsOk(checkedList);
    onCancel();
  };

  const showInviteIcon = !formId && !hiddenInviteBtn && !linkId;

  const Footer = () => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: showInviteIcon ? 'space-between' : 'flex-end',
          alignItems: 'center',
        }}
      >
        {showInviteIcon && (
          <span
            className={styles.invite}
            onClick={() => {
              expandInviteModal();
            }}
          >
            <InviteIcon />
            {t(Strings.invite_member)}
          </span>
        )}
        <div className={styles.buttonWrapper}>
          <TextButton size={'small'} onClick={onCancel}>
            {t(Strings.cancel)}
          </TextButton>
          <Button color="primary" size="small" onClick={onOk} disabled={!allowEmtpyCheckedList && checkedList.length === 0}>
            {t(Strings.submit)}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <ThemeProvider theme={cacheTheme}>
      <div onMouseDown={stopPropagation} onClick={stopPropagation}>
        <ComponentDisplay minWidthCompatible={ScreenSize.md}>
          <BaseModal
            title={source === SelectUnitSource.ChangeMemberTeam ? t(Strings.choose_a_team) : t(Strings.choose_a_member)}
            width={560}
            onOk={onOk}
            onCancel={onCancel}
            footer={Footer()}
            {...rest}
          >
            <div className={styles.selectUnitModal} onKeyDown={stopPropagation}>
              <SelectUnitLeft
                isSingleSelect={isSingleSelect}
                source={source}
                checkedList={checkedList}
                setCheckedList={setCheckedList}
                disableList={disableList}
                disableIdList={disableIdList}
                units={units}
                setUnits={setUnits}
                spaceInfo={spaceInfo}
                showTab={showTab}
              />
              <SelectUnitRight source={source} checkedList={checkedList} cancelCheck={cancelCheck} spaceInfo={spaceInfo} />
            </div>
          </BaseModal>
        </ComponentDisplay>

        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <SelectUnitPopup
            isSingleSelect={isSingleSelect}
            source={source}
            checkedList={checkedList}
            setCheckedList={setCheckedList}
            disableList={disableList}
            disableIdList={disableIdList}
            units={units}
            setUnits={setUnits}
            onCancel={onCancel}
            onOk={onOk}
            linkId={linkId}
            showTab={showTab}
          />
        </ComponentDisplay>
      </div>
    </ThemeProvider>
  );
};

export const expandUnitModal = (options: Omit<ISelectUnitModalProps, 'onCancel'>) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const onModalClose = () => {
    ReactDOM.unmountComponentAtNode(container);
    container.parentElement!.removeChild(container);
    options.onClose?.();
  };

  ReactDOM.render(
    <Provider store={store}>
      <SelectUnitModal {...options} onCancel={() => onModalClose()} />
    </Provider>,
    container,
  );
};
