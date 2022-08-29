import { IFieldProps } from '../../../interface';
import { canExpand } from '../../../utils';
import AddButton from '../../common/AddButton';

export function DefaultObjectFieldTemplate(props: IFieldProps) {
  const { TitleField, DescriptionField } = props;
  return (
    <fieldset id={props.idSchema.$id}>
      {(props.uiSchema['ui:title'] || props.title) && (
        <TitleField
          id={`${props.idSchema.$id}__title`}
          title={props.title || props.uiSchema['ui:title']}
          required={props.required}
          formContext={props.formContext}
        />
      )}
      {props.description && (
        <DescriptionField
          id={`${props.idSchema.$id}__description`}
          description={props.description}
          formContext={props.formContext}
        />
      )}
      {props.properties.map((prop: any) => prop.content)}
      {canExpand(props.schema, props.uiSchema, props.formData) && (
        <AddButton
          className="object-property-expand"
          onClick={props.onAddClick(props.schema)}
          disabled={props.disabled || props.readonly}
        />
      )}
    </fieldset>
  );
}