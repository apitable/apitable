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

import { Modal } from 'antd';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { IField, Strings, t } from '@apitable/core';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { store } from 'pc/store';
import { FormulaModal } from './formula_modal';
import styles from './styles.module.less';

export function openFormulaModal(props: {
  field: IField;
  expression: string;
  datasheetId: string;
  onSave?: (exp: string) => void;
  onClose?: () => void;
}) {
  const { field, expression, onSave, onClose, datasheetId } = props;

  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  const removeNode = () => {
    root.unmount();
    container.parentElement!.removeChild(container);
  };

  const onModalClose = () => {
    removeNode();
    onClose && onClose();
  };

  const onModalSave = (v: string) => {
    removeNode();
    onSave && onSave(v);
  };

  const Content: React.ReactElement = (
    <FormulaModal field={field} expression={expression} onSave={onModalSave} onClose={onModalClose} datasheetId={datasheetId} />
  );

  root.render(
    <Provider store={store}>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <Modal
          className={styles.formulaModalWrapper}
          visible
          onCancel={onModalClose}
          closable={false}
          mask={false}
          destroyOnClose
          footer={null}
          width={540}
          centered
        >
          {Content}
        </Modal>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Popup open onClose={onModalClose} height="90%" title={t(Strings.input_formula)}>
          {Content}
        </Popup>
      </ComponentDisplay>
    </Provider>,
  );
}
