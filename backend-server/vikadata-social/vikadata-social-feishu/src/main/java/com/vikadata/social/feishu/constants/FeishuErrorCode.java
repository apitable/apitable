package com.vikadata.social.feishu.constants;

/**
 * 飞书业务错误码
 * @author Shawn Deng
 * @date 2021-07-07 15:50:50
 */
public class FeishuErrorCode {

    /**
     * 企业不存在
     */
    public static final int TENANT_EXIST = 1184000;

    /**
     * 无权限获取企业信息
     */
    public static final int GET_TENANT_DENIED = 1184001;

    /**
     * 没有用户权限
     */
    public static final int NO_USER_AUTHORITY_ERROR = 41050;

    /**
     * 内部错误
     */
    public static final int INTERNAL_ERROR = 40003;

    /**
     * 部门未授权
     */
    public static final int NO_DEPT_AUTHORITY_ERROR = 40004;
}
