package com.vikadata.system.config.dingtalk;

import java.util.List;

import lombok.Data;

@Data
public class DingTalkPlan {
    private String id;

    private String dingTalkItemCode;

    private List<String> billingPriceId;
}
