package com.vikadata.api.base.service;

import com.vikadata.api.base.ro.ConfigRo;

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
