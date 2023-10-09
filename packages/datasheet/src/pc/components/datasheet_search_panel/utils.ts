import { Strings, t } from '@apitable/core';
import { ISearchShowOption } from './datasheet_search_panel';
import { SecondConfirmType } from './interface';

export const getPlaceholder = (options?: ISearchShowOption) => {
  if (options?.showForm) {
    return t(Strings.search_folder_or_form);
  }
  return t(Strings.search_folder_or_sheet);
};

export const getModalTitle = (secondConfirmType?: SecondConfirmType, options?: ISearchShowOption) => {
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
      if (options?.showDatasheet) {
        return t(Strings.check_link_table);
      }
      if (options?.showForm) {
        return t(Strings.check_link_form);
      }
      return t(Strings.check_link_table);
    }
  }
};
