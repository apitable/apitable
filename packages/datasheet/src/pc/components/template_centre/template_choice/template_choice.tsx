import { Typography } from '@vikadata/components';
import {
  ConfigConstant, getImageThumbSrc, integrateCdnHost, IReduxState, isPrivateDeployment, Navigation, Settings, Strings, t, TEMPLATE_CENTER_ID
} from '@apitable/core';
import { Col, Row } from 'antd';
import { TemplateRecommendContext } from 'context/template_recommend';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { Router } from 'pc/components/route_manager/router';
import { isMobileApp } from 'pc/utils/env';
import React, { FC, useContext } from 'react';
import { useSelector } from 'react-redux';
import { TemplateItem } from '../template_item';
import styles from './style.module.less';
import categoryStyles from '../template_category_detail/style.module.less';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { take, takeRight } from 'lodash';

const defaultBanner = integrateCdnHost(Settings.folder_showcase_banners.value.split(',')[0]);

export interface ITemplateChoiceProps {
  setUsingTemplate: React.Dispatch<React.SetStateAction<string>>;
}

export const imgUrl = (token: string, imageHeight: number) => {
  return getImageThumbSrc(token, { h: Math.ceil(imageHeight * 2), quality: 90 });
};

export const TemplateChoice: FC<ITemplateChoiceProps> = props => {
  const { setUsingTemplate } = props;
  const categoryId = useSelector((state: IReduxState) => state.pageParams.categoryId);
  const spaceId = useSelector((state: IReduxState) => state.space.activeId);
  const { recommendData: templateRecommendData } = useContext(TemplateRecommendContext);

  const openTemplateDetail = ({ templateId }) => {
    Router.push( Navigation.TEMPLATE,{
      params: {
        spaceId,
        templateId,
        categoryId: categoryId || ConfigConstant.TEMPLATE_CHOICE_CATEGORY_ID,
      },
    });
  };
  const openTemplateAlbumDetail = ({ templateId }) => {
    Router.push( Navigation.TEMPLATE,{
      params: {
        spaceId,
        albumId: templateId,
        categoryId: 'album'
      },
    });
  };
  if (!templateRecommendData) {
    return null;
  }

  const carouselItems = take(templateRecommendData.top, templateRecommendData.top?.length - 2);
  const firstTop = carouselItems[0];

  return (
    <div className={styles.templateChoiceWrapper}>
      <Row className={styles.templateChoice}>
        <Col span={24}>
          {templateRecommendData.top &&
            <>
              <div className={styles.topBannerWrapper} id={TEMPLATE_CENTER_ID.TOP_HOT_BANNER}>
                {carouselItems.length === 1 ? (
                  <TemplateItem
                    templateId={firstTop.templateId}
                    height={280}
                    img={imgUrl(firstTop.image, 280)}
                    onClick={openTemplateDetail}
                    bannerDesc={{
                      title: firstTop.title,
                      color: firstTop?.color,
                      desc: firstTop.desc,
                    }}
                    usingTemplate={setUsingTemplate}
                  />
                ) : (
                  <Carousel
                    showThumbs={false}
                    showArrows={false}
                    showStatus={false}
                    autoPlay
                    infiniteLoop
                    swipeable
                  >
                    {carouselItems.map(topItem => (
                      <TemplateItem
                        templateId={topItem.templateId}
                        key={topItem.templateId}
                        height={280}
                        img={imgUrl(topItem.image, 280)}
                        onClick={openTemplateDetail}
                        bannerDesc={{
                          title: topItem.title,
                          color: topItem?.color,
                          desc: topItem.desc,
                        }}
                        usingTemplate={setUsingTemplate}
                      />
                    ))}
                  </Carousel>
                )}
              </div>
              <div className={styles.recommendWrapper}>
                {
                  takeRight(templateRecommendData.top, 2).map(template => (
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
          {templateRecommendData.albumGroups?.map(albumGroup => (
            <Row key={albumGroup.name}>
              <Col span={24} className={styles.category}>
                <Row className={styles.categoryName}>
                  <Col span={24}>{albumGroup.name}</Col>
                </Row>
                <div className={styles.templateList}>
                  {albumGroup.albums.map(album => {
                    return (
                      <div className={categoryStyles.albumItemWrapper} key={album.albumId}>
                        <TemplateItem
                          bannerDesc={{
                            title: album.name,
                            desc: album.description,
                          }}
                          templateId={album.albumId}
                          height={200}
                          img={imgUrl(album.cover || defaultBanner, 200)}
                          onClick={openTemplateAlbumDetail}
                          isOfficial
                        />
                      </div>
                    );
                  })}
                </div>
              </Col>
            </Row>
          ))}
          {
            templateRecommendData.templateGroups && templateRecommendData.templateGroups.map(category => (
              <Row key={category.name}>
                <Col span={24} className={styles.category}>
                  <Row className={styles.categoryName}>
                    <Col span={24}>{category.name}</Col>
                  </Row>
                  <div className={styles.templateList}>
                    {category.templates.map(template => {
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
