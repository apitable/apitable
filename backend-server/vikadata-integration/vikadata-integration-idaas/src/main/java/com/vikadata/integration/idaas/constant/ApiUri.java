package com.vikadata.integration.idaas.constant;

/**
 * <p>
 * interface path
 * </p>
 *
 */
public final class ApiUri {

    /**
     * open the tenant
     */
    public static final String TENANT = "/api/v3/tenant";

    /**
     * generate tenant Key
     */
    public static final String SERVICE_ACCOUNT = "/api/v3/service_account?tenantName={tenantName}";

    /**
     * get a list of people
     */
    public static final String USERS = "/contacts/api/v1/users";

    /**
     * get the list of people under the application
     */
    public static final String APP_USERS = "/api/v1/{tenantId}/appinstances/{clientId}/objects";

    /**
     * get the user group list
     */
    public static final String GROUPS = "/contacts/api/v1/groups";

    /**
     * obtain the user group list of the application
     */
    public static final String APP_GROUPS = "/api/v1/{tenantId}/appinstances/{clientId}/permissiongroups";

    private ApiUri() {
        throw new AssertionError();
    }

}
