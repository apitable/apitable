package com.vikadata.social.dingtalk.constants;

/**
 * <p>
 * 企业内部应用--接口地址
 * </p>
 *
 * @author Benson Cheung
 * @date 2020/03/20 20:28
 */
public class DingTalkCorpApiConst {

    /**
     * 基础URL
     */
    private static final String DEFAULT_BASE_URL = "https://oapi.dingtalk.com";

    /**
     * 获取企业凭证
     */
    public static final String GET_ACCESS_TOKEN = DEFAULT_BASE_URL + "/gettoken";

    /**
     * 获取用户userId信息
     */
    public static final String GET_USER_ID = DEFAULT_BASE_URL + "/user/getuserinfo";

    /**
     * 获取用户userInfo信息
     */
    public static final String GET_USER_INFO = DEFAULT_BASE_URL + "/user/get";

    /**
     * 发送群消息
     */
    public static final String CHAT_SEND = DEFAULT_BASE_URL + "/chat/send";
}
