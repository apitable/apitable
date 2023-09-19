import constate from 'constate';
import { useState } from 'react';

const useFormState = () => {
  const [isModified, setIsModified] = useState(false);
  const [hasError, setHasError] = useState(false);
  return {
    setHasError,
    hasError,
    isModified,
    setIsModified,
  };
};

const [FormEditProvider, useFormEdit] = constate(useFormState);
export { FormEditProvider, useFormEdit };
