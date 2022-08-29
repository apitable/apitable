package com.vikadata.api.enums.wechat;

/**
 * <p>
 * 微信公众号 二维码类型
 * </p>
 *
 * @author Chambers
 * @date 2020/8/5
 */
public enum WechatMpQrcodeType {

    /**
     * 临时的整型参数值
     */
    QR_SCENE,

    /**
     * 临时的字符串参数值
     */
    QR_STR_SCENE,

    /**
     * 永久的整型参数值
     */
    QR_LIMIT_SCENE,

    /**
     * 永久的字符串参数值
     */
    QR_LIMIT_STR_SCENE
}
