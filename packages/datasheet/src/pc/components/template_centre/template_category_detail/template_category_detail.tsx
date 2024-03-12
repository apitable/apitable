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

import { Col, Row } from 'antd';

import parser from 'html-react-parser';
import { isEmpty } from 'lodash';
import Image from 'next/image';
import React, { FC, useEffect, useState } from 'react';
import { ThemeName, Typography } from '@apitable/components';
import {
  ConfigConstant,
  integrateCdnHost,
  IReduxState,
  ITemplate,
  ITemplateCategory,
  Navigation,
  Settings,
  StoreActions,
  Strings,
  t,
} from '@apitable/core';
import { useGetSignatureAssertFunc } from '@apitable/widget-sdk';
import { Method } from 'pc/components/route_manager/const';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { Router } from 'pc/components/route_manager/router';
// import { Modal } from 'pc/components/common';
import { useRequest } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { useTemplateRequest } from 'pc/hooks/use_template_request';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables, isMobileApp } from 'pc/utils/env';
import NotDataImgDark from 'static/icon/datasheet/empty_state_dark.png';
import NotDataImgLight from 'static/icon/datasheet/empty_state_light.png';
import { imgUrl } from '../template_choice';
import { TemplateItem } from '../template_item';
// @ts-ignore
import { isDingtalkFunc, isWecomFunc } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

const defaultBanner = integrateCdnHost(Settings.workbench_folder_default_cover_list.value.split(',')[0]);

export interface ITemplateCategoryDetailProps {
  isOfficial: boolean;
  templateCategory: ITemplateCategory[];
  setUsingTemplate: React.Dispatch<React.SetStateAction<string>>;
}

