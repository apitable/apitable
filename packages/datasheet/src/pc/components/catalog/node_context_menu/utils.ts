import { getEnvVariables } from 'pc/utils/env';

export const judgeShowAIEntrance = () => {
  return getEnvVariables().AI_ENTRANCE_VISIBLE;
};

export const getAIOpenFormUrl = () => {
  const env = getEnvVariables();
  // if (env.ENV === 'apitable-integration') {
  //   return 'https://integration.aitable.ai/share/shrs5C6Gw4shPl826fjeD/fomAEFm52XjVGctUx4';
  // }
  if (env.ENV === 'vika-integration') {
    return 'https://integration.vika.ltd/share/shrBUWrYskgQKxzGT4rtz/fom0zfvUnZkPwp9nrC';
  }
  return env.AI_OPEN_FORM;
};
