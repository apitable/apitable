package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * 订单异常
 * 1400 - 1499
 * @author Shawn Deng
 * @date 2022-02-16 13:11:55
 */
@Getter
@AllArgsConstructor
public enum OrderException implements BaseException {

    PRODUCT_NOT_EXIST(1400, "产品类型不存在"),
    PLAN_NOT_EXIST(1401, "付费方案不存在"),
    ORDER_NOT_EXIST(1402, "订单不存在"),
    ORDER_HAS_CANCELED(1403, "订单已取消"),
    ORDER_HAS_PAID(1404, "订单已支付"),

    PAY_ORDER_FAIL(1405, "支付订单失败"),
    PAY_CHANNEL_ERROR(1406, "支付方式错误"),
    SPACE_HAS_ORDER(1407, "当前空间站已付费，请回到空间站驾驶舱刷新页面查看"),

    ORDER_EXCEPTION(1408, "订单异常"),

    PAYMENT_ORDER_NOT_EXIST(1409, "支付订单不存在"),
    NOT_ALLOW_DOWNGRADE(1410, "不允许订阅降级"),
    REPEAT_NEW_BUY_ORDER(1411, "新购订单重复"),
    ORDER_REQUEST_ERROR(1412, "请求订单无效");


    private final Integer code;

    private final String message;
}
