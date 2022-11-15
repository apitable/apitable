import { Settings } from '@apitable/core';

export const buildSpaceCertSheetUrl = (spaceId: string) => {
  const formUrlTemplate = Settings.space_enterprise_certification_form.value;
  return formUrlTemplate.replace('{spaceId}', spaceId);
};
