package com.vikadata.api.modular.base.service;

import com.vikadata.api.enums.base.SystemConfigType;

public interface ISystemConfigService {

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
