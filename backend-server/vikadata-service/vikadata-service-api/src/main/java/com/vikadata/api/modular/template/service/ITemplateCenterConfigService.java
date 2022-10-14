package com.vikadata.api.modular.template.service;

import com.vikadata.api.model.ro.template.TemplateCenterConfigRo;

/**
 * <p>
 * Template Center - Template Center Config Service
 * </p>
 *
 * @author Chambers
 * @date 2022/9/26
 */
public interface ITemplateCenterConfigService {

    /**
     * update template center config
     *
     * @param userId    User ID
     * @param ro        Config Request Object
     * @author Chambers
     * @date 2022/9/23
     */
    void updateTemplateCenterConfig(Long userId, TemplateCenterConfigRo ro);

}
