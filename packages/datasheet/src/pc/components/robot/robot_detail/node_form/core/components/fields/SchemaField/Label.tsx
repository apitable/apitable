import { REQUIRED_FIELD_SYMBOL } from '../../../const';

interface ILabelProps {
  label: string;
  required: boolean;
  id: string;
}

export function Label(props: ILabelProps) {
  const { label, required, id } = props;
  if (!label) {
    return null;
  }
  return (
    <label className="control-label" htmlFor={id}>
      {required && <span className="required">{REQUIRED_FIELD_SYMBOL}</span>}
      {label}
    </label>
  );
}