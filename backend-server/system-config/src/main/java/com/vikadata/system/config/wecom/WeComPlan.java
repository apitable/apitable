package com.vikadata.system.config.wecom;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 企业微信付费方案
 * </p>
 * @author 刘斌华
 * @date 2022-04-29 18:53:17
 */
@Setter
@Getter
public class WeComPlan {

    /**
     * 企微商品版本 ID
     */
    private String id;

    /**
     * 价格列表适用的订阅方案列表
     */
    private List<String> billingPlanId;

    /**
     * 是否为免费试用版本
     */
    private boolean trial;

}
