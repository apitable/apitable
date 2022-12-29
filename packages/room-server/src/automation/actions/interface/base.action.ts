import {IActionResponse} from "./action.response";
import {IJsonSchema} from "@apitable/core";

export type IUiSchema = {
  'ui:field'?: string;
  'ui:widget'?: string;
  'ui:options'?: { [key: string]: boolean | number | string | object | any[] | null };
  'ui:order'?: string[];
  'ui:FieldTemplate'?: object;
  'ui:ArrayFieldTemplate'?: object;
  'ui:ObjectFieldTemplate'?: object;
  [name: string]: any;
};

export interface IBaseAction {

  endpoint(input: any): Promise<IActionResponse<any>>;

  getInputSchema(): IJsonSchema;

  getUISchema(): IUiSchema;

  getOutputSchema(): IJsonSchema;
}