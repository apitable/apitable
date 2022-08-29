package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p> 
 * 获取内购订单信息
 * </p> 
 * @author zoe zheng 
 * @date 2021/10/27 19:44
 */
@Setter
@Getter
@ToString
public class DingTalkInternalOrderRequest {
    /**
     * 内购商品订单号
     */
    private Long bizOrderId;
}
