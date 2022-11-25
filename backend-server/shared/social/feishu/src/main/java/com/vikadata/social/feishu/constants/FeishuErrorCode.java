package com.vikadata.social.feishu.constants;

/**
 * Feishu business error code
 */
public class FeishuErrorCode {

    /**
     * tenant does not exist
     */
    public static final int TENANT_EXIST = 1184000;

    /**
     * No access to company information
     */
    public static final int GET_TENANT_DENIED = 1184001;

    /**
     * no user rights
     */
    public static final int NO_USER_AUTHORITY_ERROR = 41050;

    /**
     * internal error
     */
    public static final int INTERNAL_ERROR = 40003;

    /**
     * Department not authorized
     */
    public static final int NO_DEPT_AUTHORITY_ERROR = 40004;
}
