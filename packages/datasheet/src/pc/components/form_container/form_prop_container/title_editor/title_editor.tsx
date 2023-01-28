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

import { useState } from 'react';
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { t, Strings, Selectors, FormApi, IFormProps, StoreActions } from '@apitable/core';
import styles from './style.module.less';
import classnames from 'classnames';
import { Message } from 'pc/components/common';
import { IModeEnum, IBasePropEditorProps } from '../interface';
import { useEffect } from 'react';
import { useResponsive, useCatalogTreeRequest } from 'pc/hooks';
import { useRequest } from 'pc/hooks';
import { ScreenSize } from 'pc/components/common/component_display';

export const TitleEditor: React.FC<IBasePropEditorProps> = props => {
  const { mode, formId } = props;
  const title = useSelector(state => Selectors.getForm(state)!.name);
  const [value, setValue] = useState<string>(title || '');
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { renameNodeReq } = useCatalogTreeRequest();
  const { run: renameNode } = useRequest(renameNodeReq, { manual: true });

  const dispatch = useDispatch();

  const updateTitle = (partProps: Partial<IFormProps>) => {
    FormApi.updateFormProps(formId, partProps).then(res => {
      const { success } = res.data;
      if (success) {
        dispatch(StoreActions.updateFormProps(formId, partProps));
      } else {
        Message.error({ content: t(Strings.share_settings_tip, { status: t(Strings.fail) }) });
      }
    });
  };

  const onBlur = () => {
    if (value === title) {
      return;
    }
    renameNode(formId, value);
    updateTitle({ title: value });
  };

  useEffect(() => {
    if (value !== title) {
      setValue(title);
    }
    // eslint-disable-next-line
  }, [title, setValue]);

  return (
    <div
      className={classnames(styles.titleEditor, {
        [styles.titleEditorMobile]: isMobile,
      })}
    >
      {mode === IModeEnum.Edit ? (
        <input
          className={styles.titleInput}
          value={value}
          placeholder={t(Strings.form_title_placeholder)}
          onChange={e => setValue(e.target.value)}
          onBlur={onBlur}
        />
      ) : (
        title
      )}
    </div>
  );
};
