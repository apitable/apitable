import env from 'app.environment';

export const getRecordUrl = (dstId: string, recordId: string) => {
  return `${env.serviceDomain}/workbench/${dstId}/${recordId}`;
};
