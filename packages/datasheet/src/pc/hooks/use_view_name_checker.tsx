import { useState } from 'react';
import { IReduxState, Selectors, Strings, t } from '@apitable/core';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';

export const useViewNameChecker = () => {
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const datasheet = useAppSelector((state: IReduxState) => Selectors.getDatasheet(state));

  const viewList = datasheet?.snapshot.meta.views || [];

  const checkViewName = (newViewName: string) => {
    const isExitSameName = viewList.findIndex((item) => item.name === newViewName);

    if (isExitSameName !== -1) {
      setErrMsg(t(Strings.name_repeat));
      return false;
    }

    if (newViewName.length < 1 || newViewName.length > Number(getEnvVariables().VIEW_NAME_MAX_COUNT)) {
      setErrMsg(
        t(Strings.view_name_length_err, {
          maxCount: getEnvVariables().VIEW_NAME_MAX_COUNT,
        }),
      );
      return false;
    }

    setErrMsg(null);
    return true;
  };

  return {
    errMsg,
    checkViewName,
  };
};
