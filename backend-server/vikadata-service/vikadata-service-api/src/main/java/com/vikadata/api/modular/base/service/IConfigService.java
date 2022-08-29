package com.vikadata.api.modular.base.service;

import com.vikadata.api.model.ro.config.ConfigRo;

/**
 * <p>
 * 配置 服务接口
 * </p>
 *
 * @author Chambers
 * @date 2020/7/30
 */
public interface IConfigService {

    /**
     * 获取通用配置
     *
     * @param lang 语言
     * @return val
     * @author Chambers
     * @date 2020/7/30
     */
    Object getWizardConfig(String lang);

    /**
     * 生成通用配置
     *
     * @param userId 用户ID
     * @param config 配置参数
     * @author Chambers
     * @date 2020/7/30
     */
    void generateWizardConfig(Long userId, ConfigRo config);
}
