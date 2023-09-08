import { useMemo, useReducer, useRef } from 'react';
import { IAttachmentValue } from '@apitable/core';
import { debounce } from 'lodash';
import { useGetSignatureAssertByToken } from 'helper/assert_signature_manager/hooks/use_get_signature_assert_by_token';
import { assertSignatureManager } from 'helper/assert_signature_manager/assert_signature_manager';

export const useGetSignatureAssertFunc = () => {
  const assertCollection = useRef<string[]>([]).current;
  const [, forceUpdate] = useReducer((x) => {
    return x + 1;
  }, 0);

  useGetSignatureAssertByToken(assertCollection.map((item) => ({ file: item })) as unknown as IAttachmentValue[]);

  const _forceUpdate = useMemo(() => {
    return debounce(forceUpdate, 1000);
  }, []);

  return (url: string) => {
    const _url = assertSignatureManager.getAssertSignatureUrl(url);

    if (_url) {
      return _url;
    }

    assertCollection.push(url);
    _forceUpdate();

    return '';
  };
};
