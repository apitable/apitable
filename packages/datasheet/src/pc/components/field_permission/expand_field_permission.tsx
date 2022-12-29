import { IField } from '@apitable/core';
import { FieldPermissionPlus } from 'pc/components/field_permission/field_permission_plus';
import { store } from 'pc/store';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

export const expandFieldPermission = (field: IField) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const onModalClose = () => {
    root.unmount();
    container.parentElement!.removeChild(container);
  };

  root.render((
    <Provider store={store}>
      <FieldPermissionPlus
        field={field}
        onModalClose={onModalClose}
      />
    </Provider>
  ));
};
