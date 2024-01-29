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

// TODO Reconstructing the address book
import * as React from 'react';
import { FC, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Button, TextButton, ThemeProvider } from '@apitable/components';
import { IUnit, Selectors, Strings, t, UnitItem } from '@apitable/core';
import { UserAddOutlined } from '@apitable/icons';
import { BaseModal } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { IModalProps } from 'pc/components/common/modal/modal/modal.interface';
import { expandInviteModal } from 'pc/components/invite';
import { useSpaceInfo } from 'pc/hooks';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from 'pc/utils';
import { SelectUnitLeft } from './select_unit_left';
import { SelectUnitPopup } from './select_unit_popup';
import { SelectUnitRight } from './select_unit_right';
import styles from './style.module.less';

export enum SelectUnitSource {
  Perm = 'perm',
  Member = 'member',
  Admin = 'admin',
  TeamAddMember = 'teamAddMember',
  ChangeMemberTeam = 'changeMemberTeam',
  SyncMember = 'syncMember',
}

export interface ISelectUnitModalProps extends Omit<IModalProps, 'onCancel'> {
  isSingleSelect?: boolean;
  checkedList?: UnitItem[];
  source?: SelectUnitSource;
  disableList?: string[];
  disableIdList?: string[];
  onSubmit: (checkedList: UnitItem[]) => void;
  onCancel: React.Dispatch<React.SetStateAction<string>>;
  onClose?: () => void;
  hiddenInviteBtn?: boolean;
  spaceId?: string;
  allowEmtpyCheckedList?: boolean;
  showTab?: boolean; // show role and org tab
}

export const SelectUnitModal: FC<React.PropsWithChildren<ISelectUnitModalProps>> = (props) => {
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

  const { spaceInfo } = useSpaceInfo(spaceId);
  const cacheTheme = useAppSelector(Selectors.getTheme);

  const [checkedList, setCheckedList] = useState<UnitItem[]>(propsCheckedList ? propsCheckedList : []);

  const [units, setUnits] = useState<IUnit | null>(null);

  const linkId = useAppSelector(Selectors.getLinkId);
  const formId = useAppSelector((state) => state.pageParams.formId);

  const onCancel = () => {
    propsCancel('');
  };

  const cancelCheck = (unitId: string) => {
    setCheckedList(checkedList.filter((item) => item.unitId !== unitId));
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
            <UserAddOutlined />
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
  const root = createRoot(container);
  const onModalClose = () => {
    root.unmount();
    container.parentElement!.removeChild(container);
    options.onClose?.();
  };

  root.render(
    <Provider store={store}>
      <SelectUnitModal {...options} onCancel={() => onModalClose()} />
    </Provider>,
  );
};
