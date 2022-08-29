package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * 第三方集成异常集合
 *
 * @author Shawn Deng
 * @date 2020-12-02 18:34:57
 */
@Getter
@AllArgsConstructor
public enum SocialException implements BaseException {

    /**
     * 飞书授权失败
     */
    FEISHU_AUTH_CODE_ERROR(1100, "飞书授权失败"),

    /**
     * 只有飞书应用管理员可以校验企业是否绑定空间站
     */
    FEISHU_TENANT_BIND_DETAIL_REJECT(1101, "只有飞书应用管理员可以绑定空间站"),

    /**
     * 未知的租户类型
     */
    UNKNOWN_TENANT_TYPE(1102, "未知的租户类型"),

    /**
     * 不是飞书的租户
     */
    NOT_FEISHU_TENANT(1103, "不是飞书的企业"),

    /**
     * 应用已绑定空间站
     */
    FEISHU_TENANT_HAS_BOUND(1104, "企业已绑定空间站"),

    /**
     * 空间已经绑定了其他租户
     */
    SPACE_HAS_BOUND_TENANT(1104, "空间已经绑定了其他租户"),

    /**
     * 应用绑定失败
     */
    TENANT_BIND_FAIL(1105, "企业绑定空间失败"),

    /**
     * 企业尚未绑定空间
     */
    TENANT_NOT_BIND_SPACE(1106, "企业尚未绑定空间"),

    /**
     * 租户不存在
     */
    TENANT_NOT_EXIST(1107, "租户不存在"),

    /**
     * 未授权登录
     */
    USER_NOT_AUTH(1108, "未授权登录"),

    /**
     * 租户用户未授权
     */
    USER_NOT_EXIST(1109, "租户用户未授权"),

    /**
     * 租户用户未授权, 请联系管理员同步通讯录后再尝试操作
     */
    USER_NOT_EXIST_WECOM(1109, "租户用户未授权, 请联系管理员同步通讯录后在尝试操作"),

    /**
     * 用户未绑定 - 飞书
     */
    USER_NOT_BIND_FEISHU(1110, "用户未绑定"),

    /**
     * 用户未绑定 - 企业微信
     */
    USER_NOT_BIND_WECOM(1110, "用户未绑定"),

    /**
     * 手机号在同租户内只能绑定一个账号
     */
    USER_BIND_SAME_TENANT(1111, "手机号在同租户内只能绑定一个账号"),

    /**
     * 租户的用户未授权访问
     */
    TENANT_USER_NOT_AUTH(1112, "租户的用户未授权访问"),

    /**
     * 只有管理员可以操作
     */
    ONLY_TENANT_ADMIN_BOUND_ERROR(1113, "只有管理员可以操作"),

    /**
     * 租户已停用
     */
    TENANT_DISABLED(1114, "租户停用"),

    /**
     * 获取用户信息失败
     */
    GET_USER_INFO_ERROR(1115, "获取用户信息失败"),

    /**
     * 获取用户信息失败
     */
    TENANT_APP_HAS_BIND_SPACE(1116, "应用已经绑定了空间"),

    /**
     * 该应用已被其他空间站绑定，请更换应用
     */
    APP_HAS_BIND_SPACE(1116, "该应用已被其他空间站绑定，请更换应用"),

    /**
     * 应用绑定信息不存在
     */
    TENANT_APP_BIND_INFO_NOT_EXISTS(1117, "应用绑定信息不存在"),

    /**
     * 应用未发布
     */
    TENANT_APP_IS_HIDDEN(1118, "应用未发布"),

    /**
     * 获取应用配置失败
     */
    GET_AGENT_CONFIG_ERROR(1119, "获取应用配置失败"),

    /**
     * 应用配置已停用
     */
    AGENT_CONFIG_DISABLE(1120, "应用配置已停用"),

    /**
     * 空间站未绑定企业微信
     */
    UNBOUND_WECOM(1121, "空间站未绑定企业微信"),

    /**
     * 专属域名未绑定
     */
    EXCLUSIVE_DOMAIN_UNBOUND(1122, "专属域名未绑定"),

    /**
     * 该用户不在应用可见范围内，请在企业微信调整后再操作
     */
    USER_NOT_VISIBLE_WECOM(1123, "该用户不在应用可见范围内，请在企业微信调整后再操作"),

    /**
     * 钉钉搭签名校验失败
     */
    DING_TALK_DA_SIGNATURE_ERROR(1124, "钉钉搭签名校验失败"),
    /**
     * 未开通钉钉搭
     */
    DING_TALK_DA_NOT_BIND(1125, "未开通钉钉搭"),
    /**
     * 钉钉搭模版不存在
     */
    DING_TALK_DA_TEMPLATE_NOT_EXITS(1126, "钉钉搭模版不存在"),
    /**
     * 钉钉搭尚未安装主应用
     */
    DING_TALK_DA_TENANT_NOT_EXITS(1127, "企业尚未安装主应用"),
    /**
     * 应用商品数据不正确
     */
    DING_TALK_INTERNAL_GOODS_NOT_EXITS(1128, "应用商品数据不正确"),

    /**
     * 获取商品SKU页面失败
     */
    DING_TALK_INTERNAL_GOODS_ERROR(1129, "获取商品SKU页面失败"),

    /**
     * 生成ddconfig 参数失败
     */
    DING_TALK_DD_CONFIG_ERROR(1130, "签名失败"),

    /**
     * 通讯录正在同步
     */
    CONTACT_SYNCING(1131, "通讯录正在同步"),

    /**
     * 接口许可请求异常
     */
    WECOM_ISV_PERMIT_API_ERROR(1132, "接口许可请求异常"),

    /**
     * 接口许可订单无效
     */
    WECOM_ISV_PERMIT_ORDER_INVALID(1133, "接口许可订单无效"),

    /**
     * 没有用户需要激活
     */
    WECOM_ISV_PERMIT_UN_NEEDED(1134, "没有用户需要激活");

    private final Integer code;

    private final String message;
}
