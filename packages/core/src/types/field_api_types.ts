import { IAPIMetaFieldProperty } from 'types/field_api_property_types';
import { APIMetaFieldType } from './field_api_enums';

/**
  * Field related
  */
export interface IAPIMetaField {
   id: string;
   name: string;
   type: APIMetaFieldType;
   isPrimary?: boolean;
   desc?: string;
   property?: IAPIMetaFieldProperty;
   /**
    * manage > edit > read
    * manage management fields
    * edit write cell
    * read read cell
    */
   // The permission level is not exposed for the time being, and it will be considered when the meta is writable in the future.
   // permissionLevel: APIMetaFieldPermissionLevel;
   // Whether the cell can be edited
   editable: boolean;
}