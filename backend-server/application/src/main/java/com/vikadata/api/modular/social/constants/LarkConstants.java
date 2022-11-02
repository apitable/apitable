package com.vikadata.api.modular.social.constants;

/**
 *  Lark constant definition
 * @author Shawn Deng
 * @date 2022-02-08 10:25:57
 */
public class LarkConstants {

    public static final String DEFAULT_WORKBENCH_URL = "/workbench";

    public static final String SPACE_WORKBENCH_URL = "/space/%s/workbench";

    public static String formatSpaceWorkbenchUrl(String spaceId) {
        return String.format(SPACE_WORKBENCH_URL, spaceId);
    }

    public static final String ISV_ENTRY_URL = "/api/v1/social/feishu/entry";

    public static final String INTERNAL_ENTRY_URL = "/api/v1/lark/idp/entry/%s";

    public static String formatInternalEntryUrl(String appInstanceId) {
        return String.format(INTERNAL_ENTRY_URL, appInstanceId);
    }

    public static final String INTERNAL_LOGIN_URL = "/api/v1/lark/idp/login/%s";

    public static String formatInternalLoginUrl(String appInstanceId) {
        return String.format(INTERNAL_LOGIN_URL, appInstanceId);
    }

    public static final String INTERNAL_EVENT_URL = "/api/v1/lark/event/%s";

    public static String formatInternalEventUrl(String appInstanceId) {
        return String.format(INTERNAL_EVENT_URL, appInstanceId);
    }

    public static final String CONTACT_SYNCING_URL = "/user/lark/integration/sync/%s";

    public static String formatContactSyncingUrl(String appInstanceId) {
        return String.format(CONTACT_SYNCING_URL, appInstanceId);
    }

    public static final String CONFIG_ERROR_URL = "/user/lark/config/error";
}
