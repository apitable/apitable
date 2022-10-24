import { IField, Strings, t } from '@apitable/core';
import { Modal } from 'antd';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { store } from 'pc/store';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { FormulaModal } from './formula_modal';
import styles from './styles.module.less';

export function openFormulaModal(props: { field: IField; expression: string; datasheetId: string, onSave?: (exp: string) => void; onClose?: () => void }) {
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

  const Content: React.ReactElement = <FormulaModal
    field={field}
    expression={expression}
    onSave={onModalSave}
    onClose={onModalClose}
    datasheetId={datasheetId}
  />;

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
        <Popup visible onClose={onModalClose} height='90%' title={t(Strings.input_formula)}>
          {Content}
        </Popup>
      </ComponentDisplay>
    </Provider>,
  );
}
