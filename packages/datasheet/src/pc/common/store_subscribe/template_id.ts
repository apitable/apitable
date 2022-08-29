import { store } from 'pc/store';
import { resourceService } from 'pc/resource_service';

let lastTemplateId: string | undefined;

store.subscribe(function TemplateChange() {
  const previousTemplateId = lastTemplateId;
  const state = store.getState();
  const { templateId } = state.pageParams;
  lastTemplateId = templateId;
  if ((!lastTemplateId && !previousTemplateId) || previousTemplateId === lastTemplateId) {
    return;
  }

  console.log('init resourceService.instance!: ', templateId);

  resourceService.instance!.init();
});
