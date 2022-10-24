import { getCustomConfig, Strings, t } from '@apitable/core';
import { useRouter } from 'next/router';
import { isDingtalkSkuPage } from 'pc/components/home/social_platform';
import { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useQuery } from './';

const contacts = /(\/)?org(\/)?/; // 通讯录
const template = /(\/)?template(\/)?/; // 模板中心
const management = /(\/)?management(\/)?/; // 空间站管理

export async function getEmojiNativeByName(emojiName: string) {
  if (!emojiName) return '';
  const emojiIndex = await import('emoji-mart/dist/utils/emoji-index/emoji-index').then(module => module.default);
  const emojiData = emojiIndex.search(emojiName).find(o => o.native && o.short_names[0] === emojiName);
  if (!emojiData) return '';
  return emojiData.native;
}

function combineEmojiAndName(emojiNative: string, name: string) {
  return `${emojiNative} ${name}`;
}

export const useNavigatorName = () => {
  const { datasheetId, folderId, categoryId, formId, mirrorId, dashboardId } = useSelector(state => {
    const { datasheetId, folderId, categoryId, formId, mirrorId, dashboardId } = state.pageParams;
    return { datasheetId, folderId, categoryId, formId, mirrorId, dashboardId };
  }, shallowEqual);
  const treeNodesMap = useSelector(state => state.catalogTree.treeNodesMap)!;
  const router = useRouter();
  const nodeId = mirrorId || datasheetId || folderId || formId || dashboardId;
  const query = useQuery();
  const purchaseToken = query.get('purchaseToken') || '';
  const isSkuPage = isDingtalkSkuPage(purchaseToken);

  useEffect(() => {
    const pathname = router.asPath;
    const isMatchTemplate = template.test(pathname);
    const isMatchContacts = contacts.test(pathname);
    const isMatchManagement = management.test(pathname);

    function getCurrentGUIInfo() {
      const { pageTitle } = getCustomConfig();
      let name = pageTitle || t(Strings.vikadata);
      let nodeIcon = '';

      if (nodeId && treeNodesMap && treeNodesMap[nodeId!]) {
        name = treeNodesMap[nodeId!].nodeName;
        nodeIcon = treeNodesMap[nodeId!].icon || '';
      }

      if (categoryId || isMatchTemplate) {
        name = isSkuPage ? t(Strings.vikadata) : t(Strings.nav_templates);
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

    getEmojiNativeByName(nodeIcon).then(icon => {
      document.title = combineEmojiAndName(icon, name);
    });

  }, [treeNodesMap, nodeId, categoryId, router.asPath, isSkuPage, router.query]);
};
