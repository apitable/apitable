package com.vikadata.api.modular.template.service;

import com.vikadata.api.model.ro.template.TemplateCenterConfigRo;

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
