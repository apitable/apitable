package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * 组件相关异常状态码
 * 状态码范围（460-）
 *
 * @author Chambers
 * @since 2020/12/23
 */
@Getter
@AllArgsConstructor
public enum WidgetException implements BaseException {

    /**
     * 组件包不存在或未上线
     */
    WIDGET_PACKAGE_NOT_EXIST(460, "组件包不存在或未上线"),

    /**
     * 组件不存在
     */
    WIDGET_NOT_EXIST(461, "组件不存在"),

    /**
     * 组件所在的空间不一致
     */
    WIDGET_SPACE_ERROR(462, "组件所在的空间不一致"),

    /**
     * 组件引用的维格表不存在，复制失败
     */
    WIDGET_DATASHEET_NOT_EXIST(462, "组件引用的维格表不存在，复制失败"),

    /**
     * 组件数量已到达上限，创建失败
     */
    WIDGET_NUMBER_LIMIT(462, "组件数量已到达上限，创建失败"),

    /**
     * 小程序创建失败，创建参数不完整
     */
    CREATE_FAIL_INCOMPLETE_PARAME(463, "小程序创建失败，创建参数不完整"),

    /**
     * 小程序创建失败，发布类型错误
     */
    CREATE_FAIL_RELEASE_TYPE_ERROR(464, "小程序创建失败，发布类型错误"),

    /**
     * 小程序创建失败，name重复
     */
    @Deprecated
    CREATE_FAIL_PACKAGE_NAME_REPEAT(465, "小程序创建失败，name重复"),

    /**
     * 小程序创建失败，packageId重复
     */
    CREATE_FAIL_CUSTOM_PACKAGEID_REPEAT(466, "小程序创建失败，packageId重复"),

    /**
     * 操作失败，组件已封禁
     */
    WIDGET_BANNED(467, "操作失败，组件已封禁"),

    /**
     * 小程序发布失败，组件已禁用请联系GM
     */
    RELEASES_FAIL_WIDGET_DISABLED(468, "小程序发布失败，组件已禁用请联系GM"),

    /**
     * 小程序发布失败，版本号不符合规范
     */
    RELEASES_FAIL_VERSION_NUM_ERROR(469, "小程序发布失败，版本号不符合规范"),

    /**
     * 小程序发布失败，版本号重复
     */
    RELEASES_FAIL_VERSION_NUM_REPEAT(470, "小程序发布失败，版本号重复"),

    /**
     * 小程序发布失败，版本号不符合规范
     */
    ROLLBACK_FAIL_VERSION_NUM_ERROR(471, "小程序回滚失败，版本号不符合规范"),

    /**
     * 小程序回滚失败，回滚版本号错误或未通过审核
     */
    ROLLBACK_FAIL_SELECT_VERSION_ERROR(472, "小程序回滚失败，回滚版本号错误或未通过审核"),

    /**
     * 小程序发布失败，创建参数不完整
     */
    RELEASES_FAIL_INCOMPLETE_PARAME(473, "小程序发布失败，发布参数不完整"),

    /**
     * en-US is required
     */
    EN_US_REQUIRED(474, "en-US is required"),

    /**
     * 小程序提交失败，创建参数不完整
     */
    SUBMIT_FAIL_INCOMPLETE_PARAME(475, "小程序提交失败，提交参数不完整"),

    /**
     * 小程序提交失败，版本号不符合规范
     */
    SUBMIT_FAIL_VERSION_NUM_ERROR(476, "小程序提交失败，版本号不符合规范"),

    /**
     * 小程序提交失败，版本号重复
     */
    SUBMIT_FAIL_VERSION_NUM_REPEAT(477, "小程序提交失败，版本号重复"),

    /**
     * 空间站小程序，无法执行submit
     */
    SUBMIT_FAIL_NO_SUBMIT_METHOD(478, "空间站小程序，无法执行submit"),

    /**
     * 申请全局小程序ID失败，请稍后再试
     */
    ISSUED_GLOBAL_ID_FAIL(479, "申请全局小程序ID失败，请稍后再试"),

    /**
     * 小程序资质认证数据无法重复审核
     */
    WIDGET_AUTH_DATA_AUDIT_FAIL(480, "小程序资质认证数据无法重复审核"),

    /**
     * 审核备注不能为空
     */
    AUDIT_REASON_NOT_EMPTY(481, "审核备注不能为空"),

    /**
     * 小程序版本数据无法重复审核
     */
    WIDGET_VERSION_DATA_AUDIT_FAIL(482, "小程序版本数据无法重复审核"),

    /**
     * 审核提交的版本不存在
     */
    AUDIT_SUBMIT_VERSION_NOT_EXIST(483, "Submit Version Not Exist"),
    ;

    private final Integer code;

    private final String message;
}
