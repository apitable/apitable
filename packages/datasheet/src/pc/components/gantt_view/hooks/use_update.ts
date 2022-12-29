import { useState } from 'react';

export const useUpdate = () => {
  const [index, setIndex] = useState(0);

  const forceRender = () => {
    setIndex(index + 1);
  };

  return {
    index,
    forceRender,
  };
};