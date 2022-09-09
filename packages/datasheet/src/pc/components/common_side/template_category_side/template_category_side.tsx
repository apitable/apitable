import { ThemeName, Typography, useThemeColors } from '@vikadata/components';
import { ConfigConstant, IReduxState, ISearchTemplate, ITemplateCategory, Navigation, Strings, t, TrackEvents } from '@vikadata/core';
import { useDebounceFn, useUnmount } from 'ahooks';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Logo } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { SearchInput } from 'pc/components/common/search_input';
import { Method, useNavigation } from 'pc/components/route_manager/use_navigation';
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
  /** 搜索关键字 */
  const [keywords, setKeywords] = useState(query.get('searchKey') || '');
  const navigationTo = useNavigation();
  const spaceId = useSelector((state: IReduxState) => state.space.activeId);
  const categoryId = useSelector((state: IReduxState) => state.pageParams.categoryId);
  const { getTemplateCategoryReq, searchTemplateReq } = useTemplateRequest();
  const { data: templateCategory } = useRequest<ITemplateCategory[]>(getTemplateCategoryReq);
  const { run: searchTemplate, data: searchTemplateResult, mutate } = useRequest<ISearchTemplate[]>(searchTemplateReq, { manual: true });
  const { run: debouncedSearchTemplate } = useDebounceFn(searchTemplate, { wait: 100 });
  // 记录一下已经上报过的keywords，避免重复埋点上报
  const hasTrackSearchKeyWords = useRef('');
  const router = useRouter();

  useEffect(() => {
    if (templateCategory) {
      setCategoryList([
        { categoryCode: ConfigConstant.TEMPLATE_CHOICE_CATEGORY_ID, categoryName: t(Strings.template_recommend_title) },
        ...templateCategory,
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateCategory]);

  useEffect(() => {
    const newKeywords = keywords.trim();
    if (newKeywords) {
      debouncedSearchTemplate(newKeywords);
    } else {
      mutate([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywords]);

  const { setSideBarVisible } = useSideBarVisible();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const handleClick = (categoryId: string) => {
    navigationTo({ path: Navigation.TEMPLATE, params: { spaceId, categoryId }});
    isMobile && setSideBarVisible(false);
  };

  const jumpOfficialWebsite = () => {
    navigationTo({ path: Navigation.HOME, method: Method.NewTab, query: { home: 1 }});
  };

  /**
   * 触发埋点
   * 规则：
   * 1. 搜索出结果之后2000ms
   * 2. 点击搜索结果模板之后
   * 3. 组件卸载
   * 4. 点击清空上报当前结果
   * 5. 输入框enter
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
    navigationTo({ path: Navigation.TEMPLATE, params: { spaceId, categoryId: categoryCode, templateId }});
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

  return (
    <div className={styles.templateClass}>
      <div className={classNames(styles.templateCategory, !spaceId && styles.templateCategoryBg)}>
        <div className={styles.title}>
          {!spaceId && (
            <Tooltip title={t(Strings.jump_official_website)}>
              <div className={styles.logo} onClick={jumpOfficialWebsite}>
                <Logo theme={ThemeName.Light} size="large" text={false} />
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
            size="small"
            onBlur={() => bindSearchQuery(keywords)}
            onKeyDown={onSearchInputKeyDown}
            suffix={keywords && <CloseIcon className={styles.closeBtn} onClick={clearKeyword} />}
          />
        </div>
        <div className={styles.listContainer}>
          <div className={styles.officialTemplate}>
            <Typography className={classNames(styles.subTitle, styles.officialSubTitle)} variant="h6">
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
              <Typography variant="h6" className={styles.subTitle}>
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
              {searchTemplateResult?.length ? (
                <>
                  {searchTemplateResult.map(item => (
                    <div className={styles.item} key={item.templateId} onClick={() => jumpTemplate(item.categoryCode, item.templateId)}>
                      <Typography className={styles.nameContainer} variant="body2">
                        <TemplateIcon width={16} height={16} fill={colors.staticWhite0} />
                        <span className={styles.name} dangerouslySetInnerHTML={{ __html: item.templateName }} />
                      </Typography>
                      <Typography className={styles.tags} variant="body3">
                        {item.tags.map(tag => (
                          <span className={styles.tag} dangerouslySetInnerHTML={{ __html: tag }} />
                        ))}
                      </Typography>
                    </div>
                  ))}
                </>
              ) : (
                <div className={styles.emptyList}>
                  <Image src={SearchDefaultPng} alt="empty" />
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
