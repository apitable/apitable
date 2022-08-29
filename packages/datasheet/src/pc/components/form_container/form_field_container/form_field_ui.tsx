import { colorVars, IconButton, useContextMenu } from '@vikadata/components';
import { ConfigConstant, Selectors, Strings, t } from '@vikadata/core';
import { AddOutlined, MoreOutlined } from '@vikadata/icons';
import classnames from 'classnames';
import isNumber from 'lodash/isNumber';
import { Tooltip } from 'pc/components/common';
import { useAppendField } from 'pc/components/expand_record/hooks/use_append_field';
import { useEditDesc } from 'pc/components/expand_record/hooks/use_edit_desc';
import { useEditField } from 'pc/components/expand_record/hooks/use_edit_field';

import { FormContext } from 'pc/components/form_container/form_context';
import { UrlDiscern } from 'pc/components/multi_grid/cell/cell_text/url_discern';
import { isTouchDevice } from 'pc/utils';
import * as React from 'react';
import { useSelector } from 'react-redux';

import styles from './style.module.less';

interface IFormFieldUIProps {
  index: number;
  title: string;
  required?: boolean;
  desc?: string;
  errorMsg?: string;
  datasheetId: string;
  fieldId: string;
  colIndex?: number;
  editable: boolean;
}

export const FormFieldUI: React.FC<IFormFieldUIProps> = ({
  index,
  title,
  children,
  required,
  desc,
  errorMsg,
  datasheetId,
  fieldId,
  colIndex,
  editable,
}) => {
  const { formProps } = React.useContext(FormContext);
  const formState = useSelector(state => Selectors.getForm(state));

  const { show: showMenu } = useContextMenu({ id: ConfigConstant.ContextMenuType.FORM_FIELD_OP });
  const onEditField = useEditField({ datasheetId, fieldId, colIndex });
  const onEditDesc = useEditDesc({ datasheetId, fieldId, colIndex });
  const onAppendField = useAppendField(datasheetId);

  const descIsEmpty = React.useMemo(() => isNumber(desc) ? false : !desc, [desc]);

  const onShowMenu = (e) => {
    e.persist();

    showMenu(e, {
      props: {
        onInsertAbove: Number(colIndex) >= 1 ? () => onAppendField(e, Number(colIndex) - 1) : null,
        onInsertBelow: () => onAppendField(e, Number(colIndex)),
        onEdit: editable ? () => onEditField(e) : null,
        onEditDesc: () => onEditDesc(e),
      }
    });
  };

  const renderIndex = () => {
    // 若indexVisible为undefined或true时，才展示index
    if (formProps.indexVisible === false) return null;

    return <span className={styles.indexClass}>{index < 10 ? `0${index}` : index}</span>;
  };

  return (
    <div className={styles.formField} data-hasError={!!errorMsg}>
      <h4 className={styles.title} data-required={required}>
        {renderIndex()}
        <span className={styles.titleText}>{title}</span>
        {/* 有表单及源表的manageable权限且未设置过列权限时才可编辑 */}
        {formState?.permissions?.manageable &&
          formState?.sourceInfo?.datasheetPermissions?.manageable &&
          !formState?.fieldPermissionMap?.[fieldId] && (
          <div className={classnames(styles.buttonsGroup, isTouchDevice() && styles.touchDevice)}>
            <Tooltip title={t(Strings.insert_new_field_below)}>
              <IconButton
                component="button"
                shape="square"
                icon={() => <AddOutlined size={16} color={colorVars.fc3} />}
                onClick={(e) => onAppendField(e, Number(colIndex))}
                style={{ marginRight: 8 }}
              />
            </Tooltip>
            <IconButton
              component="button"
              shape="square"
              icon={() => <MoreOutlined size={16} color={colorVars.fc3} />}
              onClick={(e) => onShowMenu(e)}
            />
          </div>
        )}
      </h4>
      {/* {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>} */}
      {!descIsEmpty && <pre className={styles.fieldDesc}><UrlDiscern value={desc} /></pre>}
      {children}
    </div>
  );
};
