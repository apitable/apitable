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
public class DingTalkSkuPageRequest {
    /**
     * 内购商品码。
     */
    private String goodsCode;

    /**
     * 回调页面(进行URLEncode处理)，微应用为页面URL，E应用为页面路径地址。
     * 注意 http模式下页面地址需要和应用的主域名地址保持一致不然无法跳转。
     */
    private String callbackPage;

    /**
     * 调用方自定义扩展参数，主要用于用户页面引导等操作，不能作为权益开通凭证。
     * 如果传入该值，会在订单消息推送时会推送过去。
     */
    private String extendParam;

}
