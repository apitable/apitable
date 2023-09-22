import { IAttachmentValue } from '@apitable/core';
import { useReducer } from 'react';
import { assertSignatureManager } from '../assert_signature_manager';

type IArg = string | IAttachmentValue[] | IAttachmentValue | null;

export const useGetSignatureAssertByToken = <T extends IArg = IArg>(arg1: T): T => {
  const [, forceUpdate] = useReducer((x) => {
    return x + 1;
  }, 0);

  if (arg1 === null) {
    return arg1;
  }

  const createSubscribe = (url: string | undefined) => {
    if (url) {
      return url;
    }

    assertSignatureManager.subscribe(forceUpdate);
    return;
  };

  if (typeof arg1 === 'string') {
    return (createSubscribe(assertSignatureManager.getAssertSignatureUrl(arg1)) || '') as T;
  }

  const getUrlFields = (file: IAttachmentValue) => {
    const token = createSubscribe(assertSignatureManager.getAssertSignatureUrl(file.token)) || '';
    const preview = file.preview ? createSubscribe(assertSignatureManager.getAssertSignatureUrl(file.preview)) : '';
    return {
      token,
      preview,
    };
  };

  if (Array.isArray(arg1)) {
    const values = [] as any;
    for (const v of arg1) {
      const { token, preview } = getUrlFields(v);
      if (token) {
        values.push({ ...v, token, preview });
      }
    }

    return values as T;
  }

  return {
    ...(arg1 as IAttachmentValue),
    ...getUrlFields(arg1),
  } as T;
};
