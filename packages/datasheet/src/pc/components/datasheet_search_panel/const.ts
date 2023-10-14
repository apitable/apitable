import { Strings, t } from '@apitable/core';

export const DISABLE_TIP = {
  permission: {
    budget: t(Strings.permission_no_permission_access),
    message: t(Strings.message_can_not_associated_because_of_no_editable),
  },
  manageablePermission: {
    budget: t(Strings.permission_no_manageable_permission_access),
    message: t(Strings.message_can_not_associated_because_of_no_manageable),
  },
  fieldLimit: {
    budget: t(Strings.permission_fields_count_up_to_bound),
    message: t(Strings.message_fields_count_up_to_bound),
  },
};
