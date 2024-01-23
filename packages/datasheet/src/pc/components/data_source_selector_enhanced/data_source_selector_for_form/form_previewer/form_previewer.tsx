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

import { useMount } from 'ahooks';
import classnames from 'classnames';
import Image from 'next/image';
import * as React from 'react';
import { useMemo } from 'react';
import { Button, ThemeName } from '@apitable/components';
import { Events, Field, FieldType, IMeta, Player, Selectors, Strings, t, ViewType } from '@apitable/core';
import { ScreenSize } from 'pc/components/common/component_display';
import { FormFieldContainer } from 'pc/components/form_container/form_field_container';
import { useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import NotDataImgDark from 'static/icon/datasheet/empty_state_dark.png';
import NotDataImgLight from 'static/icon/datasheet/empty_state_light.png';
import styles from './style.module.less';

interface IFormPreviewerProps {
  datasheetId: string | undefined;
  viewId: string | undefined;
  meta: IMeta | undefined;
  onChange: (result: { datasheetId?: string; viewId?: string; widgetId?: string; viewName?: string }) => void;
}

export const FormPreviewer: React.FC<React.PropsWithChildren<IFormPreviewerProps>> = (props) => {
  const { datasheetId, viewId, meta, onChange } = props;
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const currentView = meta?.views.filter((view) => view.id === viewId)[0];
  const fieldPermissionMap = useAppSelector(Selectors.getFieldPermissionMapFromForm);

  const fieldMap = meta?.fieldMap || {};

  const filteredColumns = useMemo(() => {
    return currentView?.columns.filter((column) => {
      const { fieldId, hidden } = column;
      const field = fieldMap[fieldId];
      if (field == null) {
        return false;
      }
      const formSheetAccessible = Selectors.getFormSheetAccessibleByFieldId(fieldPermissionMap, fieldId);

      return !hidden && formSheetAccessible && !Field.bindModel(field).isComputed && field.type !== FieldType.AutoNumber;
    });
  }, [currentView?.columns, fieldMap, fieldPermissionMap]);

  const themeName = useAppSelector((state) => state.theme);
  const templateEmptyPng = themeName === ThemeName.Light ? NotDataImgLight : NotDataImgDark;

  const canCreate = useMemo(() => {
    if (!currentView) {
      return false;
    }
    return currentView.type === ViewType.Grid;
  }, [currentView]);

  const onFormCreate = () => {
    const viewName = currentView?.name ? `${currentView.name}${t(Strings.key_of_adjective)}${t(Strings.view_form)}` : undefined;
    onChange({ datasheetId, viewId, viewName });
  };
  useMount(() => {
    Player.doTrigger(Events.workbench_create_form_previewer_shown);
  });

  return (
    <div
      className={classnames(styles.formPreviewer, {
        [styles.formPreviewerMobile]: isMobile,
      })}
    >
      <div className={styles.scrollContainer}>
        {canCreate ? (
          <>
            <h3 className={styles.panelTitleDesc}>{t(Strings.preview_form_title_desc)}：</h3>
            <h3 className={styles.panelTitle}>{t(Strings.preview_form_title)}</h3>
            <div className={styles.panelContent}>
              <FormFieldContainer
                filteredColumns={filteredColumns!}
                datasheetId={datasheetId!}
                viewId={viewId!}
                meta={meta!}
                fieldUI={({ title, index, children, required }: any) => (
                  <div className={styles.formField}>
                    <h4 className={styles.title} data-required={required}>
                      <span className={styles.indexClass}>{index}</span>.{title}
                    </h4>
                    {children}
                  </div>
                )}
                editable={false}
                recordId=""
              />
            </div>
          </>
        ) : (
          <div className={styles.emptyTipWrap}>
            <Image src={templateEmptyPng} alt="" className={styles.img} />
            <div className={styles.emptyTip}>{t(Strings.no_view_create_form)}</div>
          </div>
        )}
      </div>
      <div className={styles.panelFooter}>
        <Button color="primary" block disabled={!canCreate} onClick={onFormCreate}>
          {t(Strings.create_form)}
        </Button>
      </div>
    </div>
  );
};
