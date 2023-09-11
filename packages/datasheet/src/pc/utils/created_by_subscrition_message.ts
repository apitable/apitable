import { Message } from '@apitable/components';
import { FieldType, Strings, t, IFieldMap } from '@apitable/core';

export const createdBySubscritionMessage = (fieldMap: IFieldMap) => {
  const createdByFieldWithSubscription = Object.values(fieldMap).some((field) => field.type === FieldType.CreatedBy && field.property.subscription);
  if (createdByFieldWithSubscription) {
    Message.default({
      content: t(Strings.add_row_created_by_tip),
    });
  }
};
