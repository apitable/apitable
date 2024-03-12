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

import { FC } from 'react';
import { Button } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { UserAddOutlined } from '@apitable/icons';
import { Popup } from 'pc/components/common/mobile/popup';
import { expandInviteModal } from 'pc/components/invite';
import { useAppSelector } from 'pc/store/react-redux';
import { ISelectUnitLeftProps, SelectUnitLeft } from './select_unit_left';
import styles from './style.module.less';

interface ISelectPopupProps extends ISelectUnitLeftProps {
  onCancel(): void;
  onOk(): void;
  linkId?: string;
  showTab?: boolean;
}

export const SelectUnitPopup: FC<React.PropsWithChildren<ISelectPopupProps>> = (props) => {
  const { isSingleSelect, source, disableList, disableIdList, units, setUnits, checkedList, setCheckedList, onCancel, onOk, linkId, showTab } = props;

  const formId = useAppSelector((state) => state.pageParams.formId);

  const Footer = (
    <div className={styles.popupFooter}>
      <Button color="primary" size="large" onClick={onOk} disabled={checkedList.length === 0} block>
        {t(Strings.submit)}
      </Button>

      <div className={styles.inviteBtnWrapper}>
        {!formId && !linkId && (
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
      </div>
    </div>
  );

  return (
    <Popup title={t(Strings.choose_a_member)} className={styles.unitPopupWrapper} open onClose={onCancel} height={'90%'} footer={Footer}>
      <SelectUnitLeft
        isSingleSelect={isSingleSelect}
        source={source}
        checkedList={checkedList}
        setCheckedList={setCheckedList}
        disableList={disableList}
        disableIdList={disableIdList}
        units={units}
        setUnits={setUnits}
        showTab={showTab}
      />
    </Popup>
  );
};
