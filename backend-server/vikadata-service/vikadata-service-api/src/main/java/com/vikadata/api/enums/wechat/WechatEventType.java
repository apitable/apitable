package com.vikadata.api.enums.wechat;

/**
 * <p>
 * 微信事件类型
 * </p>
 *
 * @author Benson Cheung
 * @date 2020/07/27 16:48
 */
public enum WechatEventType {

    /**
     * 关注事件
     */
    SUBSCRIBE,

    /**
     * 取消关注事件
     */
    UNSUBSCRIBE,

    /**
     * 扫描带参数二维码事件
     */
    SCAN,

    /**
     * 地理位置事件
     */
    LOCATION,

    /**
     * 自定义菜单事件
     */
    CLICK,

    /**
     * 点击菜单跳转链接
     */
    VIEW

}
