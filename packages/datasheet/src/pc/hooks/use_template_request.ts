import { Api, StatusCode, StoreActions, Strings, t } from '@vikadata/core';
import Router from 'next/router';
import { Message } from 'pc/components/common/message/message';
import { useDispatch } from 'react-redux';

export const useTemplateRequest = () => {
  const dispatch = useDispatch();

  /**
   * 创建模板
   * @param nodeId 节点id
   * @param name 模板名称
   * @param data 是否保存数据
   */
  function createTemplateReq(nodeId: string, name: string, data?: boolean) {
    return Api.createTemplate(nodeId, name, data).then(res => {
      const { success, message, data, code } = res.data;
      return { success, message, data, code };
    });
  }

  /**
   * 获取官方模板分类内容
   * @param categoryCode 模版分类 ID
   */
  function getTemplateCategoriesReq(categoryCode: string) {
    return Api.getTemplateCategories(categoryCode).then(res => {
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
   * 获取官方模版分类列表
   * @param categoryCodes 需要排序的分类id列表
   */
  function getTemplateCategoryReq(categoryCodes?: string) {
    return Api.getTemplateCategory(categoryCodes).then(res => {
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
   * 获取模版列表
   * @param spaceId 空间站 ID
   * @param categoryName 模版分类名称
   * @param templateIds 模版ID列表
   */
  function getTemplateListReq(spaceId: string, categoryCode?: string, isPrivate?: boolean) {
    return Api.getTemplateList(spaceId, categoryCode, isPrivate).then(res => {
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
   * 删除模板
   * @param templateId 模板Id
   */
  function deleteTemplateReq(templateId: string) {
    return Api.deleteTemplate(templateId).then(res => {
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
            onOk: () => Router.back()
          });
        });

      }
      return false;
    });
  }

  /**
   * 获取模板目录信息
   * @param templateId 模板Id
   */
  function getTemplateDirectoryReq(templateId: string, isPrivate: boolean, categoryCode?: string) {
    return Api.templateDirectory(templateId, isPrivate, categoryCode).then(res => {
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

  // 使用模板
  function usingTemplateReq(templateId: string, parentId: string, data?: boolean) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return Api.useTemplate(templateId, parentId, data).then(res => {
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
            onOk: () => Router.back()
          });
        });
      }
      return false;
    });
  }

  // 校验模版名称是否已存在
  function templateNameValidateReq(name: string) {
    return Api.templateNameValidate(name).then(res => {
      const { success, data, message } = res.data;
      if (success) {
        return data;
      }
      Message.error({
        content: message,
      });
    });
  }

  // 获取热门推荐内容
  function templateRecommendReq() {
    return Api.templateRecommend().then(res => {
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

  // 模糊搜索模板
  function searchTemplateReq(keyword: string) {
    return Api.searchTemplate(keyword).then(res => {
      const { success, data, message } = res.data;
      if (success) {
        return data;
      }
      Message.error({
        content: message,
      });
    });
  }

  return {
    createTemplateReq, getTemplateCategoriesReq,
    getTemplateCategoryReq, getTemplateListReq, deleteTemplateReq, getTemplateDirectoryReq,
    usingTemplateReq, templateNameValidateReq, templateRecommendReq, searchTemplateReq,
  };
};
