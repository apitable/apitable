package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p> 
 * 获取内购商品SKU页面地址
 * </p> 
 * @author zoe zheng 
 * @date 2021/10/25 17:25
 */
@Setter
@Getter
@ToString
public class DingTalkSkuPageResponse extends BaseResponse {
    /**
     * 内购商品SKU页面地址。
     */
    private String result;
}
