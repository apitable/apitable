import { getEnvVariables } from 'pc/utils/env';

export const buildSpaceCertSheetUrl = (spaceId: string) => {
  const formUrlTemplate = getEnvVariables().SPACE_ENTERPRISE_CERTIFICATION_FORM_URL!;
  return formUrlTemplate.replace('{spaceId}', spaceId);
};
