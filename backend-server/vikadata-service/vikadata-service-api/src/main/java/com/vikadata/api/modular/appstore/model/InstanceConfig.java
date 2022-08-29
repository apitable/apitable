package com.vikadata.api.modular.appstore.model;

import com.vikadata.api.modular.appstore.enums.AppType;

/**
 * 实例配置接口
 * @author Shawn Deng
 * @date 2022-01-14 18:36:40
 */
public interface InstanceConfig {

    /**
     * 实例详细设置
     */
    InstanceConfigProfile getProfile();

    /**
     * 应用类型
     */
    AppType getType();

    /**
     * 输出json字符串
     * @return Json String
     */
    String toJsonString();
}
