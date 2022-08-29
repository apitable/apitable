package com.vikadata.api.cache.service;

/**
 * 模板配置服务
 * @author tao
 */
public interface ITemplateConfigService {
    /**
     * 获取模板中心某语言热门推荐配置信息
     * @param lang 语言
     * @return 模板中心某语言热门推荐配置信息
     */
    String getRecommendConfigCacheByLang(String lang);

    /**
     * 删除某语言热门推荐配置信息缓存
     * @param lang 语言
     */
    void deleteRecommendConfigCacheByLang(String lang);

    /**
     * 获取模板中心某语言模板分类配置信息
     *
     * @param lang 语言
     * @return 模板中行分类信息
     */
    String getCategoriesListConfigCacheByLang(String lang);

    /**
     * 删除某语言模板分类配置信息缓存
     * @param lang 语言
     */
    void deleteCategoriesListConfigCacheByLang(String lang);
}
