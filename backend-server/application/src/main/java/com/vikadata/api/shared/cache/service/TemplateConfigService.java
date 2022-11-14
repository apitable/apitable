package com.vikadata.api.shared.cache.service;

/**
 * template config service
 * @author tao
 */
public interface TemplateConfigService {

    /**
     * Get the recommended configuration information of some language in the template center
     * @param lang locale
     * @return config info
     */
    String getRecommendConfigCacheByLang(String lang);

    /**
     * delete recommend config cache
     * @param lang locale
     */
    void deleteRecommendConfigCacheByLang(String lang);

    /**
     * get template category
     *
     * @param lang locale
     * @return category info
     */
    String getCategoriesListConfigCacheByLang(String lang);

    /**
     * delete category cache
     * @param lang locale
     */
    void deleteCategoriesListConfigCacheByLang(String lang);
}
