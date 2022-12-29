import { useEffect } from 'react';
import { IFieldProps } from '../../interface';

const NullField = (props: IFieldProps) => {
  const { formData, onChange } = props;
  useEffect(() => {
    formData == null && onChange?.(null);
  }, [formData, onChange]);
  return null;
};

export default NullField;
