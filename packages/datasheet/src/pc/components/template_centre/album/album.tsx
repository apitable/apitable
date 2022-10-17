import styles from './style.module.less';
import BackIcon from 'static/icon/common/common_icon_left_line.svg';
import { t, Strings, Navigation } from '@vikadata/core';
import { ShareOutlined, DescriptionOutlined } from '@vikadata/icons';
import Image from 'next/image';
import { Router } from 'pc/components/route_manager/router';
import { useSelector } from 'react-redux';
import { FC } from 'react';
import { copy2clipBoard } from 'pc/utils';
import * as React from 'react';
import MarkdownIt from 'markdown-it';
import { Button } from '@vikadata/components';

const md = new MarkdownIt();

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
  const goBack = () => {
    Router.push(Navigation.TEMPLATE, { params: { spaceId, categoryId }});
  };
  const handleCopyShare = () => {
    copy2clipBoard(location.href);
  };
  const jump2RecommendAlbum = (albumId: string) => {
    Router.push( Navigation.TEMPLATE,{
      params: {
        spaceId,
        albumId,
        categoryId: 'album'
      },
    });
  };
  return (
    <div className={styles.albumDetail}>
      <header className={styles.albumHeader}>
        <div className={styles.goBack} onClick={goBack}>
          <BackIcon fill="currentColor" />
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
            {album.tags.map(tag => (
              <span className={styles.albumTagItem}>
                {tag}
              </span>
            ))}
          </div>
          <div className={styles.albumRecommends}>
            <h3>{t(Strings.recommend_album)}</h3>
            {recommends.map(recommend => (
              <div className={styles.albumRecommendItem} onClick={() => jump2RecommendAlbum(recommend.albumId)}>
                <div className={styles.albumRecommendImg}>
                  <Image src={recommend.cover} alt="recommend cover" layout="fill" objectFit="cover" />
                </div>
                <div className={styles.albumRecommendContent}>
                  <h4>{recommend.name}</h4>
                  <div className={styles.albumRecommendDesc}>{recommend.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.albumContentRight} >
          <div dangerouslySetInnerHTML={{ __html: md.render(album.content) }}/>
          <div className={styles.bottomShare}>
            <Button
              shape="round"
              variant="fill"
              color="primary"
              prefixIcon={<ShareOutlined currentColor />}
              onClick={handleCopyShare}
            >
              {t(Strings.share)}
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.albumForm}>
        <iframe src="https://vika.cn/share/shrxyD2zGCExgb3tTUG30/fomdcAEpdKETLUGsMY" />
      </div>
    </div>
  );
};

export default AlbumDetail;