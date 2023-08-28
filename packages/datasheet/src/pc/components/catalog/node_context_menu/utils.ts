import { getEnvVariables, getReleaseVersion } from 'pc/utils/env';

export const judgeShowAIEntrance = (enable?: boolean) => {
  const version = getReleaseVersion();
  return getEnvVariables().AI_ENTRANCE_VISIBLE && (enable || version === 'development');
};
