package com.vikadata.api.shared.constants;

/**
 * <p>
 * wechat constants
 * </p>
 *
 * @author Chambers
 */
public class WechatConstants {

    /**
     * miniapp qrcode timeout（unit：second）
     */
    public static final int TIMEOUT = 10 * 60;

    /**
     * PC qrcode unique prefix
     */
    public static final String MARK_PRE = "mark_";

    /**
     * scan qrcode unique prefix
     */
    public static final String QR_SCENE_PRE = "qrscene_";

    /**
     * qrcode with parameter unique prefix
     */
    public static final String REPLY_QRSCENE_PRE = "qrcode_scene_";

    /**
     * qrcode with parameter trigger vcode
     */
    public static final String ACTIVITY_CODE_SUF = "_activity_code";
}
