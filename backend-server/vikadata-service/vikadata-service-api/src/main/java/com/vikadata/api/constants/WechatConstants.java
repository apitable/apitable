package com.vikadata.api.constants;

/**
 * <p>
 * 微信相关常量定义
 * </p>
 *
 * @author Chambers
 * @date 2020/02/21
 */
public class WechatConstants {

    /**
     * 小程序码/二维码有效时间（单位：秒）
     */
    public static final int TIMEOUT = 10 * 60;

    /**
     * 同个ip一小时的最大获取次数
     */
    public static final int MAX_COUNT = 5;

    /**
     * PC 登录、帐号绑定二维码 唯一标识前缀
     */
    public static final String MARK_PRE = "mark_";

    /**
     * 未关注公众号 扫描二维码事件 KEY 值 唯一标识前缀
     */
    public static final String QR_SCENE_PRE = "qrscene_";

    /**
     * 带参数的二维码自定义回复 唯一标识前缀
     */
    public static final String REPLY_QRSCENE_PRE = "qrcode_scene_";

    /**
     * 带参数的二维码触发活动V币 唯一标识后缀
     */
    public static final String ACTIVITY_CODE_SUF = "_activity_code";
}
