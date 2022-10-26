import { getLanguage, Navigation, Strings, t } from '@apitable/core';
import { Button, Typography } from '@vikadata/components';
import { DescriptionOutlined, ShareOutlined } from '@vikadata/icons';
import MarkdownIt from 'markdown-it';
import Image from 'next/image';
import { Message } from 'pc/components/common/message/message';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { Router } from 'pc/components/route_manager/router';
import { copy2clipBoard } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import * as React from 'react';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import BackIcon from 'static/icon/common/common_icon_left_line.svg';
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
  },
  recommends: {
    albumId: string;
    cover: string;
    name: string;
    description: string;
  }[]
}

const AlbumDetail: FC<IAlbumDetail> = props => {
  const { album, recommends } = props;
  const categoryId = useSelector(state => state.pageParams.categoryId);
  const spaceId = useSelector(state => state.space.activeId);
  const isZh = getLanguage() === 'zh-CN';
  const env = getEnvVariables();
  const goBack = () => {
    Router.push(Navigation.TEMPLATE, { params: { spaceId, categoryId }});
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
  return (
    <div className={styles.albumDetail}>
      <header className={styles.albumHeader}>
        <div className={styles.goBack} onClick={goBack}>
          <BackIcon fill='currentColor' />
          <span className={styles.albumName}>
            {album.name}
          </span>
        </div>
        <div className={styles.shareBtn} onClick={handleCopyShare}>
          <ShareOutlined currentColor />
          {t(Strings.share)}
        </div>
      </header>
      <div className={styles.albumCover}>
        <Image src={album.cover} alt='album cover' layout='fill' objectFit='cover' />
      </div>
      <div className={styles.albumContent}>
        <div className={styles.albumContentLeft}>
          <div className={styles.albumAuthor}>
            <header>
              <div className={styles.albumAuthorImg}>
                <Image src={album.authorLogo} alt='author logo' layout='fill' objectFit='cover' />
              </div>
              <div className={styles.albumAuthorContent}>
                <div className={styles.albumAuthorTitle}>{t(Strings.album_publisher)}</div>
                <h4>
                  {album.authorName}
                </h4>
              </div>
            </header>
            <div className={styles.authorDesc}>
              <span>
                <DescriptionOutlined currentColor />
              </span>
              <div className={styles.authorDescContent}>
                {album.authorDesc}
              </div>
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
            {recommends.map(recommend => (
              <div key={recommend.albumId} className={styles.albumRecommendItem} onClick={() => jump2RecommendAlbum(recommend.albumId)}>
                <div className={styles.albumRecommendImg}>
                  <Image src={recommend.cover} alt='recommend cover' layout='fill' objectFit='cover' />
                </div>
                <div className={styles.albumRecommendContent}>
                  <h4>{recommend.name}</h4>
                  <Typography
                    variant='body4'
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
            <Button
              shape='round'
              variant='fill'
              color='primary'
              prefixIcon={<ShareOutlined currentColor />}
              onClick={handleCopyShare}
            >
              {t(Strings.share)}
            </Button>
          </div>
          {
            env.TEMPLATE_CUSTOMIZATION && <div
              className={styles.albumAdvise}
              onClick={() => navigationToUrl(`${env.TEMPLATE_CUSTOMIZATION}`)}
            >
              <Image layout='fill' objectFit='contain' src={isZh ? albumTemplateZhPng : albumTemplateEnPng} alt='' />
            </div>
          }
        </div>
      </div>
      <div />
    </div>
  );
};

export default AlbumDetail;
