package com.vikadata.system.config.notification;

import java.util.Map;

import lombok.Data;

/**
 * 通知配置
 * @author Shawn Deng
 * @date 2021-11-11 15:37:22
 */
@Data
public class NotificationConfig {

    private TypesConfig types;

    private TemplatesConfig templates;

    private Map<String, SocialTemplate> socialTemplates;
}
