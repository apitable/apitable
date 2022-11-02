package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * Social Exception
 *
 * @author Shawn Deng
 */
@Getter
@AllArgsConstructor
public enum SocialException implements BaseException {

    SPACE_HAS_BOUND_TENANT(1104, "Space is already bound to other tenants"),

    TENANT_BIND_FAIL(1105, "Enterprise binding space failed"),

    TENANT_NOT_BIND_SPACE(1106, "The company has not yet bound the space"),

    TENANT_NOT_EXIST(1107, "Tenant does not exist"),

    USER_NOT_AUTH(1108, "Unauthorized login"),

    USER_NOT_EXIST(1109, "Tenant user not authorized"),

    USER_NOT_EXIST_WECOM(1109, "The tenant user is not authorized, please contact the administrator to synchronize the address book and try the operation"),

    USER_NOT_BIND_FEISHU(1110, "User not bound"),

    USER_NOT_BIND_WECOM(1110, "User not bound"),

    ONLY_TENANT_ADMIN_BOUND_ERROR(1113, "Only administrators can operate"),

    TENANT_DISABLED(1114, "Tenant deactivation"),

    GET_USER_INFO_ERROR(1115, "Failed to get user information"),

    TENANT_APP_HAS_BIND_SPACE(1116, "The application has bound the space"),

    APP_HAS_BIND_SPACE(1116, "This app has been bound by another space, please change the app"),

    TENANT_APP_BIND_INFO_NOT_EXISTS(1117, "App binding information does not exist"),

    TENANT_APP_IS_HIDDEN(1118, "App not published"),

    GET_AGENT_CONFIG_ERROR(1119, "Failed to get app configuration"),

    AGENT_CONFIG_DISABLE(1120, "App configuration disabled"),

    UNBOUND_WECOM(1121, "The space is not bound to corporate WeChat"),

    EXCLUSIVE_DOMAIN_UNBOUND(1122, "Exclusive domain name is not bound"),

    USER_NOT_VISIBLE_WECOM(1123, "The user is not within the visible range of the application, please do it after the enterprise WeChat has been adjusted"),

    DING_TALK_DA_SIGNATURE_ERROR(1124, "DingTalk signature verification failed"),

    DING_TALK_DA_NOT_BIND(1125, "Not open Dingtalk DA"),

    DING_TALK_DA_TEMPLATE_NOT_EXITS(1126, "DingTalk template does not exist"),

    DING_TALK_DA_TENANT_NOT_EXITS(1127, "The enterprise has not installed the main app"),

    DING_TALK_INTERNAL_GOODS_NOT_EXITS(1128, "Incorrect app product data"),

    DING_TALK_INTERNAL_GOODS_ERROR(1129, "Failed to get product SKU page"),

    DING_TALK_DD_CONFIG_ERROR(1130, "Signing failed"),

    CONTACT_SYNCING(1131, "Contacts are syncing"),

    WECOM_ISV_PERMIT_API_ERROR(1132, "Interface permission request exception"),

    WECOM_ISV_PERMIT_ORDER_INVALID(1133, "Interface license order is invalid"),

    WECOM_ISV_PERMIT_UN_NEEDED(1134, "No users need to activate");

    private final Integer code;

    private final String message;
}
