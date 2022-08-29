import { Settings } from '@vikadata/core';

export const buildSpaceCertSheetUrl = (spaceId: string) => {
  const formUrlTemplate = Settings.space_corp_cert_url.value;
  return formUrlTemplate.replace('{spaceId}', spaceId);
};
