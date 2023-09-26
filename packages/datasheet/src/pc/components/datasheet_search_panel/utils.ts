import { Strings, t } from '@apitable/core';
import { SecondConfirmType } from './interface';

export const getModalTitle = (secondConfirmType?: SecondConfirmType) => {
  switch (secondConfirmType) {
    case SecondConfirmType.Widget: {
      return t(Strings.select_widget_Import_widget);
    }
    case SecondConfirmType.Form: {
      return t(Strings.create_form_panel_title);
    }
    case SecondConfirmType.AIForm: {
      return t(Strings.select_form_panel_title);
    }
    default: {
      return t(Strings.check_link_table);
    }
  }
};
