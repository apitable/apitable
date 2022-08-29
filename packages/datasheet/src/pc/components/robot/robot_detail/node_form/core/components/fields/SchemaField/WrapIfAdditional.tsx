import { ADDITIONAL_PROPERTY_FLAG } from '../../../const';
import { Label } from './Label';
import { LabelInput } from './LabelInput';
import IconButton from '../../common/IconButton';

export function WrapIfAdditional(props: any) {
  const {
    id,
    classNames,
    disabled,
    label,
    onKeyChange,
    onDropPropertyClick,
    readonly,
    required,
    schema,
  } = props;
  const keyLabel = `${label} Key`; // i18n ?
  const additional = schema.hasOwnProperty(ADDITIONAL_PROPERTY_FLAG);

  if (!additional) {
    return <div className={classNames}>{props.children}</div>;
  }

  return (
    <div className={classNames}>
      <div className="row">
        <div className="col-xs-5 form-additional">
          <div className="form-group">
            <Label label={keyLabel} required={required} id={`${id}-key`} />
            <LabelInput
              label={label}
              required={required}
              id={`${id}-key`}
              onChange={onKeyChange}
            />
          </div>
        </div>
        <div className="form-additional form-group col-xs-5">
          {props.children}
        </div>
        <div className="col-xs-2">
          <IconButton
            type="danger"
            icon="remove"
            className="array-item-remove btn-block"
            tabIndex="-1"
            style={{ border: '0' }}
            disabled={disabled || readonly}
            onClick={onDropPropertyClick(label)}
          />
        </div>
      </div>
    </div>
  );
}