import { getEnvVariables, getReleaseVersion } from 'pc/utils/env';

export const judgeShowAIEntrance = () => {
  const version = getReleaseVersion();
  console.log(getEnvVariables().AI_ENTRANCE_VISIBLE, version);
  return getEnvVariables().AI_ENTRANCE_VISIBLE && (version === 'undefined' || version.includes('alpha'));
};
