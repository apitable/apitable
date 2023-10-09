import { ThemeName } from '@apitable/core';
import { IActionType, ITriggerType } from './interface';

export const covertThemeIcon = (data: (ITriggerType | IActionType)[] | undefined, theme: ThemeName) => {
  return (
    (data?.map((item) => {
      return {
        ...item,
        service: {
          ...item.service,
          logo: (theme === ThemeName.Dark ? item.service.themeLogo?.dark : item.service.themeLogo?.light) || item.service.logo,
        },
      };
    }) as any) || []
  );
};
