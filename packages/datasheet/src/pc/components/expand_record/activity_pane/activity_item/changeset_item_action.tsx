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

import cls from 'classnames';
import { has, intersectionWith, isEqual, xorBy } from 'lodash';
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { FieldType, IDPrefix, IField, IJOTAction, LINK_REG, SegmentType, Selectors, string2Segment } from '@apitable/core';
import { ArrowRightOutlined } from '@apitable/icons';
import { FieldTitle } from 'pc/components/expand_record/field_editor';
import { CellValue } from 'pc/components/multi_grid/cell/cell_value';
import { store } from 'pc/store';
import { stopPropagation } from 'pc/utils';
import EditorTitleContext from '../../editor_title_context';
import ChangesetItemHeader from '../changeset_item_header';
import { supplyExtraField, supplyMemberField, supplyMultiSelectField, supplySelectField } from './utils';
import styles from './style.module.less';

const TEXT_TYPES = [
  FieldType.Text,
  FieldType.SingleText,
  FieldType.Number,
  FieldType.DateTime,
  FieldType.CreatedTime,
  FieldType.LastModifiedBy,
  FieldType.Email,
  FieldType.Currency,
  FieldType.URL,
  FieldType.Phone,
  FieldType.Percent,
];

interface IChangesetItemAction {
  revision: number;
  actions: IJOTAction[];
  datasheetId: string;
  cacheFieldOptions: object;
}
interface IActionItem {
  action: IJOTAction;
  index: number;
}

const FieldSwitchTitle: React.FC<React.PropsWithChildren<{ od: any; oi: any }>> = ({ od, oi }) => {
  const colors = useThemeColors();
  return (
    <div className={styles.changesetAction}>
      <div className={styles.header}>
        {/* od does not exist when copying columns, special treatment */}
        {od && <ChangesetItemHeader field={od} old />}
        {od && <ArrowRightOutlined size={16} color={colors.thirdLevelText} />}
        <ChangesetItemHeader field={oi} block={!od} />
      </div>
    </div>
  );
};

