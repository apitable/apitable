import { store } from 'pc/store';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { FieldPermissionPlus } from 'pc/components/field_permission/field_permission_plus';
import { IField } from '@apitable/core';

export const expandFieldPermission = (field: IField) => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const onModalClose = () => {
    ReactDOM.unmountComponentAtNode(container);
    container.parentElement!.removeChild(container);
  };

  ReactDOM.render((
    <Provider store={store}>
      <FieldPermissionPlus
        field={field}
        onModalClose={onModalClose}
      />
    </Provider>
  ),
  container,
  );
};
