import { Record } from 'model/record';
import { FieldType, IWidgetContext } from 'interface';
import { getFieldTypeString, IAttachmentValue, IReduxState, Selectors } from '@apitable/core';

/**
 * @hidden
 */
export class DynamicRecord extends Record {
  constructor(datasheetId: string, wCtx: IWidgetContext, recordId: string, private getSignatureUrl: (token: string) => string) {
    super(datasheetId, wCtx, recordId);
  }

  override _getCellValue(fieldId: string): any {
    const state = this.wCtx.widgetStore.getState();
    const globalState = state as any as IReduxState;

    const field = Selectors.getField(globalState, fieldId, this.datasheetId)!;
    const cellValue = super._getCellValue(fieldId);

    if (cellValue !=null && (getFieldTypeString(field.type) as any as FieldType) === FieldType.Attachment) {
      return cellValue.map((value: IAttachmentValue) => {
        return {
          ...value,
          token: this.getSignatureUrl(value.token),
        };
      });
    }
    return cellValue;
  }
}
