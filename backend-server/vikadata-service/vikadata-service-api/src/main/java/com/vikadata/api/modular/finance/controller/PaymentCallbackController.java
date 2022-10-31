package com.vikadata.api.modular.finance.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.pingplusplus.model.Event;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.event.SyncOrderEvent;
import com.vikadata.api.modular.finance.model.PingChargeSuccess;
import com.vikadata.api.modular.finance.service.IOrderPaymentService;
import com.vikadata.api.util.PingppUtil;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.core.util.HttpContextUtil;

import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.util.PingppUtil.CHARGE_SUCCESS;
import static com.vikadata.api.util.PingppUtil.PINGPP_SIGNATURE;
import static com.vikadata.api.util.PingppUtil.parsePingChargeSuccessData;

/**
 * Payment Callback Module API
 */
@RestController
@Api(tags = "Payment Callback Module API")
@ApiResource(path = "/")
@Slf4j
public class PaymentCallbackController {

    @Resource
    private IOrderPaymentService iOrderPaymentService;

    @PostResource(path = "/order/paid/callback", requiredLogin = false)
    @ApiOperation(value = "Payment Success WebHook Notification", notes = "Ping++", hidden = true)
    public String orderPaid(@RequestHeader HttpHeaders headers, HttpServletRequest request) throws Exception {
        return paySuccessCallback(headers, request);
    }

    private String paySuccessCallback(HttpHeaders headers, HttpServletRequest request) throws Exception {
        String signature = headers.getFirst(PINGPP_SIGNATURE);
        if (log.isDebugEnabled()) {
            log.debug("signature value：{}", signature);
        }
        String requestBody = HttpContextUtil.getBody(request);
        if (StrUtil.isBlank(signature) && JSONUtil.parseObj(requestBody).isEmpty()) {
            // Verify the address request and return directly
            return "pingxx:success";
        }
        // Parse asynchronous notification data
        Event event = PingppUtil.getEventFromRequest(requestBody, signature);
        if (log.isDebugEnabled()) {
            log.debug("Event body:{}", event.toString());
        }
        if (CHARGE_SUCCESS.equals(event.getType())) {
            // payment successful
            PingChargeSuccess chargeSuccess = parsePingChargeSuccessData(event.getData().getObject().toString());
            String orderId = iOrderPaymentService.retrieveOrderPaidEvent(chargeSuccess);
            // Sync order events
            if (StrUtil.isNotBlank(orderId)) {
                SpringContextHolder.getApplicationContext().publishEvent(new SyncOrderEvent(this, orderId));
            }
        }
        return "pingxx:success";
    }
}
