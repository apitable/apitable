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

import { ThemeName, Typography, useThemeColors } from '@apitable/components';
import {
  ConfigConstant,
  IReduxState,
  ISearchAblum,
  ISearchTemplate,
  ITemplateCategory,
  Navigation,
  Strings,
  t,
  TrackEvents
} from '@apitable/core';
import { useDebounceFn, useUnmount } from 'ahooks';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Logo } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { SearchInput } from 'pc/components/common/search_input';
import { Router } from 'pc/components/route_manager/router';
import { useQuery, useRequest, useResponsive, useSideBarVisible, useTemplateRequest } from 'pc/hooks';
import { KeyCode } from 'pc/utils/keycode';
import { tracker } from 'pc/utils/tracker';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import SearchDefaultPng from 'static/icon/common/common_img_search_default.png';
import CloseIcon from 'static/icon/datasheet/datasheet_icon_attachment_cancel.svg';
import TemplateIcon from 'static/icon/datasheet/datasheet_icon_template_folder.svg';
import styles from './style.module.less';

export const TemplateCategorySide: FC = () => {
  const colors = useThemeColors();
  /** official category list */
  const [categoryList, setCategoryList] = useState<ITemplateCategory[]>([]);
  const query = useQuery();
  const [keywords, setKeywords] = useState(query.get('searchKey') || '');
  const spaceId = useSelector((state: IReduxState) => state.space.activeId);
  const categoryId = useSelector((state: IReduxState) => state.pageParams.categoryId);
  const { getTemplateCategoryReq, searchTemplateReq } = useTemplateRequest();
  const { data: templateCategory } = useRequest<ITemplateCategory[]>(getTemplateCategoryReq);
  const {
    run: searchTemplate,
    data: searchTemplateResult,
    mutate
  } = useRequest<{
    albums: ISearchAblum[];
    templates: ISearchTemplate[];
  }>(searchTemplateReq, { manual: true });
  const { templates, albums } = searchTemplateResult || {};
  const { run: debouncedSearchTemplate } = useDebounceFn(searchTemplate, { wait: 300 });
  // Keep track of the keywords that have been reported to avoid duplication of buried reports
  const hasTrackSearchKeyWords = useRef('');
  const router = useRouter();

  useEffect(() => {
    if (templateCategory) {
      setCategoryList([
        { categoryCode: ConfigConstant.TEMPLATE_CHOICE_CATEGORY_ID, categoryName: t(Strings.template_recommend_title) },
        ...templateCategory,
      ]);
    }
    // eslint-disable-next-line
  }, [templateCategory]);

  useEffect(() => {
    const newKeywords = keywords.trim();
    if (newKeywords) {
      debouncedSearchTemplate(newKeywords);
    } else {
      mutate({ templates: [], albums: [] });
    }
    // eslint-disable-next-line
  }, [keywords]);

  const { setSideBarVisible } = useSideBarVisible();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const handleClick = (categoryId: string) => {
    Router.push(Navigation.TEMPLATE, { params: { spaceId, categoryId }});
    isMobile && setSideBarVisible(false);
  };

  const jumpOfficialWebsite = () => {
    Router.newTab(Navigation.HOME, { query: { home: 1 }});
  };

  /**
   * Trigger burial points
   * Rules：
   * 1. 2000ms after search results
   * 2. After clicking on the search results template
   * 3. Component Uninstallation
   * 4. Click to clear to report current results
   * 5. Input box enter
   */
  const triggerTrack = useCallback(keywords => {
    if (!keywords || hasTrackSearchKeyWords.current === keywords) {
      return;
    }
    hasTrackSearchKeyWords.current = keywords;
    console.log(`template keyword track: ${keywords}`);
    tracker.track(TrackEvents.TemplateKeyword, {
      keyword: keywords,
    });
  }, []);

  const jumpTemplate = (categoryCode: string, templateId: string) => {
    triggerTrack(keywords);
    Router.push(Navigation.TEMPLATE, { params: { spaceId, categoryId: categoryCode, templateId }});
  };

  const clearKeyword = () => {
    triggerTrack(keywords);
    setKeywords('');
    bindSearchQuery('');
  };

  const onSearchInputKeyDown = e => {
    if (e.keyCode === KeyCode.Enter) {
      triggerTrack(keywords);
    }
  };

  const bindSearchQuery = (keywords: string) => {
    const urlObj = new URL(window.location.href);
    const searchParams = urlObj.searchParams;
    if (keywords) {
      searchParams.set('searchKey', keywords);
    } else {
      searchParams.delete('searchKey');
    }
    router.replace(urlObj.pathname + urlObj.search);
  };

  useUnmount(() => {
    triggerTrack(keywords);
  });

  const { run: debounceTriggerTrack } = useDebounceFn(triggerTrack, { wait: 2000 });

  useEffect(() => {
    debounceTriggerTrack(keywords);
  }, [debounceTriggerTrack, keywords]);

  const openTemplateAlbumDetail = (albumId: string) => {
    Router.push( Navigation.TEMPLATE,{
      params: {
        spaceId,
        albumId,
        categoryId: 'album'
      },
    });
  };

  return (
    <div className={styles.templateClass}>
      <div className={classNames(styles.templateCategory, !spaceId && styles.templateCategoryBg)}>
        <div className={styles.title}>
          {!spaceId && (
            <Tooltip title={t(Strings.jump_official_website)}>
              <div className={styles.logo} onClick={jumpOfficialWebsite}>
                <Logo theme={ThemeName.Light} size='large' text={false} />
              </div>
            </Tooltip>
          )}
          {t(Strings.template_centre)}
        </div>
        <div className={styles.searchContainer}>
          <SearchInput
            className={styles.templateSearch}
            keyword={keywords}
            change={setKeywords}
            size='small'
            onBlur={() => bindSearchQuery(keywords)}
            onKeyDown={onSearchInputKeyDown}
            suffix={keywords && <CloseIcon className={styles.closeBtn} onClick={clearKeyword} />}
          />
        </div>
        <div className={styles.listContainer}>
          <div className={styles.officialTemplate}>
            <Typography className={classNames(styles.subTitle, styles.officialSubTitle)} variant='h6'>
              {t(Strings.official_template)}
            </Typography>
            <div className={styles.officialTemplateList}>
              {categoryList.map((category, index) => (
                <div
                  key={index}
                  className={classNames(styles.categoryItem, {
                    [styles.active]: category.categoryCode === categoryId || (!categoryId && index === 0),
                    [styles.activedCategoryMobile]: isMobile,
                  })}
                  onClick={() => handleClick(category.categoryCode)}
                >
                  <div className={classNames(styles.categoryName)}>{category.categoryName}</div>
                </div>
              ))}
            </div>
          </div>
          {spaceId && (
            <div className={styles.spaceTemplate}>
              <Typography variant='h6' className={styles.subTitle}>
                {t(Strings.space_template)}
              </Typography>
              <div
                className={classNames({
                  [styles.categoryItem]: true,
                  [styles.active]: 'tpcprivate' === categoryId,
                  [styles.activedCategoryMobile]: isMobile,
                })}
                onClick={() => handleClick('tpcprivate')}
              >
                <div className={styles.categoryName}>{t(Strings.all)}</div>
              </div>
            </div>
          )}
          {keywords && (
            <div className={styles.searchResult}>
              {((templates && templates.length > 0) || (albums && albums.length > 0)) ? (
                <>
                  {templates && templates.length > 0 && (
                    <>
                      <h3>{t(Strings.template)}</h3>
                      {templates.map(item => (
                        <div className={styles.item} key={item.templateId} onClick={() =>
                          jumpTemplate(item.categoryCode || ConfigConstant.TEMPLATE_UNCATEGORIZED, item.templateId)}
                        >
                          <Typography className={styles.nameContainer} variant='body2'>
                            <TemplateIcon width={16} height={16} fill={colors.staticWhite0} />
                            <span className={styles.name} dangerouslySetInnerHTML={{ __html: item.templateName }} />
                          </Typography>
                          <Typography className={styles.tags} variant='body3'>
                            {item.tags.map((tag, index) => (
                              <span key={index} className={styles.tag} dangerouslySetInnerHTML={{ __html: tag }} />
                            ))}
                          </Typography>
                        </div>
                      ))}
                    </>
                  )}
                  {albums && albums.length > 0 && (
                    <>
                      <h3>{t(Strings.album)}</h3>
                      {albums?.map((item, index) => (
                        <div className={styles.albumName} onClick={() => openTemplateAlbumDetail(item.albumId)} key={index}>
                          <span dangerouslySetInnerHTML={{ __html: item.name }} />
                        </div>
                      ))}
                    </>
                  )}
                </>
              ) : (
                <div className={styles.emptyList}>
                  <Image src={SearchDefaultPng} alt='empty' />
                  <div className={styles.tip}>{t(Strings.no_search_result)}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
