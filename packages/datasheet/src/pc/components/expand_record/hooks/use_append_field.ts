import { FieldOperateType, SetFieldFrom, StoreActions } from '@vikadata/core';
import { ButtonOperateType } from 'pc/utils';
import { useDispatch } from 'react-redux';

export const useAppendField = (datasheetId: string) => {
  const dispatch = useDispatch();

  return (e: MouseEvent, realColIndex: number, hiddenColumn?: boolean) => {
    if (typeof realColIndex !== 'number' || realColIndex < 0) return;

    const { clientX, clientY } = e;

    // FieldSetting Modal定宽336，留点余量不要顶边
    const fieldRectLeft = clientX - 340;
    const fieldRectBottom = window.innerHeight - clientY >= 360 ? clientY : clientY - 360;
    dispatch(
      StoreActions.setActiveFieldState(datasheetId, {
        from: SetFieldFrom.EXPAND_RECORD,
        fieldId: ButtonOperateType.AddField,
        fieldRectLeft: fieldRectLeft,
        fieldRectBottom: fieldRectBottom,
        clickLogOffsetX: 0,
        fieldIndex: realColIndex + 1,
        operate: FieldOperateType.FieldSetting,
        hiddenColumn
      }),
    );
  };
};
