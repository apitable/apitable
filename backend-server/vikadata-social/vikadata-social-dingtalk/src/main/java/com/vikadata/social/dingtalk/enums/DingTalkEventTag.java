package com.vikadata.social.dingtalk.enums;

import java.util.Arrays;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 钉钉订阅事件
 * </p>
 * @author zoe zheng
 * @date 2021/5/12 7:48 下午
 */
@Getter
@AllArgsConstructor
public enum DingTalkEventTag {
    /**
     * 自定义默认值。
     */
    DEFAULT("default"),
    /**
     * 通讯录用户增加。
     */
    USER_ADD_ORG("user_add_org"),

    /**
     * 通讯录用户更改
     */
    USER_MODIFY_ORG("user_modify_org"),
    /**
     * 通讯录用户离职
     */
    USER_LEAVE_ORG("user_leave_org"),
    /**
     *
     * 加入企业后用户激活
     */
    USER_ACTIVATE_ORG("user_active_org"),
    /**
     * 通讯录用户被设为管理员
     */
    ORG_ADMIN_ADD("org_admin_add"),
    /**
     * 通讯录用户被取消设置管理员
     */
    ORG_ADMIN_REMOVE("org_admin_remove"),
    /**
     * 通讯录企业部门创建
     */
    ORG_DEPT_CREATE("org_dept_create"),
    /**
     * 通讯录企业部门修改。
     */
    ORG_DEPT_MODIFY("org_dept_modify"),
    /**
     * 通讯录企业部门删除。
     */
    ORG_DEPT_REMOVE("org_dept_remove"),
    /**
     * 企业被解散。
     */
    ORG_REMOVE("org_remove"),

    ORG_CHANGE("org_change"),

    LABEL_USER_CHANGE("label_user_change"),

    LABEL_CONF_ADD("label_conf_add"),

    LABEL_CONF_DEL("label_conf_del"),

    LABEL_CONF_MODIFY("label_conf_modify"),

    CHECK_URL("check_url"),
    /**
     * 验证回调地址有效性
     */
    CHECK_CREATE_SUITE_URL("check_create_url"),
    /**
     * 验证更新的回调地址有效性
     */
    CHECK_UPDATE_SUITE_URL("check_update_suite_url"),
    /**
     * 高优先级数据，激活应用等
     */
    SYNC_HTTP_PUSH_HIGH("SYNC_HTTP_PUSH_HIGH"),
    /**
     * 普通优先级数据，例如通讯录变更
     */
    SYNC_HTTP_PUSH_MEDIUM("SYNC_HTTP_PUSH_MEDIUM");

    private final String value;

    public String getValue() {
        return value;
    }

    public static DingTalkEventTag toEnum(String value) {
        for (DingTalkEventTag enums : DingTalkEventTag.values()) {
            if (enums.value.equals(value)) {
                return enums;
            }
        }
        return null;
    }

    /**
     * 获取基本事件
     *
     * @return List<DingTalkEvent>
     * @author zoe zheng
     * @date 2021/5/12 8:03 下午
     */
    public static List<String> baseEvent() {
        return Arrays.asList(USER_ADD_ORG.getValue(), USER_MODIFY_ORG.getValue(), USER_LEAVE_ORG.getValue(),
                USER_ACTIVATE_ORG.getValue(), ORG_ADMIN_ADD.getValue(), ORG_ADMIN_REMOVE.getValue(),
                ORG_DEPT_CREATE.getValue(), ORG_DEPT_MODIFY.getValue(), ORG_DEPT_REMOVE.getValue(),
                ORG_REMOVE.getValue());
    }

    public static Boolean isSyncHttpEvent(DingTalkEventTag tag) {
        return tag.equals(SYNC_HTTP_PUSH_HIGH) || tag.equals(SYNC_HTTP_PUSH_MEDIUM);
    }

    public static Boolean shouldHandleSyncHttpEvent(DingTalkEventTag tag) {
        return !tag.equals(CHECK_URL) && !tag.equals(CHECK_UPDATE_SUITE_URL) && !tag.equals(CHECK_CREATE_SUITE_URL);
    }
}
