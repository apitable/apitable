import { IReduxState, Selectors, Strings, t } from '@apitable/core';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export const useViewNameChecker = () => {
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const datasheet = useSelector((state: IReduxState) => Selectors.getDatasheet(state));

  const viewList = datasheet?.snapshot.meta.views || [];

  const checkViewName = (newViewName: string) => {
    const isExitSameName = viewList.findIndex(
      item => item.name === newViewName
    );

    if (isExitSameName !== -1) {
      setErrMsg(t(Strings.name_repeat));
      return false;
    }

    if (newViewName.length < 1 || newViewName.length > 30) {
      setErrMsg(t(Strings.view_name_length_err));
      return false;
    }

    setErrMsg(null);
    return true;
  };

  return {
    errMsg,
    checkViewName
  };
};
