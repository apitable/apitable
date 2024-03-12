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

import MarkdownIt from 'markdown-it';
import Image from 'next/image';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button, Typography, Loading } from '@apitable/components';
import { getLanguage, Navigation, Strings, t, Api } from '@apitable/core';
import { ChevronLeftOutlined, DescriptionOutlined, ShareOutlined } from '@apitable/icons';
import { Message } from 'pc/components/common/message/message';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { Router } from 'pc/components/route_manager/router';
import { useAppSelector } from 'pc/store/react-redux';
import { copy2clipBoard } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import albumTemplateEnPng from 'static/icon/template/album_template_en.png';
import albumTemplateZhPng from 'static/icon/template/album_template_zh.png';
import styles from './style.module.less';

const md = new MarkdownIt({
  html: true,
  breaks: true,
});

interface IAlbumDetail {
  album: {
    name: string;
    cover: string;
    authorName: string;
    authorLogo: string;
    authorDesc: string;
    content: string;
    tags: string[];
  };
  recommends: {
    albumId: string;
    cover: string;
    name: string;
    description: string;
  }[];
}

const AlbumDetail = () => {
  const categoryId = useAppSelector((state) => state.pageParams.categoryId);
  const spaceId = useAppSelector((state) => state.space.activeId);
  const isZh = getLanguage() === 'zh-CN';
  const env = getEnvVariables();

  const router = useRouter();
  const albumId = router.query.album_id as string;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<IAlbumDetail | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const albumRlt = await Api.getTemplateAlbum(albumId);
      const recommendRlt = await Api.getTemplateAlbumsRecommend(albumId, 5);
      const { success, data } = albumRlt.data;
      const { success: recommendSuccess, data: recommendData } = recommendRlt.data;
      if (success && recommendSuccess) {
        setLoading(false);
        setData({
          album: data,
          recommends: recommendData,
        });
      }
    };
    fetchData();
  }, [albumId]);

  const goBack = () => {
    Router.push(Navigation.TEMPLATE, { params: { spaceId, categoryId } });
  };
  const handleCopyShare = () => {
    copy2clipBoard(location.href, () => {
      Message.success({ content: t(Strings.template_album_share_success) });
    });
  };
  const jump2RecommendAlbum = (albumId: string) => {
    Router.push(Navigation.TEMPLATE, {
      params: {
        spaceId,
        albumId,
        categoryId: 'album',
      },
    });
  };

  if (loading || !data) {
    return <Loading />;
  }
  const { album, recommends } = data;
  return (
    <div className={styles.albumDetail}>
      <header className={styles.albumHeader}>
        <div className={styles.goBack} onClick={goBack}>
          <ChevronLeftOutlined color="currentColor" />
          <span className={styles.albumName}>{album.name}</span>
        </div>
        <div className={styles.shareBtn} onClick={handleCopyShare}>
          <ShareOutlined currentColor />
          {t(Strings.share)}
        </div>
      </header>
      <div className={styles.albumCover}>
        <Image src={album.cover} alt="album cover" layout="fill" objectFit="cover" />
      </div>
      <div className={styles.albumContent}>
        <div className={styles.albumContentLeft}>
          <div className={styles.albumAuthor}>
            <header>
              <div className={styles.albumAuthorImg}>
                <Image src={album.authorLogo} alt="author logo" layout="fill" objectFit="cover" />
              </div>
              <div className={styles.albumAuthorContent}>
                <div className={styles.albumAuthorTitle}>{t(Strings.album_publisher)}</div>
                <h4>{album.authorName}</h4>
              </div>
            </header>
            <div className={styles.authorDesc}>
              <span>
                <DescriptionOutlined currentColor />
              </span>
              <div className={styles.authorDescContent}>{album.authorDesc}</div>
            </div>
          </div>
          <div className={styles.albumTags}>
            {album.tags.map((tag, index) => (
              <span key={index} className={styles.albumTagItem}>
                {tag}
              </span>
            ))}
          </div>
          <div className={styles.albumRecommends}>
            <h3>{t(Strings.recommend_album)}</h3>
            {recommends.map((recommend) => (
              <div key={recommend.albumId} className={styles.albumRecommendItem} onClick={() => jump2RecommendAlbum(recommend.albumId)}>
                <div className={styles.albumRecommendImg}>
                  <Image src={recommend.cover} alt="recommend cover" layout="fill" objectFit="cover" />
                </div>
                <div className={styles.albumRecommendContent}>
                  <Typography variant="h7" ellipsis>
                    {recommend.name}
                  </Typography>
                  <Typography
                    variant="body4"
                    className={styles.albumRecommendDesc}
                    ellipsis={{
                      rows: 2,
                    }}
                  >
                    {recommend.description}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.albumContentRight}>
          <div className={styles.albumRightContent} dangerouslySetInnerHTML={{ __html: md.render(album.content) }} />
          <div className={styles.bottomShare}>
            <Button shape="round" variant="fill" color="primary" prefixIcon={<ShareOutlined currentColor />} onClick={handleCopyShare}>
              {t(Strings.share)}
            </Button>
          </div>
          {env.TEMPLATE_FEEDBACK_FORM_URL && (
            <div className={styles.albumAdvise} onClick={() => navigationToUrl(`${env.TEMPLATE_FEEDBACK_FORM_URL}`)}>
              <Image layout="fill" objectFit="contain" src={isZh ? albumTemplateZhPng : albumTemplateEnPng} alt="" />
            </div>
          )}
        </div>
      </div>
      <div />
    </div>
  );
};

export default AlbumDetail;
