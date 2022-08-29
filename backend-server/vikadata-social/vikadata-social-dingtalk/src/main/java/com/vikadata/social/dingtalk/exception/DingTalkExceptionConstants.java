package com.vikadata.social.dingtalk.exception;

/**
 * @author Shawn Deng
 * @date 2020-12-02 11:48:58
 */
public class DingTalkExceptionConstants {
    /**
     * default message
     */
    public static final String UNKNOWN_ERROR_MESSAGE = "未知的异常";

    /**
     * 未知异常
     */
    public static final int UNKNOWN_EXCEPTION_ERR_CODE = 10000;

    /**
     * ip不在白名单中
     */
    public static final int INVALID_IP = 60020;

    /**
     * 套件ticket参数无效
     */
    public static final int INVALID_SUITE_TICKET = 853005;

    public static final int INVALID_ACCESS_TOKEN = 40014;

    public static final int INVALID_SIGN = 853004;

    /**
     * agentid对应微应用不存在
     */
    public static final int INVALID_AGENT_ID = 70003;

    /**
     * 企业下没有对应该agentid的微应用
     */
    public static final int INVALID_CORP_AGENT_ID = 70004;

    /**
     * 应用已停用
     */
    public static final int DING_TALK_APP_STOPED = 50003;

    /**
     * 发送通知用户人数超出限制
     */
    public static final int MESSAGE_USER_EXCEED_LIMIT = 70000;

    /**
     * api频率限制 每个应用，对每个授权企业，调用每个接口，最高频率1000次/分
     */
    public static final int ISV_API_MAX_LIMIT_MINUTES = 90014;

    /**
     * api频率限制 每个应用，对每个授权企业，调用每个接口，最高频率40次/秒
     */
    public static final int ISV_API_MAX_LIMIT_SECONDS = 90019;

    /**
     * errcode = 88，表示请求失败，需要关注下返回结果里的sub_code和sub_msg。此类情况下，一般是用户的access_token不合法或者没有调用该接口的权限。
     */
    public static final int SUB_CODE_REQUEST_ERROR = 88;

}
