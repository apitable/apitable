import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from 'pc/store';
import { KeyCode } from 'pc/utils';
import { IRecordPickerProps, RecordPicker } from './record_picker';

const EXPAND_RECORD_PICKER = 'EXPAND_RECORD_PICKER';

export const expandRecordPicker = (props: IRecordPickerProps) => {
  const { datasheetId, isSingle, onClose: _onClose, onSave } = props;

  const focusHolderRef = React.createRef<HTMLInputElement>();
  const container = document.createElement('div');
  container.classList.add(EXPAND_RECORD_PICKER);
  document.body.appendChild(container);
  const root = createRoot(container);

  const onClose = () => {
    root.unmount();
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
    _onClose?.();
  };

  const monitorBodyFocus = (e: KeyboardEvent) => {
    if (!focusHolderRef.current) {
      return;
    }
    if (document.activeElement !== document.body) {
      return;
    }
    if (e.keyCode !== KeyCode.Esc) {
      return;
    }
    onClose();
  };

  document.body.onkeydown = monitorBodyFocus;

  const pickerProps = {
    datasheetId,
    isSingle,
    onClose,
    onSave,
  };

  root.render(
    <Provider store={store}>
      <RecordPicker {...pickerProps}>
        <div
          ref={focusHolderRef}
          tabIndex={-1}
          onFocus={() => {
            document.body.onkeydown = monitorBodyFocus;
          }}
        />
      </RecordPicker>
    </Provider>,
  );
};
