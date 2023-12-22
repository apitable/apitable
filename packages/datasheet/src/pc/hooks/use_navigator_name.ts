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

import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { shallowEqual } from 'react-redux';
import { getCustomConfig, Strings, t } from '@apitable/core';
import { useAppSelector } from 'pc/store/react-redux';
// @ts-ignore
import { isDingtalkSkuPage } from 'enterprise/home/social_platform/utils';
import { useQuery } from './';

const contacts = /(\/)?org(\/)?/; // Directory
const template = /(\/)?template(\/)?/; // Template Centre
const management = /(\/)?management(\/)?/; // Space Station Management

export async function getEmojiNativeByName(emojiName: string) {
  if (!emojiName) return '';
  // @ts-ignore
  const emojiIndex = await import('emoji-mart/dist/utils/emoji-index/emoji-index').then((module) => module.default);
  const emojiData = emojiIndex.search(emojiName).find((o: any) => o.native && o.short_names[0] === emojiName);
  if (!emojiData) return '';
  return emojiData.native;
}

function combineEmojiAndName(emojiNative: string, name: string) {
  return `${emojiNative} ${name}`;
}

export const useNavigatorName = () => {
  const { datasheetId, folderId, categoryId, formId, mirrorId, dashboardId } = useAppSelector((state) => {
    const { datasheetId, folderId, categoryId, formId, mirrorId, dashboardId } = state.pageParams;
    return { datasheetId, folderId, categoryId, formId, mirrorId, dashboardId };
  }, shallowEqual);
  const treeNodesMap = useAppSelector((state) => state.catalogTree.treeNodesMap)!;
  const router = useRouter();
  const nodeId = mirrorId || datasheetId || folderId || formId || dashboardId;
  const query = useQuery();
  const purchaseToken = query.get('purchaseToken') || '';
  const isSkuPage = isDingtalkSkuPage?.(purchaseToken);

  useEffect(() => {
    const pathname = router.asPath;
    const isMatchTemplate = template.test(pathname);
    const isMatchContacts = contacts.test(pathname);
    const isMatchManagement = management.test(pathname);

    function getCurrentGUIInfo() {
      const { pageTitle } = getCustomConfig();
      let name = pageTitle || t(Strings.og_page_title);
      let nodeIcon = '';

      if (nodeId && treeNodesMap && treeNodesMap[nodeId!]) {
        name = treeNodesMap[nodeId!].nodeName;
        nodeIcon = treeNodesMap[nodeId!].icon || '';
      }

      if (categoryId || isMatchTemplate) {
        name = isSkuPage ? t(Strings.system_configuration_product_name) : t(Strings.nav_templates);
      }

      if (isMatchContacts) {
        name = t(Strings.contacts);
      }

      if (isMatchManagement) {
        name = t(Strings.nav_space_settings);
      }

      return { name, nodeIcon };
    }

    const { name, nodeIcon } = getCurrentGUIInfo();

    getEmojiNativeByName(nodeIcon).then((icon) => {
      document.title = combineEmojiAndName(icon, name);
    });
  }, [treeNodesMap, nodeId, categoryId, router.asPath, isSkuPage, router.query]);
};
