
import { subscribeWidgetMap } from '@apitable/widget-sdk';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';

subscribeWidgetMap(store, resourceService as any);
