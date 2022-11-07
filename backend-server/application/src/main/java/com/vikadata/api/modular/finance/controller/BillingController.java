package com.vikadata.api.modular.finance.controller;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.http.ContentType;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import cn.hutool.json.JSONUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.developer.GmAction;
import com.vikadata.api.event.SyncOrderEvent;
import com.vikadata.api.modular.developer.model.CreateBusinessOrderRo;
import com.vikadata.api.modular.developer.model.CreateEntitlementWithAddOn;
import com.vikadata.api.modular.developer.service.IGmService;
import com.vikadata.api.modular.finance.model.OfflineOrderInfo;
import com.vikadata.api.modular.finance.model.SpaceSubscriptionVo;
import com.vikadata.api.modular.finance.service.IBillingOfflineService;
import com.vikadata.core.util.SpringContextHolder;
import com.vikadata.core.support.ResponseData;
import com.vikadata.social.feishu.card.Message;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Operating System - Subscription Billing Module
 */
@RestController
@Api(tags = "Operating System - Subscription Billing Module", hidden = true)
@ApiResource(path = "/billing")
@Slf4j
public class BillingController {

    @Resource
    private IBillingOfflineService iBillingOfflineService;

    @Resource
    private IGmService iGmService;

    @PostResource(path = "/orders", requiredPermission = false)
    @ApiOperation(value = "Create Order", hidden = true)
    public ResponseData<Void> createOrder(@RequestBody @Valid CreateBusinessOrderRo data) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.BILLING_ORDER_CREATE);
        // Create business order
        OfflineOrderInfo offlineOrderInfo = iBillingOfflineService.createBusinessOrder(data);
        sendMessage(offlineOrderInfo.getMessage());
        // Sync order events
        SpringContextHolder.getApplicationContext().publishEvent(new SyncOrderEvent(this, offlineOrderInfo.getOrderId()));
        return ResponseData.success();
    }

    private void sendMessage(Message message) {
        HttpRequest request = HttpRequest.post("https://open.feishu.cn/open-apis/bot/v2/hook/5eba21bb-f26e-4311-a1ae-027c730704e2");
        Map<String, Object> body = new HashMap<>(2);
        body.put("msg_type", "interactive");
        body.put("card", JSONUtil.toJsonStr(message.getContent()));
        request.body(JSONUtil.toJsonStr(body), ContentType.JSON.toString());
        try (HttpResponse response = request.execute()) {
            if (!response.isOk()) {
                log.error("Failed to send subscription message card. Response: {}", response);
            }
        }
        catch (Exception exception) {
            log.error("Send subscription message card exception.", exception);
        }
    }

    @PostResource(path = "/createEntitlementWithAddOn", requiredPermission = false)
    @ApiOperation(value = "Giveaway Add-on Plan", hidden = true)
    public ResponseData<Void> reward(@RequestBody @Valid CreateEntitlementWithAddOn data) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.BILLING_ORDER_CREATE);
        iBillingOfflineService.createSubscriptionWithAddOn(data);
        return ResponseData.success();
    }

    @GetResource(path = "/space/{spaceId}/subscription", requiredPermission = false)
    @ApiOperation(value = "Query Space for Orders", hidden = true)
    public ResponseData<SpaceSubscriptionVo> fetchSpaceOrder(@PathVariable("spaceId") String spaceId) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.BILLING_ORDER_QUERY);
        return ResponseData.success(iBillingOfflineService.getSpaceSubscription(spaceId));
    }
}
