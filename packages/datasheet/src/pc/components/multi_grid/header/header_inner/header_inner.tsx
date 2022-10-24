import { colorVars, useContextMenu, useThemeColors } from '@vikadata/components';
import { DATASHEET_ID, Field, FieldOperateType, IField, Selectors, Strings, t } from '@apitable/core';
import classNames from 'classnames';
import { Tooltip } from 'pc/components/common';
import { FieldPermissionLockEnhance } from 'pc/components/field_permission';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import { ButtonOperateType, FIELD_DOT, OPACITY_LINE_CLASS, OPERATE_BUTTON_CLASS } from 'pc/utils';
import * as React from 'react';
import { useSelector } from 'react-redux';
import IconDot from 'static/icon/common/common_icon_more.svg';
import WarnIcon from 'static/icon/common/common_icon_warning_triangle.svg';
import IconFieldDesc from 'static/icon/datasheet/datasheet_icon_edit_describe.svg';
import { stopPropagation } from '../../../../utils/dom';
import styles from '../styles.module.less';

export interface IHeadInnerProps {
  field: IField;
  isShowHighLight: boolean;
  isSelected?: boolean;
  curColumnIndex?: number;
}

export function renderComputeFieldError(field: IField, errText: string, isMobile?: boolean, warnText?: string) {
  if (!field) {
    return;
  }
  const isError = Field.bindModel(field).hasError;
  if (isError || warnText) {
    return (
      <Tooltip
        title={isError ? errText : warnText}
        placement={isMobile ? 'topLeft' : 'top'}
        overlayClassName={styles.errorTip}
      >
        <WarnIcon fill={colorVars.warningColor} width={15} height={13} className={styles.warningIcon} />
      </Tooltip>
    );
  }
  return;
}

export function compatible(text: string | object) {
  if (typeof text !== 'string') {
    return '';
  }
  return text.trim();
}

export const HeaderInner: React.FC<IHeadInnerProps> = props => {
  const { field, isShowHighLight, curColumnIndex, isSelected } = props;
  const colors = useThemeColors();
  const { operate, fieldId: operateFieldId } = useSelector(Selectors.gridViewActiveFieldState);
  const { mirrorId } = useSelector(state => state.pageParams);
  const { columnWidthEditable, editable } = useSelector(state => Selectors.getPermissions(state));
  const dotOperateClass = classNames(FIELD_DOT, styles.dotOperate);
  const fieldDescClass = classNames(OPERATE_BUTTON_CLASS, styles.fieldDescIcon, {
    [styles.focus]: !field.desc && operate === FieldOperateType.FieldDesc,
  });
  const isOpenFieldDescCard = operateFieldId === field.id && operate === FieldOperateType.FieldDesc;
  const isShowFieldDesc = field.desc || isOpenFieldDescCard;
  const isHoverCurrentField = useSelector(state => {
    return Selectors.getGridViewHoverFieldId(state) === field.id;
  });
  const { show } = useContextMenu({ id: DATASHEET_ID.FIELD_CONTEXT });

  return (
    <>
      <div className={styles.iconType}>
        {getFieldTypeIcon(field.type, isShowHighLight ? colors.primaryColor : colors.secondLevelText)}
      </div>
      <div className={classNames('flex item-center', styles.fieldNameWrapper)}>
        <Tooltip title={field.name} textEllipsis>
          <div className={styles.fieldName} style={{ color: isShowHighLight ? colors.primaryColor : '' }}>
            {field.name}
          </div>
        </Tooltip>
        {
          Field.bindModel(field).isComputed && renderComputeFieldError(
            field,
            t(Strings.field_configuration_err),
            false,
            Field.bindModel(field).warnText,
          )
        }
        <FieldPermissionLockEnhance fieldId={field.id} style={{ marginLeft: 4 }} color={isSelected ? colors.primaryColor : colors.thirdLevelText} />
        {
          isShowFieldDesc &&
          <div
            className={fieldDescClass}
            style={{
              display: isHoverCurrentField || isOpenFieldDescCard ? 'flex' : ''
            }}
            onMouseDown={stopPropagation}
            data-operate-type={ButtonOperateType.OpenFieldDesc}
          >
            <Tooltip
              title={<pre className={styles.tipPre}>{compatible(field.desc || t(Strings.field_desc))}</pre>}
              placement="top"
            >
              <IconFieldDesc />
            </Tooltip>
          </div>
        }
      </div>
      {
        !mirrorId &&
        editable &&
        <IconDot
          width={16}
          height={16}
          fill={isSelected ? colors.primaryColor : colors.fourthLevelText}
          className={dotOperateClass}
          style={{
            display: isHoverCurrentField ? 'flex' : ''
          }}
          data-column-index={curColumnIndex}
          data-field-id={field.id}
          onClick={(e: unknown) => show(e as React.MouseEvent<HTMLElement>, { id: DATASHEET_ID.FIELD_CONTEXT, props: { fieldId: field.id }})}
        />
      }
      {
        columnWidthEditable && <div className={classNames(styles.opacityLine, OPACITY_LINE_CLASS)} />
      }
    </>
  );
};

