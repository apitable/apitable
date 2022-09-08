import { Typography } from '@vikadata/components';
import {
  ConfigConstant, integrateCdnHost, IReduxState, isPrivateDeployment, ITemplate, ITemplateCategory, Navigation, Settings, StoreActions, Strings, t,
} from '@vikadata/core';
import { Col, Row } from 'antd';
import { TemplateListContext } from 'context/template_list';
import parser from 'html-react-parser';
import Image from 'next/image';
import { isWecomFunc } from 'pc/components/home/social_platform';
// import { Modal } from 'pc/components/common';
import { navigationToUrl, useNavigation } from 'pc/components/route_manager/use_navigation';
import { useRequest } from 'pc/hooks';
import { useTemplateRequest } from 'pc/hooks/use_template_request';
import { isMobileApp } from 'pc/utils/env';
import React, { FC, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import templateEmptyPng from 'static/icon/template/template_img_empty.png';
import { imgUrl } from '../template_choice';
import { TemplateItem } from '../template_item';
import styles from './style.module.less';

// 默认banner图地址
const defaultBanner = integrateCdnHost(Settings.folder_showcase_banners.value.split(',')[0]);

export interface ITemplateCategoryDetailProps {
  isOfficial: boolean;
  // 分类
  templateCategory: ITemplateCategory[];
  setUsingTemplate: React.Dispatch<React.SetStateAction<string>>;
}

export const TemplateCategoryDetail: FC<ITemplateCategoryDetailProps> = props => {
  const { setUsingTemplate, templateCategory } = props;
  const { templateListData } = useContext(TemplateListContext);
  const [templateList, setTemplateList] = useState<ITemplate[] | null>(() => {
    return templateListData || null;
  });
  const [isOfficial, setIsOfficial] = useState(true);
  const navigationTo = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state: IReduxState) => state.user.info);
  const spaceId = useSelector((state: IReduxState) => state.space.activeId);
  const categoryId = useSelector((state: IReduxState) => state.pageParams.categoryId);
  const { getTemplateListReq, deleteTemplateReq } = useTemplateRequest();
  const { run: deleteTemplate } = useRequest(deleteTemplateReq, { manual: true });
  const { run: getTemplateList, data: templateData, loading } =
    useRequest<ITemplate[]>(getTemplateListReq, { manual: true });

  useEffect(() => {
    // 访问空间站模板需要处于登录状态
    if (categoryId === 'tpcprivate' && user) {
      setIsOfficial(false);
      getTemplateList('', true);
      !user.isMainAdmin && dispatch(StoreActions.spaceResource());
      return;
    }

    setIsOfficial(true);
    getTemplateList(categoryId, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, user]);

  useEffect(() => {
    if (templateData) {
      setTemplateList(templateData);
    }
  }, [templateData]);

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

  const delTemplate = async(templateId: string) => {
    if (!templateList) {
      return;
    }
    const result = await deleteTemplate(templateId);
    if (result) {
      setTemplateList(templateList.filter(template => template.templateId !== templateId));
    }
  };

  const openTemplateDetail = ({ templateId }) => {
    navigationTo({
      path: Navigation.TEMPLATE,
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

  const currentCategory = templateCategory.find(item => item.categoryCode === categoryId);

  return (
    <div className={styles.templateDetailWrapper}>
      {
        (!templateList.length) ?
          (
            <div className={styles.listEmpty}>
              <Image src={templateEmptyPng} alt={t(Strings.template_no_template)} />
              <div className={styles.text}>{parser(t(Strings.how_create_template))}</div>
            </div>
          ) :
          (
            <Row className={styles.templateCategory}>
              <Col span={24}>
                <Row>
                  <Col className={styles.title}>
                    <div className={styles.categoryName}>
                      {!isOfficial ? t(Strings.all) : currentCategory && currentCategory.categoryName}
                    </div>
                    {!isPrivateDeployment() && !isMobileApp() && !isWecomFunc() &&
                      <Typography className={styles.notFoundTip} variant="body2" align="center">
                        <span
                          className={styles.text}
                          onClick={() => navigationToUrl(`${Settings['template_customization'].value}`)}
                        >
                          {t(Strings.template_not_found)}
                        </span>
                      </Typography>
                    }
                  </Col>
                </Row>
                <div className={styles.templateList}>
                  {
                    templateList.map(template => (
                      <div className={styles.templateItemWrapper} key={template.templateId}>
                        <TemplateItem
                          type="card"
                          nodeType={template.nodeType}
                          templateId={template.templateId}
                          img={imgUrl(template.cover || defaultBanner, 160)}
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
                    ))
                  }
                </div>
              </Col>
            </Row>
          )
      }
    </div>
  );
};
