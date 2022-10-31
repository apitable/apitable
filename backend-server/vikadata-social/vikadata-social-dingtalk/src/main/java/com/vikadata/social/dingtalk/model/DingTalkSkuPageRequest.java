package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Get the SKU page address of in-app purchase products
 */
@Setter
@Getter
@ToString
public class DingTalkSkuPageRequest {
    /**
     * goods in app purchase code
     */
    private String goodsCode;

    /**
     * Callback page (URLEncode processing), the micro application is the page URL,
     * and the E application is the page path address.
     * Note that the page address in http mode needs to be the same as the application's main domain name address,
     * otherwise it cannot be redirected.
     */
    private String callbackPage;

    /**
     * The caller customizes the extended parameters, which are mainly used for user page guidance and other operations,
     * and cannot be used as a certificate of rights and interests. If this value is passed in,
     * it will be pushed when the order message is pushed.
     */
    private String extendParam;

}
