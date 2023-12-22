import { getEnvVariables } from 'pc/utils/env';

export const judgeShowAIEntrance = () => {
  return getEnvVariables().AI_ENTRANCE_VISIBLE;
};

export const getAIOpenFormUrl = () => {
  return getEnvVariables().AI_OPEN_FORM;
};
