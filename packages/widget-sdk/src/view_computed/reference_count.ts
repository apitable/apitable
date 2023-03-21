import { eventMessage, widgetMessage } from 'message';
import { isSandbox } from 'utils/private';

/**
 * Maintaining the reference count of the view cache.
 */
class ReferenceCount {
  private referenceCountMap = new Map<string, {[key: string]: number}>();

  constructor() {}

  /**
   * Get all subscription views.
   */
  private getSubscribeMap() {
    const res: { datasheetId: string, viewId: string }[] = [];
    this.referenceCountMap.forEach((v, k) => {
      res.push(...Object.keys(v).map(viewId => ({ datasheetId: k, viewId })));
    });
    return res;
  }

  add(datasheetId: string, viewId: string, widgetId: string) {
    const datasheetCount = this.referenceCountMap.get(datasheetId);
    const viewCount = datasheetCount?.[viewId] || 0;
    if (!datasheetCount) {
      this.referenceCountMap.set(datasheetId, { [viewId]: 1 });
      this.notify(widgetId);
      return;
    }
    this.referenceCountMap.set(datasheetId, { ...datasheetCount, [viewId]: viewCount + 1 });
    this.notify(widgetId);
  }

  remove(datasheetId: string, viewId: string, widgetId: string) {
    const datasheetCount = this.referenceCountMap.get(datasheetId);
    const viewCount = datasheetCount?.[viewId];
    if (!datasheetCount || !viewCount) {
      return;
    }
    this.referenceCountMap.set(datasheetId, { ...datasheetCount, [viewId]: viewCount - 1 });
    this.maintainCount(datasheetId);
    this.notify(widgetId);
  }

  /**
   * Maintenance count.
   * 1. Clear out the key with count 0.
   * 2. Clear the key of an object whose referenceCount is empty.
   */
  maintainCount(datasheetId: string) {
    const referenceCount = this.referenceCountMap.get(datasheetId);
    if (!referenceCount) {
      return;
    }
    Object.keys(referenceCount).forEach(viewId => {
      if (referenceCount.hasOwnProperty(viewId) && referenceCount[viewId]! < 1) {
        delete referenceCount[viewId];
      }
    });
    if (Object.keys(referenceCount).length === 0) {
      this.referenceCountMap.delete(datasheetId);
      return;
    }
    this.referenceCountMap.set(datasheetId, referenceCount);
  }

  clear(widgetId: string) {
    this.referenceCountMap.clear();
    this.notify(widgetId);
  }

  /**
   * Notify the main thread of a change in subscription count.
   */
  notify(widgetId: string) {
    isSandbox() ?
      widgetMessage.syncWidgetSubscribeView(this.getSubscribeMap()) :
      eventMessage.syncWidgetSubscribeView(this.getSubscribeMap(), widgetId);
  }
}

export const widgetReferenceCount = new ReferenceCount();