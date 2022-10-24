import * as actions from '../action_constants';

export interface ITemplateCentre {
  /**
   * template category
   */
  category: ITemplateCategory[];
  
  /**
   * some template's template directory
   */
  directory: ITemplateDirectory | null;
}

export interface ITemplateChoiceHeader {
  templateIds: string[];
  image: string;
  bannerDesc: {
    title: string;
    desc: string;
  };
}

export interface ITemplate {
  templateId: string;
  templateName: string;
  nodeId: string;
  nodeType: number;
  cover: string;
  description: string;
  tags: string[];
  avatar: string;
  nickName: string;
  uuid: string;
}

export interface ITemplateDirectory {
  avatar: string;
  categoryCode: string;
  categoryName: string;
  nickName: string;
  nodeTree: ITemplateTree;
  spaceName: string;
  templateId: string;
  templateName: string;
  uuid: string;
  isMemberNameModified?: boolean;
}

export interface ITemplateTree {
  nodeId: string;
  nodeName: string;
  icon: string;
  type: number;
  children: ITemplateTree[];
}

export interface ITemplateCategory {
  categoryCode: string;
  categoryName: string;
}

export interface ISearchAblum {
  name: string;
  albumId: string;
}

export interface ISearchTemplate {
  categoryCode: string;
  categoryName: string;
  tags: string[];
  templateId: string;
  templateName: string;
}

export interface IUpdateTemplateCategoryAction {
  type: typeof actions.UPDATE_TEMPLATE_CATEGORY;
  payload: ITemplateCategory[];
}

export interface IUpdateTemplateDirectoryAction {
  type: typeof actions.UPDATE_TEMPLATE_DIRECTORY;
  payload: ITemplateDirectory | null;
}
