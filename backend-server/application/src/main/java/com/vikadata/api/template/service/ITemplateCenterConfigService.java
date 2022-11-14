package com.vikadata.api.template.service;

import com.vikadata.api.template.ro.TemplateCenterConfigRo;

/**
 * <p>
 * Template Center - Template Center Config Service
 * </p>
 */
public interface ITemplateCenterConfigService {

    /**
     * update template center config
     */
    void updateTemplateCenterConfig(Long userId, TemplateCenterConfigRo ro);

}
