/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import produce from 'immer';
import uniqBy from 'lodash/uniqBy';
import { Api, IUnitValue } from '@apitable/core';

/**
 * @description Request a section of members' information in advance when entering a space or sharing page to provide a good experience for users
 *  when clicking on a member cell
 * The cacheId used to mark the cache is divided into two types.
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
    if (this.isEmbedId(cacheId)) {
      const res = await Api.loadOrSearchEmbed(cacheId, {
        filterIds: '',
        keyword: '',
        linkId: cacheId,
      });

      const { data } = res.data;
      this.stashMap.set(cacheId, data);
    } else {
      const res = await Api.loadOrSearch({
        filterIds: '',
        keyword: '',
        linkId: this.isShareId(cacheId) ? cacheId : undefined,
      });

      const { data } = res.data;
      this.stashMap.set(cacheId, data);
    }
  }

  public updateStash(member: IUnitValue) {
    const oldList = this.stashMap.get(this.currentCacheId) || [];
    const newList = this.normalizeList(
      produce(oldList, (draft) => {
        draft.unshift(member);
        return draft;
      }),
    );
    this.stashMap.set(this.currentCacheId, newList);
  }

  public hasCacheId(spaceId: string) {
    return this.currentCacheId === spaceId;
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

  private isEmbedId(id: string) {
    const embedReg = /emb\w+/;
    return embedReg.test(id);
  }
}

export const memberStash = new MemberStash();