export const TemplateCategoryDetail: FC<React.PropsWithChildren<ITemplateCategoryDetailProps>> = (props) => {
  const { setUsingTemplate, templateCategory } = props;
  const [templateList, setTemplateList] = useState<
    | ITemplate[]
    | {
        albums: {
          albumId: string;
          name: string;
          cover: string;
          description: string;
        }[];
        templates: ITemplate[];
      }
    | null
  >(null);
  const [isOfficial, setIsOfficial] = useState(true);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: IReduxState) => state.user.info);
  const spaceId = useAppSelector((state: IReduxState) => state.space.activeId);
  const categoryId = useAppSelector((state: IReduxState) => state.pageParams.categoryId);
  const { getTemplateCategoriesReq, getTemplateListReq, deleteTemplateReq } = useTemplateRequest();
  const { run: deleteTemplate } = useRequest(deleteTemplateReq, { manual: true });
  const { run: getTemplateList, data: templateData, loading } = useRequest<ITemplate[]>(getTemplateListReq, { manual: true });
  const env = getEnvVariables();
  const { run: getTemplateCategories, data: templateCategories } = useRequest<ITemplate[]>(getTemplateCategoriesReq, { manual: true });
  const getAssertUrl = useGetSignatureAssertFunc();

  const themeName = useAppSelector((state) => state.theme);
  const templateEmptyPng = themeName === ThemeName.Light ? NotDataImgLight : NotDataImgDark;
  useEffect(() => {
    // Login status is required to access the space station template
    if (categoryId === 'tpcprivate' && user) {
      setIsOfficial(false);
      getTemplateList(spaceId, '', true);
      !user.isMainAdmin && dispatch(StoreActions.spaceResource());
      return;
    }

    setIsOfficial(true);
    getTemplateCategories(categoryId);
    // eslint-disable-next-line
  }, [categoryId, user]);

  useEffect(() => {
    if (isOfficial) {
      setTemplateList(templateCategories || null);
    }
    if (templateData && !isOfficial) {
      setTemplateList(templateData);
    }
  }, [isOfficial, templateData, templateCategories]);

  const delTemplateConfirm = (templateId: string) => {
    import('pc/components/common/modal/modal/modal').then(({ Modal }) => {
      Modal.confirm({
        type: 'danger',
        title: t(Strings.delete_template_title),
        content: t(Strings.delete_template_content),
        onOk: () => {
          delTemplate(templateId);
        },
      });
    });
  };

  const delTemplate = async (templateId: string) => {
    if (!templateList) {
      return;
    }
    const result = await deleteTemplate(templateId);
    if (result) {
      setTemplateList((templateList as ITemplate[]).filter((template) => template.templateId !== templateId));
    }
  };

  const openTemplateDetail = ({ templateId }: { templateId: string }) => {
    Router.push(Navigation.TEMPLATE, {
      params: {
        spaceId,
        categoryId: categoryId || ConfigConstant.TEMPLATE_CHOICE_CATEGORY_ID,
        templateId,
      },
    });
  };

  if (!templateList || loading) {
    return null;
  }

  const currentCategory = templateCategory.find((item) => item.categoryCode === categoryId);

  const openTemplateAlbumDetail = ({ templateId }: { templateId: string }) => {
    Router.push(Navigation.TEMPLATE, {
      params: {
        spaceId,
        albumId: templateId,
        categoryId: 'album',
      },
    });
  };

  return (
    <div className={styles.templateDetailWrapper}>
      {isEmpty(templateList) ? (
        <div className={styles.listEmpty}>
          <Image src={templateEmptyPng} alt={t(Strings.template_no_template)} width={320} height={240} />
          <div className={styles.text}>{parser(t(Strings.how_create_template))}</div>
        </div>
      ) : (
        <Row className={styles.templateCategory}>
          <Col span={24}>
            <Row>
              <Col className={styles.title}>
                <div className={styles.categoryName}>{!isOfficial ? t(Strings.all) : currentCategory && currentCategory.categoryName}</div>
                {env.TEMPLATE_FEEDBACK_FORM_URL && !isMobileApp() && !isWecomFunc?.() && (
                  <Typography className={styles.notFoundTip} variant="body2" align="center">
                    <span
                      className={styles.text}
                      onClick={() =>
                        navigationToUrl(`${env.TEMPLATE_FEEDBACK_FORM_URL}`, {
                          method: isDingtalkFunc?.() ? Method.Push : Method.NewTab,
                        })
                      }
                    >
                      {t(Strings.template_not_found)}
                    </span>
                  </Typography>
                )}
              </Col>
            </Row>
            <>
              {Array.isArray(templateList) ? (
                <div className={styles.templateList}>
                  {templateList.map((template) => (
                    <div className={styles.templateItemWrapper} key={template.templateId}>
                      <TemplateItem
                        type="card"
                        nodeType={template.nodeType}
                        templateId={template.templateId}
                        img={imgUrl(getAssertUrl(template.cover || defaultBanner), 160)}
                        name={template.templateName}
                        description={template.description}
                        tags={template.tags}
                        isOfficial={isOfficial}
                        creator={{ name: template.nickName, avatar: template.avatar, userId: template.uuid }}
                        deleteTemplate={delTemplateConfirm}
                        usingTemplate={setUsingTemplate}
                        onClick={openTemplateDetail}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {!isEmpty(templateList.albums) && (
                    <>
                      <h3>{t(Strings.album)}</h3>
                      <div className={styles.templateList}>
                        {templateList.albums.map((album) => {
                          return (
                            <div className={styles.albumItemWrapper} key={album.albumId}>
                              <TemplateItem
                                bannerDesc={{
                                  title: album.name,
                                  desc: album.description,
                                }}
                                templateId={album.albumId}
                                height={200}
                                img={imgUrl(getAssertUrl(album.cover || defaultBanner), 200)}
                                onClick={openTemplateAlbumDetail}
                                isOfficial={isOfficial}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                  {!isEmpty(templateList.templates) && (
                    <>
                      <h3>{t(Strings.template)}</h3>
                      <div className={styles.templateList}>
                        {templateList.templates.map((template) => (
                          <div className={styles.templateItemWrapper} key={template.templateId}>
                            <TemplateItem
                              type="card"
                              nodeType={template.nodeType}
                              templateId={template.templateId}
                              img={imgUrl(getAssertUrl(template.cover || defaultBanner), 160)}
                              name={template.templateName}
                              description={template.description}
                              tags={template.tags}
                              isOfficial={isOfficial}
                              creator={{ name: template.nickName, avatar: template.avatar, userId: template.uuid }}
                              deleteTemplate={delTemplateConfirm}
                              usingTemplate={setUsingTemplate}
                              onClick={openTemplateDetail}
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          </Col>
        </Row>
      )}
    </div>
  );
};
