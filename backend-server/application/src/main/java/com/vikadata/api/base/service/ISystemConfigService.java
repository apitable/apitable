package com.vikadata.api.base.service;

import com.vikadata.api.base.enums.SystemConfigType;

public interface ISystemConfigService {

    /**
     * Get generic configuration
     *
     * @param lang Language
     * @return val
     */
    Object getWizardConfig(String lang);

    /**
     * get configuration
     *
     * @param type  configuration type
     * @param lang  configuration language (optional)
     * @return config
     */
    String findConfig(SystemConfigType type, String lang);

    /**
     * save or update config
     *
     * @param userId    user id
     * @param type      configuration type
     * @param lang      configuration language
     * @param configVal configuration value
     */
    void saveOrUpdate(Long userId, SystemConfigType type, String lang, String configVal);

}
