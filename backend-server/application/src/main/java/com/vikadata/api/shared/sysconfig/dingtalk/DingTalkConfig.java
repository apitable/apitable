package com.vikadata.api.shared.sysconfig.dingtalk;

import java.util.Map;

import lombok.Data;

@Data
public class DingTalkConfig {
    private Map<String, DingTalkPlan> plans;
}
