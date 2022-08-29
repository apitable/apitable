package com.vikadata.api.modular.social.event.feishu.v2;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.social.service.IFeishuEventService;
import com.vikadata.api.modular.social.service.ISocialFeishuEventLogService;
import com.vikadata.boot.autoconfigure.social.feishu.annotation.FeishuEventHandler;
import com.vikadata.boot.autoconfigure.social.feishu.annotation.FeishuEventListener;
import com.vikadata.social.feishu.event.app.AppOpenEvent;
import com.vikadata.social.feishu.event.app.AppStatusChangeEvent;
import com.vikadata.social.feishu.event.app.AppUninstalledEvent;
import com.vikadata.social.feishu.event.app.OrderPaidEvent;

import static com.vikadata.social.feishu.event.app.AppStatusChangeEvent.STATUS_START_BY_TENANT;
import static com.vikadata.social.feishu.event.app.AppStatusChangeEvent.STATUS_STOP_BY_PLATFORM;
import static com.vikadata.social.feishu.event.app.AppStatusChangeEvent.STATUS_STOP_BY_TENANT;

/**
 * 飞书
 * 事件订阅 - 应用事件
 *
 * @author Shawn Deng
 * @date 2020-11-25 18:49:05
 */
@FeishuEventHandler
@Slf4j
public class FeishuV2AppEventHandler {

    @Resource
    private IFeishuEventService iFeishuEventService;

    @Resource
    private ISocialFeishuEventLogService iSocialFeishuEventLogService;

    /**
     * 首次开通应用事件处理
     *
     * @param event 事件内容
     * @return 响应内容
     */
    @FeishuEventListener
    public Object onAppOpenEvent(AppOpenEvent event) {
        // 租户首次开通应用
        log.info("[飞书] 首次开通应用, 租户：[{}]", event.getTenantKey());
        iSocialFeishuEventLogService.create(event);
        iFeishuEventService.handleAppOpenEvent(event);
        return "";
    }

    /**
     * 应用停启用 事件处理
     *
     * @param event 事件内容
     * @return 响应内容
     */
    @FeishuEventListener
    public Object onAppStatusChangeEvent(AppStatusChangeEvent event) {
        // 记录租户
        log.info("[飞书] 企业租户:[{}], 应用[{}], 状态变更: {}", event.getTenantKey(), event.getAppId(), event.getStatus());
        iSocialFeishuEventLogService.create(event);
        switch (event.getStatus()) {
            case STATUS_STOP_BY_TENANT:
                log.info("[飞书] 租户主动停用");
                iFeishuEventService.handleAppStopEvent(event);
                break;
            case STATUS_START_BY_TENANT:
                log.info("[飞书] 租户停用后再启用");
                iFeishuEventService.handleAppRestartEvent(event);
                break;
            case STATUS_STOP_BY_PLATFORM:
                log.info("[飞书] 平台停用");
                break;
            default:
                log.error("未知的应用状态事件通知");
                break;
        }
        return "";
    }

    /**
     * 应用卸载 事件处理
     *
     * @param event 事件内容
     * @return 响应内容
     */
    @FeishuEventListener
    public Object onAppUninstalledEvent(AppUninstalledEvent event) {
        log.info("[飞书] 租户卸载应用, 租户：[{}]", event.getTenantKey());
        iSocialFeishuEventLogService.create(event);
        iFeishuEventService.handleAppUninstalledEvent(event);
        return "";
    }

    /**
     * 应用商店应用购买 事件处理
     *
     * @param event 事件内容
     * @return 响应内容
     */
    @FeishuEventListener
    public Object onAppOrderPaidEvent(OrderPaidEvent event) {
        log.info("[飞书] 租户商店应用购买, 租户：[{}]", event.getTenantKey());
        iSocialFeishuEventLogService.create(event);
        iFeishuEventService.handleOrderPaidEvent(event);
        return "";
    }
}
