package com.vikadata.scheduler.space.config.properties;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;


/**
 * <p>
 * Service API服务配置信息
 * </p>
 *
 */
@Data
@ConfigurationProperties(prefix = "internal")
public class InternalProperties {

    /**
     * 域名
     */
    private String domain;

    /**
     * 获取用户历史操作记录接口地址
     */
    private String getPausedUserHistoryInfoURL;

    /**
     * 关闭账号接口地址
     */
    private String closePausedUserURL;

    /**
     * 批量处理企微接口许可延时任务的的接口地址
     */
    private String batchProcessSocialWecomPermitDelayUrl;

}
