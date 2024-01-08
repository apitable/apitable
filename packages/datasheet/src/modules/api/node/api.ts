import { javaApi } from 'api/java_api';
import urlcat from 'urlcat';
import { GET_NODE_DESCRIPTION } from './const';

export const getNodeDescription = (nodeId) => {
  return javaApi.get(
    urlcat(GET_NODE_DESCRIPTION, {
      nodeId,
    }),
  );
};
