import { Message } from '@apitable/components';
import { ResourceType, Selectors, ViewPropertyFilter } from '@apitable/core';
import { store } from 'pc/store';
import { resourceService } from '../../../../resource_service';

export const requestServerView = async (datasheetId: string, viewId: string, shareId?: string) => {
  const { success, data, message } = await ViewPropertyFilter.requestViewData(datasheetId!, viewId, shareId);
  const state = store.getState();
  if (success) {
    const revision = Selectors.getResourceRevision(state, datasheetId, ResourceType.Datasheet);

    if (data['revision'] < revision!) {
      // The database version is smaller than the local version,
      // probably because the op is being processed at the same time as the request, so a new request is sent
      return await ViewPropertyFilter.requestViewData(datasheetId!, viewId, shareId);
    }

    if (data['revision'] > revision!) {
      // If the local version is smaller than the database version, you should make up the version number before replacing the data
      const engine = resourceService.instance?.getCollaEngine(datasheetId);
      await engine?.checkMissChanges(data['revision']);
      return await ViewPropertyFilter.requestViewData(datasheetId!, viewId, shareId);
    }

    return data['view'];
  }
  Message.error({ content: message });
};
