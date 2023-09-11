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

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { useMemo, useRef, useState } from 'react';
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { FieldType, Field, IField, ILinkField, ILookUpField, Selectors, Strings, t } from '@apitable/core';
import { WarnCircleFilled, DatasheetOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { InlineNodeName } from 'pc/components/common/inline_node_name';
import { TComponent } from 'pc/components/common/t_component';
import { FieldPermissionLock } from 'pc/components/field_permission';
import { HighlightWords } from 'pc/components/highlight_words';
import { LineSearchInput } from 'pc/components/list/common_list/line_search_input';
import { WrapperTooltip } from 'pc/components/widget/widget_panel/widget_panel_header';
import { useSelectIndex } from 'pc/hooks';
import { store } from 'pc/store';
import { checkComputeRef } from '../../field_setting';
import styles from './styles.module.less';

export enum ShowType {
  LinkField,
  LookField,
}

export interface IFieldSearchPanelProps {
  showType: ShowType;
  fields: IField[];
  field?: ILookUpField;
  onChange(id: string): void;
  errTip?: string;
  activeFieldId?: string;
  setSearchPanelVisible?(v: boolean): void;
  prefix?: React.ReactNode;
}

const NoLookupField = ({ showType, value }: { showType: ShowType; value: string }) => {
  const colors = useThemeColors();
  return (
    <div
      style={{
        height: showType === ShowType.LinkField ? 56 : 42,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: colors.thirdLevelText,
        overflow: 'hidden',
      }}
    >
      <TComponent
        tkey={t(Strings.lookup_not_found_search_keyword)}
        params={{
          notFoundSearchKeywordSpan: <span className={styles.notFoundSearchKeyword}>{value}</span>,
        }}
      />
    </div>
  );
};

const WarnTip = ({ text }: { text: string }) => {
  const colors = useThemeColors();
  return (
    <Tooltip title={text} placement="top">
      <WarnCircleFilled color={colors.warningColor} size={15} className={styles.warningIcon} />
    </Tooltip>
  );
};

interface IFieldItem {
  showType: ShowType;
  handleFieldClick: (fieldId: string) => void;
  field: IField;
  activeFieldId?: string;
  index: number;
  currentIndex: number;
  renderInlineNodeName: (dst: string) => React.ReactNode;
  warnText?: string;
  keyword: string;
}

const FieldItem = (props: IFieldItem) => {
  const { showType, handleFieldClick, field, activeFieldId, index, currentIndex, renderInlineNodeName, warnText, keyword } = props;
  const colors = useThemeColors();
  const foreignDatasheetReadable = useMemo(() => {
    if (showType !== ShowType.LinkField) {
      return true;
    }
    return Selectors.getPermissions(store.getState(), field.property.foreignDatasheetId).readable;
  }, [showType, field]);
  return (
    <WrapperTooltip wrapper={!foreignDatasheetReadable} tip={t(Strings.no_foreign_dst_readable)} style={{ display: 'block' }}>
      <div
        key={field.id}
        onClick={() => {
          foreignDatasheetReadable && !warnText && handleFieldClick(field.id);
        }}
        style={{
          height: showType === ShowType.LinkField ? 56 : 42,
        }}
        className={classNames(
          {
            [styles.activeField]: activeFieldId === field.id,
            [styles.hover]: index === currentIndex,
            active: index === currentIndex,
            [styles.disabled]: !foreignDatasheetReadable || warnText,
          },
          styles.fieldItem,
        )}
      >
        <div className={styles.fieldIconAndTitle} style={{ opacity: !foreignDatasheetReadable || warnText ? 0.5 : 1 }}>
          <div
            className={classNames({
              [styles.iconWithFieldNote]: showType === ShowType.LinkField,
              [styles.iconType]: showType !== ShowType.LinkField,
            })}
          >
            {<DatasheetOutlined color={colors.thirdLevelText} />}
          </div>
          <div className={styles.fieldName}>
            <HighlightWords
              keyword={keyword}
              words={Selectors.getDatasheet(store.getState(), (field as ILinkField).property.foreignDatasheetId)?.name!}
            >
              {showType === ShowType.LinkField && (
                <div className={styles.fieldNote}>{renderInlineNodeName((field as ILinkField).property.foreignDatasheetId)}</div>
              )}
            </HighlightWords>
            <div className={styles.fieldNameText}>{field.name}</div>
          </div>
        </div>
        {warnText && <WarnTip text={warnText} />}
        <FieldPermissionLock fieldId={field.id} />
      </div>
    </WrapperTooltip>
  );
};

const renderInlineNodeName = (datasheetId: string) => {
  const datasheet = Selectors.getDatasheet(store.getState(), datasheetId);
  return (
    <InlineNodeName
      nodeId={datasheetId}
      nodeName={datasheet?.name}
      nodeIcon={datasheet?.icon}
      prefix={t(Strings.association_table)}
      size={14}
      iconSize={16}
      withIcon
      withBrackets
    />
  );
};

export function FieldSearchPanel(props: IFieldSearchPanelProps) {
  const { fields, activeFieldId, onChange, setSearchPanelVisible, showType, errTip, field } = props;
  const [value, setValue] = useState('');
  const showFields = fields.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));

  const listContainerRef = useRef<any>(null);
  const handleFieldClick = (fieldId: string) => {
    onChange(fieldId);
    setSearchPanelVisible && setSearchPanelVisible(false);
  };

  const { index: currentIndex } = useSelectIndex({
    listLength: showFields.length,
    listContainerRef,
    activeItemClass: '.active',
    onEnter: (index) => {
      const field = showFields[index];
      field && handleFieldClick(field.id);
    },
  });

  return (
    <div className={styles.panel}>
      {/* <div className={styles.title}>
        {
          t(showType === ShowType.LinkField ?
            Strings.lookup_link
            : Strings.check_field)
        }
      </div> */}
      {/* {showType === ShowType.LinkField && (
        <div className={styles.subtitle}>
          {t(Strings.lookup_modal_subtitle)}
        </div>
      )} */}
      <div className={styles.searchInPut}>
        <LineSearchInput
          placeholder={t(Strings.search_field)}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        />
      </div>
      {errTip ? (
        <div className={styles.noLinkTableTips}>{errTip}</div>
      ) : (
        <div className={styles.optList} ref={listContainerRef}>
          {isEmpty(showFields) ? (
            <NoLookupField showType={showType} value={value} />
          ) : (
            showFields.map((sf, index) => {
              // Determining whether a circular reference will result
              // Simulation of the actual selected data structure to do the check
              let warnText;
              if (field && [FieldType.LookUp, FieldType.Formula].includes(sf.type)) {
                const newField = {
                  ...field,
                  property: {
                    ...field.property,
                    lookUpTargetFieldId: sf.id,
                  },
                };
                warnText = checkComputeRef(newField);
                if (typeof warnText != 'string') {
                  // Simulate the selection of actual data to check if the new field has problems
                  if (Field.bindModel(newField).hasError) {
                    warnText = t(Strings.field_configuration_err);
                  } else {
                    warnText = '';
                  }
                }
              }
              return (
                <FieldItem
                  key={index}
                  keyword={value}
                  index={index}
                  showType={showType}
                  handleFieldClick={handleFieldClick}
                  warnText={warnText}
                  field={sf}
                  activeFieldId={activeFieldId}
                  currentIndex={currentIndex}
                  renderInlineNodeName={renderInlineNodeName}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
