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

import { useRequest } from 'ahooks';
import { Col, Row } from 'antd';

import { take, takeRight } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Typography } from '@apitable/components';
import {
  Api,
  api,
  ConfigConstant,
  getImageThumbSrc,
  integrateCdnHost,
  IReduxState,
  Navigation,
  Settings,
  Strings,
  t,
  TEMPLATE_CENTER_ID,
} from '@apitable/core';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { assertSignatureManager, useGetSignatureAssertFunc } from '@apitable/widget-sdk';
import { Method } from 'pc/components/route_manager/const';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { Router } from 'pc/components/route_manager/router';
import { useTemplateRequest } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables, isMobileApp } from 'pc/utils/env';
import categoryStyles from '../template_category_detail/style.module.less';
import { TemplateItem } from '../template_item';
// @ts-ignore
import { isDingtalkFunc } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

const defaultBanner = integrateCdnHost(Settings.workbench_folder_default_cover_list.value.split(',')[0]);

export interface ITemplateChoiceProps {
  setUsingTemplate: React.Dispatch<React.SetStateAction<string>>;
}

export const imgUrl = (token: string, imageHeight: number) => {
  const url = assertSignatureManager.getAssertSignatureUrl(token);
  if (!url) {
    return '';
  }
  return getImageThumbSrc(token, { h: Math.ceil(imageHeight * 2), quality: 90 });
};

export const TemplateChoice: FC<React.PropsWithChildren<ITemplateChoiceProps>> = (props) => {
  const { setUsingTemplate } = props;
  const [_templateRecommendData, setTemplateRecommendData] = useState<api.ITemplateRecommendResponse>();
  const categoryId = useAppSelector((state: IReduxState) => state.pageParams.categoryId);
  const spaceId = useAppSelector((state: IReduxState) => state.space.activeId);
  const { templateRecommendReq } = useTemplateRequest();
  const { data: templateRecommendData } = useRequest(templateRecommendReq);
  const env = getEnvVariables();

  useEffect(() => {
    if (templateRecommendData) {
      setTemplateRecommendData(templateRecommendData);
      return;
    }
    Api.templateRecommend().then((res) => {
      const { data, success } = res.data;
      if (success) {
        setTemplateRecommendData(data);
      }
    });
  }, [templateRecommendData]);

  const openTemplateDetail = ({ templateId }: { templateId: string }) => {
    Router.push(Navigation.TEMPLATE, {
      params: {
        spaceId,
        templateId,
        categoryId: categoryId || ConfigConstant.TEMPLATE_CHOICE_CATEGORY_ID,
      },
    });
  };
  const openTemplateAlbumDetail = ({ templateId }: { templateId: string }) => {
    Router.push(Navigation.TEMPLATE, {
      params: {
        spaceId,
        albumId: templateId,
        categoryId: 'album',
      },
    });
  };

  const getAssertUrl = useGetSignatureAssertFunc();

  if (!_templateRecommendData) {
    console.log({ cc: _templateRecommendData });
    return null;
  }

  const carouselItems = take(_templateRecommendData.top, _templateRecommendData.top?.length - 2);
  const firstTop = carouselItems[0];

  return (
    <div className={styles.templateChoiceWrapper}>
      <Row className={styles.templateChoice}>
        <Col span={24}>
          {_templateRecommendData.top && (
            <>
              <div className={styles.topBannerWrapper} id={TEMPLATE_CENTER_ID.TOP_HOT_BANNER}>
                {carouselItems.length === 1 ? (
                  <TemplateItem
                    templateId={firstTop.templateId}
                    height={280}
                    img={imgUrl(getAssertUrl(firstTop.image), 280)}
                    onClick={openTemplateDetail}
                    bannerDesc={{
                      title: firstTop.title,
                      color: firstTop?.color,
                      desc: firstTop.desc,
                    }}
                    usingTemplate={setUsingTemplate}
                  />
                ) : (
                  <Carousel showThumbs={false} showArrows={false} showStatus={false} autoPlay infiniteLoop swipeable>
                    {carouselItems.map((topItem) => (
                      <TemplateItem
                        templateId={topItem.templateId}
                        key={topItem.templateId}
                        height={280}
                        img={imgUrl(getAssertUrl(topItem.image), 280)}
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
                {takeRight(_templateRecommendData.top, 2).map((template) => (
                  <div className={styles.recommendItem} key={template.image}>
                    <TemplateItem
                      height={160}
                      templateId={template.templateId}
                      img={imgUrl(getAssertUrl(template.image), 160)}
                      onClick={openTemplateDetail}
                      bannerDesc={{
                        title: template.title,
                        desc: template.desc,
                      }}
                      bannerType={ConfigConstant.BannerType.MIDDLE}
                      usingTemplate={setUsingTemplate}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
          {_templateRecommendData.albumGroups?.map((albumGroup) => (
            <Row key={albumGroup.name}>
              <Col span={24} className={styles.category}>
                <Row className={styles.categoryName}>
                  <Col span={24}>{albumGroup.name}</Col>
                </Row>
                <div className={styles.templateList}>
                  {albumGroup.albums.map((album) => {
                    return (
                      <div className={categoryStyles.albumItemWrapper} key={album.albumId}>
                        <TemplateItem
                          bannerDesc={{
                            title: album.name,
                            desc: album.description,
                          }}
                          templateId={album.albumId}
                          height={200}
                          img={imgUrl(getAssertUrl(album.cover || defaultBanner), 200)}
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
          {_templateRecommendData.templateGroups &&
            _templateRecommendData.templateGroups.map((category) => (
              <Row key={category.name}>
                <Col span={24} className={styles.category}>
                  <Row className={styles.categoryName}>
                    <Col span={24}>{category.name}</Col>
                  </Row>
                  <div className={styles.templateList}>
                    {category.templates.map((template) => {
                      return (
                        <div className={styles.templateItemWrapper} key={template.templateId}>
                          <TemplateItem
                            templateId={template.templateId}
                            type="card"
                            nodeType={template.nodeType}
                            img={imgUrl(getAssertUrl(template.cover || defaultBanner), 160)}
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
            ))}
        </Col>
      </Row>
      {env.TEMPLATE_FEEDBACK_FORM_URL && !isMobileApp() && (
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
    </div>
  );
};
