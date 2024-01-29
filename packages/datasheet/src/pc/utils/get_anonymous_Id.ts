import { generateRandomNumber, IDPrefix } from '@apitable/core';

const ANONYMOUS_ID = 'ANONYMOUS_ID';

export const getAnonymousId = (prefix?: IDPrefix) => {
  const anonymousId = localStorage.getItem(ANONYMOUS_ID);
  if (!anonymousId) {
    const id = `${prefix || ''}${generateRandomNumber(6)}`;
    localStorage.setItem(ANONYMOUS_ID, id);
    return id;
  }
  return anonymousId;
};