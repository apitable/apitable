interface ILabelInputProps {
  label: string;
  id: string;
  onChange: (value: string) => void;
  required?: boolean;
}
export function LabelInput(props: ILabelInputProps) {
  const { id, label, onChange } = props;
  return (
    <input
      className="form-control"
      type="text"
      id={id}
      onBlur={event => onChange(event.target.value)}
      defaultValue={label}
    />
  );
}