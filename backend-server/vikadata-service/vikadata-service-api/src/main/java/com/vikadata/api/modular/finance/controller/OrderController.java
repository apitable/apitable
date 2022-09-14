package com.vikadata.api.modular.finance.controller;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.exception.OrderException;
import com.vikadata.api.enums.finance.DryRunAction;
import com.vikadata.api.enums.finance.OrderStatus;
import com.vikadata.api.enums.finance.PayChannel;
import com.vikadata.api.modular.finance.core.DefaultOrderArguments;
import com.vikadata.api.modular.finance.core.DryRunArguments;
import com.vikadata.api.modular.finance.core.OrderArguments;
import com.vikadata.api.modular.finance.model.CreateOrderRo;
import com.vikadata.api.modular.finance.model.DryRunOrderArgs;
import com.vikadata.api.modular.finance.model.OrderDetailVo;
import com.vikadata.api.modular.finance.model.OrderPaymentVo;
import com.vikadata.api.modular.finance.model.OrderPreview;
import com.vikadata.api.modular.finance.model.PayOrderRo;
import com.vikadata.api.modular.finance.model.PaymentOrderStatusVo;
import com.vikadata.api.modular.finance.service.IOrderV2Service;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.util.AssertUtil.verifyNonNullOrEmpty;

/**
 * Billing order Api
 * @author Shawn Deng
 */
@RestController
@Api(tags = "Billing Order API")
@ApiResource(path = "/")
@Slf4j
public class OrderController {

    @Resource
    private IMemberService iMemberService;

    @Resource
    private IOrderV2Service iOrderV2Service;

    @GetResource(path = "/orders", requiredPermission = false)
    @ApiOperation(value = "fetch order list", notes = "fetch order list", hidden = true)
    public ResponseData<OrderDetailVo> fetchOrderPageList() {
        return ResponseData.success(null);
    }

    @GetResource(path = "/orders/{orderId}", requiredPermission = false)
    @ApiOperation(value = "获取订单详情", notes = "fetch order detail by id")
    public ResponseData<OrderDetailVo> fetchOrderById(@PathVariable("orderId") String orderId) {
        return ResponseData.success(iOrderV2Service.getOrderDetailByOrderId(orderId));
    }

    @PostResource(path = "/orders/dryRun/generate", requiredPermission = false)
    @ApiOperation(value = "试运行订单", notes = "根据订阅变更类型(新订阅、订阅续订、订阅变更、订阅取消),预览系统未来即将生成的订单")
    public ResponseData<OrderPreview> generateDryRunOrder(@RequestBody @Valid DryRunOrderArgs dryRunOrderArgs) {
        if (dryRunOrderArgs.getAction() != null) {
            if (DryRunAction.START_BILLING.name().equalsIgnoreCase(dryRunOrderArgs.getAction())) {
                verifyNonNullOrEmpty(dryRunOrderArgs.getProduct(), "DryRun subscription product should be specified");
                verifyNonNullOrEmpty(dryRunOrderArgs.getSeat(), "DryRun seat number should be specified");
                verifyNonNullOrEmpty(dryRunOrderArgs.getMonth(), "DryRun months should be specified");
            }
            else if (DryRunAction.RENEW.name().equalsIgnoreCase(dryRunOrderArgs.getAction())) {
                verifyNonNullOrEmpty(dryRunOrderArgs.getProduct(), "DryRun subscription product should be specified");
                verifyNonNullOrEmpty(dryRunOrderArgs.getMonth(), "DryRun months should be specified");
            }
            else if (DryRunAction.UPGRADE.name().equalsIgnoreCase(dryRunOrderArgs.getAction())) {
                verifyNonNullOrEmpty(dryRunOrderArgs.getProduct(), "DryRun subscription product should be specified");
                verifyNonNullOrEmpty(dryRunOrderArgs.getSeat(), "DryRun product seat number should be specified");
                verifyNonNullOrEmpty(dryRunOrderArgs.getMonth(), "DryRun months should be specified");
            }
        }
        // 生成预览订单
        DryRunArguments dryRunArguments = new DryRunArguments(dryRunOrderArgs);
        OrderPreview orderPreview = iOrderV2Service.triggerDryRunOrderGeneration(dryRunArguments);
        return ResponseData.success(orderPreview);
    }

    @PostResource(path = "/orders", requiredPermission = false)
    @ApiOperation(value = "创建订单")
    public ResponseData<OrderDetailVo> createOrder(@RequestBody @Valid CreateOrderRo data) {
        Long userId = SessionContext.getUserId();
        // 校验用户是否在此空间内
        iMemberService.checkUserIfInSpace(userId, data.getSpaceId());
        final OrderArguments orderArguments = new DefaultOrderArguments(data);
        String orderId = iOrderV2Service.createOrder(orderArguments);
        OrderDetailVo orderDetailVo = iOrderV2Service.getOrderDetailByOrderId(orderId);
        return ResponseData.success(orderDetailVo);
    }

    @PostResource(path = "/orders/{orderId}/payment", requiredPermission = false)
    @ApiOperation(value = "创建支付订单")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "orderId", value = "订单号", required = true, dataTypeClass = String.class, paramType = "path", example = "SILVER"),
    })
    public ResponseData<OrderPaymentVo> createOrderPayment(@PathVariable("orderId") String orderId, @RequestBody @Valid PayOrderRo data) {
        Long userId = SessionContext.getUserId();
        PayChannel channel = PayChannel.of(data.getPayChannel());
        if (channel == null) {
            // 支付方式错误
            throw new BusinessException(OrderException.PAY_CHANNEL_ERROR);
        }
        OrderPaymentVo orderPaymentVo = iOrderV2Service.createOrderPayment(userId, orderId, channel);
        return ResponseData.success(orderPaymentVo);
    }

    @GetResource(path = "/orders/{orderId}/paid", requiredPermission = false)
    @ApiOperation(value = "获取订单支付状态", notes = "get order paid status when client polling")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "orderId", value = "订单号", required = true, dataTypeClass = String.class, paramType = "path", example = "SILVER"),
    })
    public ResponseData<PaymentOrderStatusVo> getOrderPaidStatus(@PathVariable("orderId") String orderId) {
        OrderStatus orderStatus = iOrderV2Service.getOrderStatusByOrderId(orderId);
        PaymentOrderStatusVo orderPaidStatusVo = new PaymentOrderStatusVo();
        orderPaidStatusVo.setStatus(orderStatus.getName());
        return ResponseData.success(orderPaidStatusVo);
    }

    @GetResource(path = "/orders/{orderId}/paidCheck", requiredPermission = false)
    @ApiOperation(value = "检查订单支付状态", notes = "check order paid status when client polling is longer")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "orderId", value = "订单号", required = true, dataTypeClass = String.class, paramType = "path", example = "SILVER"),
    })
    public ResponseData<PaymentOrderStatusVo> checkOrderPaidStatus(@PathVariable("orderId") String orderId) {
        OrderStatus orderStatus = iOrderV2Service.checkOrderStatus(orderId);
        PaymentOrderStatusVo orderPaidStatusVo = new PaymentOrderStatusVo();
        orderPaidStatusVo.setStatus(orderStatus.getName());
        return ResponseData.success(orderPaidStatusVo);
    }
}
