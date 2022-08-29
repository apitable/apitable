package com.vikadata.api.modular.appstore.model;

/**
 * 实例配置设置
 * @author Shawn Deng
 * @date 2022-01-14 18:45:02
 */
public interface InstanceConfigProfile {

    /**
     * App标识
     */
    String getAppKey();

    /**
     * App密钥
     */
    String getAppSecret();

    /**
     * 转换成JSON字符串
     */
    String toJsonString();
}
