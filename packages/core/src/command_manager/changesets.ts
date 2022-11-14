import { IResourceOpsCollect } from 'command_manager';
import { ILocalChangeset } from 'engine';
import { IReduxState, Selectors } from 'exports/store';
import { generateRandomString } from 'utils';

export function resourceOpsToChangesets(resourceOpsCollects: IResourceOpsCollect[], state: IReduxState): ILocalChangeset[] {
  const changesets: ILocalChangeset[] = [];
  resourceOpsCollects.forEach(collect => {
    const { resourceId, resourceType, operations } = collect;
    // One datasheet, one changeset
    const existChangeSet = changesets.find(cs => cs.resourceId === resourceId);
    const datasheet = Selectors.getDatasheet(state, resourceId);
    if (existChangeSet) {
      existChangeSet.operations.push(...operations);
    } else {
      changesets.push({
        baseRevision: datasheet!.revision,
        messageId: generateRandomString(),
        resourceId,
        resourceType,
        operations,
      });
    }
  });
  return changesets;
}
