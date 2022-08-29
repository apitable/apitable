package com.vikadata.system.config.notification;

import lombok.Data;

/**
 * 企业微信通知模版
 * @author Shawn Deng
 * @date 2021-11-11 15:34:16
 */
@Data
public class SocialTemplate {
    private String id;

    private String templateString;

    private String title;

    /**
     * 跳转地址
     */
    private String url;

    /**
     * 消息图片链接
     */
    private String picUrl;

    /**
     * 消息类型
     */
    private String messageType;

    /**
     * 平台
     */
    private String platform;

    /**
     * notification.templates表的ID
     */
    private String notificationTemplateId;

    /**
     * 跳转链接文案
     */
    private String urlTitle;

    /**
     * 应用appId
     */
    private String appId;
}
