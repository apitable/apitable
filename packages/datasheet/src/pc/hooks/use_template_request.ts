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

import Router from 'next/router';
import { useDispatch } from 'react-redux';
import { Api, StatusCode, StoreActions, Strings, t } from '@apitable/core';
import { Message } from 'pc/components/common/message/message';

export const useTemplateRequest = () => {
  const dispatch = useDispatch();

  /**
   * Create a template
   * @param nodeId
   * @param name
   * @param data
   */
  function createTemplateReq(nodeId: string, name: string, data?: boolean) {
    return Api.createTemplate(nodeId, name, data).then((res) => {
      const { success, message, data, code } = res.data;
      return { success, message, data, code };
    });
  }

  /**
   * Get official template category content
   * @param categoryCode
   */
  function getTemplateCategoriesReq(categoryCode: string) {
    return Api.getTemplateCategories(categoryCode).then((res) => {
      const { success, data, message } = res.data;
      if (success) {
        return data;
      }
      Message.error({
        content: message,
      });
    });
  }

  /**
   * Get a list of official template categories
   * @param categoryCodes List of category ids to be sorted
   */
  function getTemplateCategoryReq(categoryCodes?: string) {
    return Api.getTemplateCategory(categoryCodes).then((res) => {
      const { success, data, message } = res.data;
      if (success) {
        dispatch(StoreActions.updateTemplateCategory(data));
        return data;
      }
      Message.error({
        content: message,
      });
    });
  }

  /**
   * Get a list of templates
   * @param spaceId Space Station ID
   * @param categoryCode
   * @param isPrivate
   */
  function getTemplateListReq(spaceId: string, categoryCode?: string, isPrivate?: boolean) {
    return Api.getTemplateList(spaceId, categoryCode, isPrivate).then((res) => {
      const { success, data, message } = res.data;
      if (success) {
        return data;
      }
      Message.error({
        content: message,
      });
      return false;
    });
  }

  /**
   * Delete template
   * @param templateId
   */
  function deleteTemplateReq(templateId: string) {
    return Api.deleteTemplate(templateId).then((res) => {
      const { success, code } = res.data;
      if (success) {
        Message.success({
          content: t(Strings.message_delete_template_successfully),
        });
        return true;
      }
      if (code === StatusCode.TEMPLATE_NOT_EXIST) {
        import('pc/components/common/modal/modal/modal').then(({ Modal }) => {
          Modal.error({
            title: t(Strings.template_has_been_deleted_title),
            content: t(Strings.template_has_been_deleted),
            onOk: () => Router.back(),
          });
        });
      }
      return false;
    });
  }

  /**
   * Get template catalogue information
   * @param templateId
   * @param isPrivate
   * @param categoryCode
   */
  function getTemplateDirectoryReq(templateId: string, isPrivate: boolean, categoryCode?: string) {
    return Api.templateDirectory(templateId, isPrivate, categoryCode).then((res) => {
      const { success, message, data } = res.data;
      if (success) {
        dispatch(StoreActions.updateTemplateDirectory(data));
        return data;
      }
      Message.error({
        content: message,
      });
      return false;
    });
  }

  // Use of templates
  function usingTemplateReq(templateId: string, parentId: string, data?: boolean, unitId?: string) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return Api.useTemplate(templateId, parentId, data, unitId).then((res) => {
      const { success, data, code } = res.data;
      if (success) {
        Message.success({
          content: t(Strings.using_templates_successful),
        });
        return data;
      }
      if (code === StatusCode.TEMPLATE_NOT_EXIST) {
        import('pc/components/common/modal/modal/modal').then(({ Modal }) => {
          Modal.error({
            title: t(Strings.template_has_been_deleted_title),
            content: t(Strings.template_has_been_deleted),
            onOk: () => Router.back(),
          });
        });
      }
      return false;
    });
  }

  // Check if the template name already exists
  function templateNameValidateReq(name: string) {
    return Api.templateNameValidate(name).then((res) => {
      const { success, data, message } = res.data;
      if (success) {
        return data;
      }
      Message.error({
        content: message,
      });
    });
  }

  // Get popular recommended content
  function templateRecommendReq() {
    return Api.templateRecommend().then((res) => {
      const { success, data, message } = res.data;
      if (success) {
        return data;
      }
      Message.error({
        content: message,
      });
      return;
    });
  }

  // Fuzzy search templates
  function searchTemplateReq(keyword: string) {
    return Api.searchTemplate(keyword).then((res) => {
      const { success, data, message } = res.data;
      if (success) {
        return data;
      }
      Message.error({
        content: message,
      });
      return;
    });
  }

  return {
    createTemplateReq,
    getTemplateCategoriesReq,
    getTemplateCategoryReq,
    getTemplateListReq,
    deleteTemplateReq,
    getTemplateDirectoryReq,
    usingTemplateReq,
    templateNameValidateReq,
    templateRecommendReq,
    searchTemplateReq,
  };
};
