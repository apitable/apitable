package com.vikadata.social.dingtalk.constants;

/**
 * Enterprise internal application--interface address
 */
public class DingTalkCorpApiConst {

    /**
     * base URL
     */
    private static final String DEFAULT_BASE_URL = "https://oapi.dingtalk.com";

    /**
     * Get corporate credentials
     */
    public static final String GET_ACCESS_TOKEN = DEFAULT_BASE_URL + "/gettoken";

    /**
     * Get user user ID information
     */
    public static final String GET_USER_ID = DEFAULT_BASE_URL + "/user/getuserinfo";

    /**
     * Get user user Info information
     */
    public static final String GET_USER_INFO = DEFAULT_BASE_URL + "/user/get";

    /**
     * send group message
     */
    public static final String CHAT_SEND = DEFAULT_BASE_URL + "/chat/send";
}
