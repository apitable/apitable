import { FC } from 'react';
import { ISelectUnitLeftProps, SelectUnitLeft } from './select_unit_left';
import styles from './style.module.less';
import { Strings, t } from '@vikadata/core';
import InviteIcon from 'static/icon/space/space_icon_invite.svg';
import { expandInviteModal } from 'pc/components/invite';
import { Button } from '@vikadata/components';
import { Popup } from 'pc/components/common/mobile/popup';
import { useSelector } from 'react-redux';

interface ISelectPopupProps extends ISelectUnitLeftProps {
  onCancel(): void;
  onOk(): void;
  linkId?: string;
}

export const SelectUnitPopup: FC<ISelectPopupProps> = props => {

  const {
    isSingleSelect,
    source,
    disableList,
    disableIdList,
    units,
    setUnits,
    checkedList,
    setCheckedList,
    onCancel,
    onOk,
    linkId,
  } = props;

  const formId = useSelector(state => state.pageParams.formId);

  const Footer = (
    <div className={styles.popupFooter}>
      <Button
        color="primary"
        size="large"
        onClick={onOk}
        disabled={checkedList.length === 0}
        block
      >
        {t(Strings.submit)}
      </Button>

      <div className={styles.inviteBtnWrapper}>
        {
          !formId && !linkId && <span className={styles.invite} onClick={() => { expandInviteModal(); }}>
            <InviteIcon />{t(Strings.invite_member)}
          </span>
        }
      </div>
    </div>
  );

  return (
    <Popup
      title={t(Strings.choose_a_member)}
      className={styles.unitPopupWrapper}
      visible
      onClose={onCancel}
      height={'90%'}
      footer={Footer}
    >
      <SelectUnitLeft
        isSingleSelect={isSingleSelect}
        source={source}
        checkedList={checkedList}
        setCheckedList={setCheckedList}
        disableList={disableList}
        disableIdList={disableIdList}
        units={units}
        setUnits={setUnits}
      />
    </Popup>
  );
};
