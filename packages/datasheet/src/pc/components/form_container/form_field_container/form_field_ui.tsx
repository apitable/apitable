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

import classnames from 'classnames';
import isNumber from 'lodash/isNumber';
import * as React from 'react';
// @ts-ignore
import Clamp from 'react-multiline-clamp';
import { colorVars, IconButton, LinkButton, useContextMenu } from '@apitable/components';
import { ConfigConstant, Selectors, Strings, t } from '@apitable/core';
import { AddOutlined, MoreOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { useAppendField } from 'pc/components/expand_record/hooks/use_append_field';
import { useEditDesc } from 'pc/components/expand_record/hooks/use_edit_desc';
import { useEditField } from 'pc/components/expand_record/hooks/use_edit_field';
import { FormContext } from 'pc/components/form_container/form_context';
import { useAppSelector } from 'pc/store/react-redux';
import { isTouchDevice } from 'pc/utils';
import styles from './style.module.less';

const DESC_MAX_LINES = 5;

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

export const FormFieldUI: React.FC<React.PropsWithChildren<IFormFieldUIProps>> = ({
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
  const formState = useAppSelector((state) => Selectors.getForm(state));

  const { show: showMenu } = useContextMenu({ id: ConfigConstant.ContextMenuType.FORM_FIELD_OP });
  const onEditField = useEditField({ datasheetId, fieldId, colIndex });
  const onEditDesc = useEditDesc({ datasheetId, fieldId, colIndex });
  const onAppendField = useAppendField(datasheetId);

  const descIsEmpty = React.useMemo(() => (isNumber(desc) ? false : !desc), [desc]);

  const onShowMenu = (e: any) => {
    e.persist();

    showMenu(e, {
      props: {
        onInsertAbove: Number(colIndex) >= 1 ? () => onAppendField(e, Number(colIndex) - 1) : null,
        onInsertBelow: () => onAppendField(e, Number(colIndex)),
        onEdit: editable ? () => onEditField(e) : null,
        onEditDesc: () => onEditDesc(e),
      },
    });
  };

  const renderIndex = () => {
    // Show index only if indexVisible is undefined or true
    if (formProps.indexVisible === false) return null;

    return <span className={styles.indexClass}>{index < 10 ? `0${index}` : index}</span>;
  };

  return (
    <div className={styles.formField} data-hasError={!!errorMsg}>
      <h4 className={styles.title} data-required={required}>
        {renderIndex()}
        <span className={styles.titleText}>{title}</span>
        {/* Editing is only possible if you have manageable permissions on the form and source table and no column permissions have been set */}
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
      {!descIsEmpty && (
        <Clamp
          lines={DESC_MAX_LINES}
          maxLines={1000}
          withToggle
          withTooltip={false}
          showMoreElement={({ toggle }: { toggle: (e: React.MouseEvent) => void }) => (
            <LinkButton underline={false} onClick={toggle} className={styles.showMore}>
              {t(Strings.see_more)}
            </LinkButton>
          )}
          showLessElement={({ toggle }: { toggle: (e: React.MouseEvent) => void }) => (
            <LinkButton underline={false} onClick={toggle} className={styles.showLess}>
              {t(Strings.collapse)}
            </LinkButton>
          )}
        >
          <pre className={styles.fieldDesc}>
            {desc}
          </pre>
        </Clamp>
      )}
      {children}
    </div>
  );
};
