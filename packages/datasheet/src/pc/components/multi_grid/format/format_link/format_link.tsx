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
import * as React from 'react';
import { Dispatch, memo, SetStateAction, useState } from 'react';
import { Typography, useThemeColors, Switch } from '@apitable/components';
import { FieldType, IField, ILinkField, IOneWayLinkField, NotSupportFieldInstance, Selectors, Strings, t } from '@apitable/core';
import { NodeIcon } from 'pc/components/catalog/tree/node_icon';
import { LinkJump } from 'pc/components/common';
import { SearchPanel } from 'pc/components/datasheet_search_panel';
import { useAppSelector } from 'pc/store/react-redux';
import IconArrow from 'static/icon/datasheet/datasheet_icon_calender_right.svg';
import settingStyles from '../../field_setting/styles.module.less';
import { ViewSelect } from './view_select';
import styles from './styles.module.less';

interface IFormateLinkProps {
  currentField: ILinkField | IOneWayLinkField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
  hideOperateBox: () => void;
  datasheetId?: string;
}

export const FormateLink: React.FC<React.PropsWithChildren<IFormateLinkProps>> = memo((props: IFormateLinkProps) => {
  const colors = useThemeColors();
  const { currentField, setCurrentField, hideOperateBox, datasheetId: propDatasheetId } = props;
  const isLinkType = currentField.type === FieldType.Link;
  const limitSingleRecord = currentField.property.limitSingleRecord;
  const limitToView = currentField.property.limitToView;
  const foreignDatasheetId = currentField.property.foreignDatasheetId;
  const [searchPanelVisible, setSearchPanelVisible] = useState(false);
  const activeDatasheetId = useAppSelector((state) => propDatasheetId || Selectors.getActiveDatasheetId(state))!;
  const foreignDatasheet = useAppSelector((state) => (foreignDatasheetId ? Selectors.getDatasheet(state, foreignDatasheetId) : null));
  const datasheetParentId = useAppSelector((state) => Selectors.getDatasheet(state, propDatasheetId)!.parentId);
  const _foreignFiledName = useAppSelector((state) =>
    isLinkType ? Selectors.getField(state, currentField.property.brotherFieldId!, foreignDatasheetId).name : '',
  );
  const foreignFiledName = _foreignFiledName === NotSupportFieldInstance.name ? '' : _foreignFiledName;
  const setLimitSingleRecord = (checked: boolean) => {
    setCurrentField({
      ...currentField,
      property: {
        ...currentField.property,
        limitSingleRecord: !checked,
      },
    });
  };

  const setLimitToView = (viewId?: string) => {
    setCurrentField({
      ...currentField,
      property: {
        ...currentField.property,
        limitToView: viewId,
      },
    });
  };

  const setForeignDatasheetId = (id: string) => {
    const property = !isLinkType ? {
      ...currentField.property,
      foreignDatasheetId: id,
    } : {
      ...currentField.property,
      foreignDatasheetId: id,
      brotherFieldId: activeDatasheetId === id ? undefined : (currentField as ILinkField).property.brotherFieldId
    };
    setCurrentField({
      ...currentField,
      property,
    });
  };

  const onChange = ({ datasheetId }: any) => {
    setForeignDatasheetId(datasheetId!);
    setSearchPanelVisible(false);
  };

  // const navigationTo = useNavigation();

  const onDatasheetClick = () => {
    // if (foreignDatasheetId) {
    //   e.stopPropagation();
    // }
    // foreignDatasheetId && navigationTo(Navigation.WORKBENCH, { dstId: foreignDatasheetId }, Method.newTab);
  };

  return (
    <>
      <section className={settingStyles.section}>
        <div className={settingStyles.sectionTitle}>{t(Strings.linked_datasheet)}</div>
        <div className={classNames(settingStyles.sectionInfo, styles.foreignInfoBox)} onClick={() => setSearchPanelVisible(true)}>
          <div className={classNames(settingStyles.text, styles.text, { [styles.active]: Boolean(foreignDatasheetId) })}>
            <div className={styles.foreignInfoWrapper}>
              <div className={styles.nameWrapper}>
                <Typography
                  ellipsis={{
                    tooltip: (foreignDatasheet && foreignDatasheet.name) || t(Strings.choose_datasheet_to_link),
                  }}
                  variant="body2"
                  onClick={onDatasheetClick}
                  className={styles.linkTitle}
                >
                  <NodeIcon nodeId="foreignDatasheetIcon" icon={foreignDatasheet?.icon} editable={false} size={16} />
                  {(foreignDatasheet && foreignDatasheet.name) || t(Strings.choose_datasheet_to_link)}
                </Typography>
                {foreignDatasheet && (
                  <LinkJump
                    foreignDatasheetId={foreignDatasheet.id}
                    foreignFieldId={isLinkType ? currentField.property?.brotherFieldId : undefined}
                    viewId={currentField.property.limitToView}
                    iconColor={colors.thirdLevelText}
                    hideOperateBox={hideOperateBox}
                  />
                )}
              </div>
              {foreignFiledName && (
                <div className={styles.foreignFieldNameWrapper}>
                  {t(Strings.foreign_filed)}「
                  <Typography variant="body4" color={colors.fc3} className={styles.foreignField} ellipsis>
                    {foreignFiledName}
                  </Typography>
                  」
                </div>
              )}
            </div>
          </div>
          <div className={settingStyles.arrow}>
            <IconArrow width={10} height={10} fill={colors.thirdLevelText} />
          </div>
          {searchPanelVisible ? (
            <SearchPanel
              folderId={foreignDatasheet ? foreignDatasheet.parentId : datasheetParentId}
              activeDatasheetId={''}
              setSearchPanelVisible={setSearchPanelVisible}
              onChange={onChange}
              noCheckPermission={currentField?.type === FieldType.OneWayLink}
            />
          ) : null}
        </div>
      </section>
      {foreignDatasheet ? (
        <section className={settingStyles.section}>
          <div className={classNames(settingStyles.sectionTitle, settingStyles.sub)}>
            {t(Strings.link_to_multi_records)}
            <Switch size="small" checked={!limitSingleRecord} onChange={setLimitSingleRecord} />
          </div>
        </section>
      ) : null}
      {foreignDatasheet ? (
        <ViewSelect
          views={foreignDatasheet.snapshot.meta.views}
          viewId={limitToView}
          onChange={setLimitToView}
          foreignDatasheetReadable={foreignDatasheet.permissions.readable}
        />
      ) : null}
    </>
  );
});
