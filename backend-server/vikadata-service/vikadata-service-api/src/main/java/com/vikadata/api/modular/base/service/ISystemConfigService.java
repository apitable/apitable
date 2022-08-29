package com.vikadata.api.modular.base.service;

import com.vikadata.api.enums.base.SystemConfigType;

/**
 * @author tao
 */
public interface ISystemConfigService {

    /**
     * 获取配置
     *
     * @param type  配置类型
     * @param lang  配置语言（非必须）
     * @return config
     * @author Chambers
     * @date 2022/6/22
     */
    String findConfig(SystemConfigType type, String lang);

    /**
     * 保存或更新记录
     *
     * @param userId    用户ID
     * @param type      配置类型
     * @param lang      配置语言
     * @param configVal 配置值
     * @author Chambers
     * @date 2022/6/22
     */
    void saveOrUpdate(Long userId, SystemConfigType type, String lang, String configVal);

}
