package com.vikadata.api.shared.sysconfig;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import com.vikadata.api.shared.sysconfig.app.AppStoreConfig;
import com.vikadata.api.shared.sysconfig.audit.AuditConfig;
import com.vikadata.api.shared.sysconfig.billing.BillingConfig;
import com.vikadata.api.shared.sysconfig.dingtalk.DingTalkConfig;
import com.vikadata.api.shared.sysconfig.integral.IntegralRuleConfig;
import com.vikadata.api.shared.sysconfig.lark.LarkConfig;
import com.vikadata.api.shared.sysconfig.marketplace.MarketPlaceConfig;
import com.vikadata.api.shared.sysconfig.notification.NotificationConfig;
import com.vikadata.api.shared.sysconfig.wecom.WeComConfig;
import com.vikadata.api.shared.sysconfig.wizard.GuideConfig;

/**
 * <p>
 * System Config Aggregated Object
 * </p>
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