const ChangesetItemActionBase: React.FC<React.PropsWithChildren<IChangesetItemAction>> = (props) => {
  const { actions, datasheetId, cacheFieldOptions, revision } = props;
  const { updateFocusFieldId } = React.useContext(EditorTitleContext);
  const state = store.getState();
  const snapshot = Selectors.getSnapshot(state, datasheetId)!;
  const ActionItem: React.FC<React.PropsWithChildren<IActionItem>> = ({ action, index }) => {
    let { od, oi } = action as any;
    const { p } = action as any;

    // Cell manipulation
    if (p[0] === 'recordMap' && p.length === 4) {
      if (typeof od === 'object' && od.id && typeof od.id === 'string' && od.id.startsWith(IDPrefix.Record)) {
        return null;
      }
      const recordId = p[1] as string;
      const fieldId = p[3];
      const field = snapshot.meta.fieldMap[fieldId];
      if (!field) return null;
      let oiField: IField | undefined = field;
      let odField: IField | undefined = field;
      // Fill in the missing fields for single and multiple choice op
      if (typeof oi === 'string' && oi.startsWith(IDPrefix.Option)) {
        oiField = supplySelectField({ cacheFieldOptions, fieldId, oiOrOd: oi, field: oiField });
      }
      if (typeof od === 'string' && od.startsWith(IDPrefix.Option)) {
        odField = supplySelectField({ cacheFieldOptions, fieldId, oiOrOd: od, field: odField });
      }
      if (Array.isArray(oi) && typeof oi[0] === 'string') {
        if (oi[0].startsWith(IDPrefix.Option)) {
          oiField = supplyMultiSelectField({ cacheFieldOptions, fieldId, oiOrOd: oi, field: oiField });
        } else if (oi[0].startsWith(IDPrefix.Record)) {
          oiField = supplyExtraField({ cacheFieldOptions, fieldId, revision, field: oiField, isOi: true });
        } else {
          oiField = supplyMemberField({ cacheFieldOptions, fieldId, oiOrOd: oi, field: oiField });
        }
      }
      if (Array.isArray(od) && typeof od[0] === 'string') {
        if (od[0].startsWith(IDPrefix.Option)) {
          odField = supplyMultiSelectField({ cacheFieldOptions, fieldId, oiOrOd: od, field: odField });
        } else if (od[0].startsWith(IDPrefix.Record)) {
          odField = supplyExtraField({ cacheFieldOptions, fieldId, revision, field: odField });
        } else {
          odField = supplyMemberField({ cacheFieldOptions, fieldId, oiOrOd: od, field: odField });
        }
      }
      if (typeof od === 'number' || typeof od === 'boolean') {
        odField = supplyExtraField({ cacheFieldOptions, fieldId, revision, field: odField });
      }
      if (typeof oi === 'number' || typeof oi === 'boolean') {
        oiField = supplyExtraField({ cacheFieldOptions, fieldId, revision, field: oiField, isOi: true });
      }
      if (Array.isArray(oi) && typeof oi[0] === 'object') {
        if (oi[0].type) {
          oiField = {
            ...oiField,
            type: SegmentType.Email === oi[0].type ? FieldType.Email : FieldType.Text,
          } as IField;
        } else if (oi[0].token) {
          oiField = {
            type: FieldType.Attachment,
          } as IField;
        }
        if (oi[0].type && oi[0].type === FieldType.Text) {
          const urlMatch = [...oi[0].text.matchAll(LINK_REG)];
          if (urlMatch.length) {
            oi = string2Segment(oi[0].text);
          }
        }
      }
      if (Array.isArray(od) && typeof od[0] === 'object') {
        if (od[0].type) {
          odField = {
            ...odField,
            type: SegmentType.Email === od[0].type ? FieldType.Email : FieldType.Text,
          } as IField;
        } else if (od[0].documentId) {
          odField = {
            ...odField,
            type: FieldType.WorkDoc,
          } as IField;
        } else {
          odField = {
            type: FieldType.Attachment,
          } as IField;
        }
      }

      let preTypeSwitch = false;
      if (index > 0) {
        const { p: preP, od: preOd, oi: preOi } = (actions as any)[index - 1];
        preTypeSwitch = preP[0] === 'meta' && preP[1] === 'fieldMap' && preOd && preOi && preOd.type !== preOi.type;
      }

      let nextTypeSwitch = false;
      if (index === 0) {
        const { p: nextP, od: preOd, oi: preOi } = (actions as any)[1] || {};
        nextTypeSwitch = nextP && nextP[0] === 'meta' && nextP[1] === 'fieldMap' && preOd && preOi && preOd.type !== preOi.type;
      }
      const shouldDiff =
        Array.isArray(oi) &&
        Array.isArray(od) &&
        (typeof oi[0] === 'object' ? has(oi, '0.id') : Boolean(oi[0])) &&
        (typeof od[0] === 'object' ? has(od, '0.id') : Boolean(od[0]));
      let diff = shouldDiff ? intersectionWith(oi, od, isEqual) : null;
      if (diff) {
        const compare = (item: { id: any }) => (typeof item === 'object' ? item.id : item);
        oi = xorBy(oi, diff, compare);
        od = xorBy(od, diff, compare);
        if (oi.length === 0) {
          oi = null;
        }
        if (od.length === 0) {
          od = null;
        }
        if (diff.length === 0) {
          diff = null;
        }
      }

      return (
        <div className={styles.changesetAction}>
          {!preTypeSwitch && !nextTypeSwitch && (
            <div className={styles.header}>
              <FieldTitle
                fieldId={fieldId}
                datasheetId={datasheetId}
                onMouseDown={(e) => {
                  updateFocusFieldId(fieldId);
                  stopPropagation(e);
                }}
                hideDesc
                hideLock
                hover
                hideRequired
                iconColor="currentcolor"
              />
            </div>
          )}
          {nextTypeSwitch && <FieldSwitchTitle od={(actions[1] as any).od} oi={(actions[1] as any).oi} />}
          {diff != null && odField && (
            <div
              className={cls(styles.diff, {
                [styles.text]: odField && TEXT_TYPES.includes(odField.type),
                [styles.attachment]: odField && [FieldType.Attachment].includes(odField.type),
              })}
            >
              <CellValue recordId={recordId} field={odField} cellValue={diff} readonly />
            </div>
          )}
          {od != null && odField && (
            <div
              className={cls(styles.old, {
                [styles.text]: odField && TEXT_TYPES.includes(odField.type),
                [styles.attachment]: odField && [FieldType.Attachment].includes(odField.type),
              })}
            >
              <CellValue recordId={recordId} field={odField} cellValue={od} readonly />
            </div>
          )}
          {oi != null && oiField && (
            <div
              className={cls(styles.new, {
                [styles.text]: oiField && TEXT_TYPES.includes(oiField.type),
                [styles.attachment]: oiField && [FieldType.Attachment].includes(oiField.type),
              })}
            >
              <CellValue recordId={recordId} field={oiField} cellValue={oi} readonly isActive />
            </div>
          )}
        </div>
      );
    } else if (p[0] === 'meta' && p[1] === 'fieldMap' && (action as any).od != null) {
      const { od: preOd, oi: preOi } = action as any;
      if (index === 0 && preOd && preOi && preOd.type !== preOi.type) {
        return <FieldSwitchTitle od={od} oi={oi} />;
      }
    }
    return null;
  };

  return (
    <div>
      {actions.map((at, index) => (
        <ActionItem key={index} action={at} index={index} />
      ))}
    </div>
  );
};

export const ChangesetItemAction = React.memo(ChangesetItemActionBase);
