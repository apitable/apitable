import { Api, IUnitValue } from '@apitable/core';
import produce from 'immer';
import uniqBy from 'lodash/uniqBy';

/**
 * @description 在进入空间或者分享页面，提前请求一部分成员的信息，方便用户在点击成员单元格时能提供良好的体验
 * 用于标记缓存的 cacheId 分为两种：
 * 1. spaceId
 * 2. shareId
 * @class MemberStash
 */
class MemberStash {
  private stashMap: Map<string, IUnitValue[]> = new Map();
  private currentCacheId = '';
  private maxListLen = 10;

  public async loadMemberList(cacheId: string) {
    this.switchCacheId(cacheId);

    if (this.stashMap.has(cacheId)) {
      return;
    }

    const res = await Api.loadOrSearch(
      {
        filterIds: '',
        keyword: '',
        linkId: this.isShareId(cacheId) ? cacheId : undefined,
      }
    );

    const { data } = res.data;
    this.stashMap.set(cacheId, data);
  }

  public updateStash(member: IUnitValue) {
    const oldList = this.stashMap.get(this.currentCacheId) || [];
    const newList = this.normalizeList(produce(oldList, draft => {
      draft.unshift(member);
      return draft;
    }));
    this.stashMap.set(this.currentCacheId, newList);
  }

  private normalizeList(list: IUnitValue[]) {
    const newList = uniqBy(list, 'unitId');
    return newList.splice(0, this.maxListLen);
  }

  public getMemberStash() {
    return this.stashMap.get(this.currentCacheId) || [];
  }

  private switchCacheId(cacheId: string) {
    this.currentCacheId = cacheId;
  }

  private isShareId(id: string) {
    const shareIdReg = /shr\w+/;
    return shareIdReg.test(id);
  }
}

export const memberStash = new MemberStash();
