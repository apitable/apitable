package com.vikadata.social.wecom.exception;

/**
 * <p>
 * 企业微信SDK异常状态码常量
 * </p>
 * @author Pengap
 * @date 2021/8/3 14:42:16
 */
public class WeComExceptionConstants {
    /**
     * default message
     */
    public static final String UNKNOWN_ERROR_MESSAGE = "未知的异常";

    /**
     * 未知异常
     */
    public static final int UNKNOWN_EXCEPTION_ERR_CODE = 20000;

    /**
     * 申请企业微信域名异常
     */
    public static final int APPLY_ENP_DOMAIN_ERR_CODE = 20001;

    /**
     * 删除企业微信域名异常
     */
    public static final int DELETE_ENP_DOMAIN_ERR_CODE = 20002;

    /**
     * 校验企业微信域名异常
     */
    public static final int CHECK_ENP_DOMAIN_ERR_CODE = 20003;

}
