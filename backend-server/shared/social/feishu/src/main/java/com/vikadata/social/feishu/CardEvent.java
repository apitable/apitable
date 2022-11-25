package com.vikadata.social.feishu;

import java.util.Map;

import lombok.Getter;
import lombok.Setter;

/**
 * message card events
 */
@Getter
@Setter
public class CardEvent {

    private String openId;

    private String userId;

    private String openMessageId;

    private String tenantKey;

    private String token;

    private Action action;

    @Getter
    @Setter
    public static class Action {
        String tag;

        Map<String, String> value;

        private String option;
    }
}
