import { Typography } from '@vikadata/components';
import {
  ConfigConstant, getImageThumbSrc, integrateCdnHost, IReduxState, isPrivateDeployment, Navigation, Settings, Strings, t, TEMPLATE_CENTER_ID
} from '@vikadata/core';
import { Col, Row } from 'antd';
import { TemplateRecommendContext } from 'context/template_recommend';
import { navigationToUrl, useNavigation } from 'pc/components/route_manager/use_navigation';
import { isMobileApp } from 'pc/utils/env';
import React, { FC, useContext } from 'react';
import { useSelector } from 'react-redux';
import { TemplateItem } from '../template_item';
import styles from './style.module.less';

const defaultBanner = integrateCdnHost(Settings.folder_showcase_banners.value.split(',')[0]);

export interface ITemplateChoiceProps {
  setUsingTemplate: React.Dispatch<React.SetStateAction<string>>;
}

export const imgUrl = (token: string, imageHeight: number) => {
  return getImageThumbSrc(token, { h: Math.ceil(imageHeight * 2), quality: 90 });
};

export const TemplateChoice: FC<ITemplateChoiceProps> = props => {
  const { setUsingTemplate } = props;
  const navigationTo = useNavigation();
  const categoryId = useSelector((state: IReduxState) => state.pageParams.categoryId);
  const spaceId = useSelector((state: IReduxState) => state.space.activeId);
  const { recommendData: templateRecommendData } = useContext(TemplateRecommendContext);

  const openTemplateDetail = ({ templateId }) => {
    navigationTo({
      path: Navigation.TEMPLATE,
      params: {
        spaceId,
        templateId,
        categoryId: categoryId || ConfigConstant.TEMPLATE_CHOICE_CATEGORY_ID,
      },
    });
  };
  if (!templateRecommendData) {
    return null;
  }

  return (
    <div className={styles.templateChoiceWrapper}>
      <Row className={styles.templateChoice}>
        <Col span={24}>
          {templateRecommendData.top &&
            <>
              <div className={styles.topBannerWrapper} id={TEMPLATE_CENTER_ID.TOP_HOT_BANNER}>
                <TemplateItem
                  templateId={templateRecommendData.top[0].templateId}
                  height={280}
                  img={imgUrl(templateRecommendData.top[0].image, 280)}
                  onClick={openTemplateDetail}
                  bannerDesc={{
                    title: templateRecommendData.top[0].title,
                    color: templateRecommendData.top[0]?.color,
                    desc: templateRecommendData.top[0].desc,
                  }}
                  usingTemplate={setUsingTemplate}
                />
              </div>
              <div className={styles.recommendWrapper}>
                {
                  templateRecommendData.top.slice(1).map(template => (
                    <div className={styles.recommendItem} key={template.image}>
                      <TemplateItem
                        height={160}
                        templateId={template.templateId}
                        img={imgUrl(template.image, 160)}
                        onClick={openTemplateDetail}
                        bannerDesc={{
                          title: template.title,
                          desc: template.desc,
                        }}
                        bannerType={ConfigConstant.BannerType.MIDDLE}
                        usingTemplate={setUsingTemplate}
                      />
                    </div>
                  ))
                }
              </div>
            </>
          }
          {
            templateRecommendData.categories && templateRecommendData.categories.map(category => (
              <Row key={category.categoryName}>
                <Col span={24} className={styles.category}>
                  <Row className={styles.categoryName}>
                    <Col span={24}>{category.categoryName}</Col>
                  </Row>
                  <div className={styles.templateList}>
                    {category.templateVos.map(template => {
                      return (
                        <div className={styles.templateItemWrapper} key={template.templateId}>
                          <TemplateItem
                            templateId={template.templateId}
                            type="card"
                            nodeType={template.nodeType}
                            img={imgUrl(template.cover || defaultBanner, 160)}
                            name={template.templateName}
                            description={template.description}
                            tags={template.tags}
                            onClick={openTemplateDetail}
                            usingTemplate={setUsingTemplate}
                            isOfficial
                          />
                        </div>
                      );
                    })}
                  </div>
                </Col>
              </Row>
            ))
          }
        </Col>
      </Row>
      {
        !isPrivateDeployment() && !isMobileApp() &&
        <Typography className={styles.notFoundTip} variant="body2" align="center">
          <span className={styles.text} onClick={() => navigationToUrl(`${Settings['template_customization'].value}`)}>
            {t(Strings.template_not_found)}
          </span>
        </Typography>
      }
    </div>
  );
};
