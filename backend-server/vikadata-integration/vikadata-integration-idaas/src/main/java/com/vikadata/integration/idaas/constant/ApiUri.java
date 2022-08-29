package com.vikadata.integration.idaas.constant;

/**
 * <p>
 * 接口路径
 * </p>
 * @author 刘斌华
 * @date 2022-05-12 16:37:03
 */
public final class ApiUri {

    /**
     * 开通租户
     */
    public static final String TENANT = "/api/v3/tenant";

    /**
     * 生成租户密钥
     */
    public static final String SERVICE_ACCOUNT = "/api/v3/service_account?tenantName={tenantName}";

    /**
     * 获取人员列表
     */
    public static final String USERS = "/contacts/api/v1/users";

    /**
     * 获取应用下的人员列表
     */
    public static final String APP_USERS = "/api/v1/{tenantId}/appinstances/{clientId}/objects";

    /**
     * 获取用户组列表
     */
    public static final String GROUPS = "/contacts/api/v1/groups";

    /**
     * 获取应用下的用户组列表
     */
    public static final String APP_GROUPS = "/api/v1/{tenantId}/appinstances/{clientId}/permissiongroups";

    private ApiUri() {
        throw new AssertionError();
    }

}
