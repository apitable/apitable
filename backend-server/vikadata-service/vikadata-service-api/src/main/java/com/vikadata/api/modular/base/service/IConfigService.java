package com.vikadata.api.modular.base.service;

import com.vikadata.api.model.ro.config.ConfigRo;

/**
 * configure service interface
 */
public interface IConfigService {

    /**
     * Get generic configuration
     *
     * @param lang Language
     * @return val
     */
    Object getWizardConfig(String lang);

    /**
     * Generate generic configuration
     *
     * @param userId User ID
     * @param config Configuration parameters
     */
    void generateWizardConfig(Long userId, ConfigRo config);
}
