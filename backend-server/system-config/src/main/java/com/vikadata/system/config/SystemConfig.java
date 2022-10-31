package com.vikadata.system.config;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import com.vikadata.system.config.app.AppStoreConfig;
import com.vikadata.system.config.audit.AuditConfig;
import com.vikadata.system.config.billing.BillingConfig;
import com.vikadata.system.config.dingtalk.DingTalkConfig;
import com.vikadata.system.config.integral.IntegralRuleConfig;
import com.vikadata.system.config.lark.LarkConfig;
import com.vikadata.system.config.marketplace.MarketPlaceConfig;
import com.vikadata.system.config.notification.NotificationConfig;
import com.vikadata.system.config.wecom.WeComConfig;
import com.vikadata.system.config.wizard.GuideConfig;

/**
 * System Config
 * @author Shawn Deng
 */
@Data
public class SystemConfig {

    private AuditConfig audit;

    private MarketPlaceConfig marketplace;

    private IntegralRuleConfig integral;

    private GuideConfig guide;

    private NotificationConfig notifications;

    private BillingConfig billing;

    @JsonProperty("appstores")
    private AppStoreConfig appStores;

    private LarkConfig lark;

    private WeComConfig wecom;

    private DingTalkConfig dingtalk;

}
