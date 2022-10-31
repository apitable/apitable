package com.vikadata.social.dingtalk.exception;

/**
 * @author Shawn Deng
 * @date 2020-12-02 11:48:58
 */
public class DingTalkExceptionConstants {
    /**
     * default message
     */
    public static final String UNKNOWN_ERROR_MESSAGE = "Unknown Exception";

    /**
     * Unknown exception
     */
    public static final int UNKNOWN_EXCEPTION_ERR_CODE = 10000;

    /**
     * ip is not in the whitelist
     */
    public static final int INVALID_IP = 60020;

    /**
     * The suite ticket parameter is invalid
     */
    public static final int INVALID_SUITE_TICKET = 853005;

    public static final int INVALID_ACCESS_TOKEN = 40014;

    public static final int INVALID_SIGN = 853004;

    /**
     * The micro application corresponding to agentid does not exist
     */
    public static final int INVALID_AGENT_ID = 70003;

    /**
     * There is no micro application corresponding to the agentid under the enterprise
     */
    public static final int INVALID_CORP_AGENT_ID = 70004;

    /**
     * App disabled
     */
    public static final int DING_TALK_APP_STOPED = 50003;

    /**
     * Send a notification that the number of users exceeds the limit
     */
    public static final int MESSAGE_USER_EXCEED_LIMIT = 70000;

    /**
     * API frequency limit Each application, for each authorized enterprise, call each interface, the maximum frequency is 1000 minutes
     */
    public static final int ISV_API_MAX_LIMIT_MINUTES = 90014;

    /**
     * API frequency limit Each application, for each authorized enterprise, call each interface, the maximum frequency is 40 times per second
     */
    public static final int ISV_API_MAX_LIMIT_SECONDS = 90019;

    /**
     * errcode = 88, indicating that the request failed, you need to pay attention to the sub_code and sub_msg in the returned result.
     * In such cases, the user's access_token is generally invalid or the user does not have the right to call the interface.
     */
    public static final int SUB_CODE_REQUEST_ERROR = 88;

}
