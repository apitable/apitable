package com.vikadata.social.feishu.event;

import lombok.Getter;
import lombok.Setter;

/**
 * 事件订阅 基础属性
 *
 * @author Shawn Deng
 * @date 2020-11-23 19:49:18
 */
@Setter
@Getter
public class BaseEvent {

    private String appInstanceId;

    private String appId;

    private String tenantKey;

    private String type;

    private Meta meta;

    @Setter
    @Getter
    public static class Meta {

        private String uuid;

        private String ts;
    }
}
