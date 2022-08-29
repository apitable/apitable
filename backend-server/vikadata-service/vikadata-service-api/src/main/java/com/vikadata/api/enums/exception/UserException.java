package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * <p>
 * 用户异常状态码
 * 状态码范围（300-399）
 * 手机（303）邮箱（304）密码（305）权限（310-319）第三方（320-329）
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/10/27 14:42
 */
@Getter
@AllArgsConstructor
public enum UserException implements BaseException {

    /**
     * 未知的登录方式
     */
    UNKNOWN_LOGIN(300, "登录方式不支持"),

    /**
     * 账户不存在或被禁用
     */
    USER_NOT_EXIST(300, "账户不存在或被禁用"),

    /**
     * 注册失败
     */
    REGISTER_FAIL(301, "注册失败"),

    /**
     * 注册邮箱格式错误
     */
    REGISTER_EMAIL_ERROR(301, "注册邮箱格式错误"),

    /**
     * 注册邮箱已绑定了其它帐号
     */
    REGISTER_EMAIL_HAS_EXIST(301, "注册邮箱已绑定了其它帐号"),

    /**
     * 该手机帐号已绑定了其它邮箱
     */
    MOBILE_HAS_BOUND_EMAIL(332, "该手机帐号已绑定了其它邮箱"),

    /**
     * 手机帐号绑定邮箱重复
     */
    MOBILE_BOUND_EMAIL_DUPLICATE(332, "手机帐号绑定邮箱重复"),

    /**
     * 帐号不能为空
     */
    ACCOUNT_EMPTY(302, "帐号不能为空"),

    /**
     * 用户名或密码错误
     */
    USERNAME_OR_PASSWORD_ERROR(302, "帐号或密码错误"),

    /**
     * 手机号码为空
     */
    MOBILE_EMPTY(303, "手机号码不能为空"),

    /**
     * 手机号输入有误
     */
    MOBILE_ERROR_FORMAT(303, "手机号输入有误"),

    /**
     * 该手机号未注册
     */
    MOBILE_NO_EXIST(303, "该手机号未注册"),

    /**
     * 该手机号已注册
     */
    MOBILE_HAS_REGISTER(303, "该手机号已注册"),

    /**
     * 页面已超时，请刷新
     */
    AUTH_INFO_NO_VALID(303, "页面已超时，请刷新"),

    /**
     * 该邮箱未绑定账号
     */
    EMAIL_NO_EXIST(304, "该邮箱未绑定账号"),

    /**
     * 该邮箱已被绑定
     */
    EMAIL_HAS_BIND(304, "该邮箱已被绑定"),

    /**
     * 密码为空
     */
    PASSWORD_EMPTY(305, "密码不能为空"),

    /**
     * 密码长度错误
     */
    PASSWORD_ERROR_LENGTH(305, "密码长度需为8-24位"),

    /**
     * 密码字符类型错误
     */
    PASSWORD_ERROR_TYPE(305, "密码格式只支持英文字母字符和数字"),

    /**
     * 密码格式错误
     */
    PASSWORD_ERROR_FORMAT(305, "密码格式需同时有字母和数字"),

    /**
     * 修改密码失败
     */
    MODIFY_PASSWORD_ERROR(305, "修改密码失败"),

    /**
     * 该账号已设置过密码，初始化失败
     */
    PASSWORD_HAS_SETTING(305, "该账号已设置过密码，初始化失败"),

    /**
     * 登录频繁
     */
    LOGIN_OFTEN(306, "操作频繁，请20分钟后再试"),

    /**
     * 登录失败
     */
    SIGN_IN_ERROR(306, "登录失败"),

    /**
     * 绑定邮箱失败
     */
    LINK_EMAIL_ERROR(306, "绑定邮箱失败"),

    /**
     * 用户未绑定邮箱
     */
    USER_NOT_BIND_EMAIL(307, "用户未绑定邮箱"),

    /**
     * 用户未绑定手机号
     */
    USER_NOT_BIND_PHONE(307, "用户未绑定手机号"),

    /**
     * 微信帐号不存在
     */
    WECHAT_NO_EXIST(320, "微信帐号不存在"),

    /**
     * 关联失败
     */
    LINK_FAILURE(320, "关联失败"),

    /**
     * 该微信帐号已绑定其他维格帐号，如需绑定当前帐号，请先解除与其他帐号绑定
     */
    WECHAT_LINK_OTHER(320, "该微信号已绑定了其它帐号，请更换"),

    /**
     * 该钉钉帐号已绑定其他维格帐号，如需绑定当前帐号，请先解除与其他帐号绑定
     */
    DINGTALK_LINK_OTHER(320, "该钉钉号已绑定了其它帐号，请更换"),

    /**
     * 该QQ帐号已绑定其他维格帐号，如需绑定当前帐号，请先解除与其他帐号绑定
     */
    TENCENT_LINK_OTHER(320, "该QQ号已绑定了其它帐号，请更换"),

    /**
     * 该QQ帐号已绑定其他维格帐号，如需绑定当前帐号，请先解除与其他帐号绑定
     */
    FEISHU_LINK_OTHER(320, "飞书账号已绑定了其它帐号，请更换"),

    /**
     * 当前微信尚无绑定的维格帐号
     */
    WECHAT_NO_LINK(321, "当前微信尚无绑定的维格帐号"),

    /**
     * 小程序码获取失败
     */
    MA_CODE_GET_ERROR(324, "小程序码获取失败"),

    /**
     * 刷新太过频繁，请稍后再试
     */
    REFRESH_MA_CODE_OFTEN(324, "刷新太过频繁，请稍后再试"),

    /**
     * 二维码获取失败
     */
    QR_CODE_GET_ERROR(324, "二维码获取失败"),

    /**
     * 场景值未设置
     */
    SCENE_EMPTY(324, "场景值未设置"),

    /**
     * 二维码已失效
     */
    QR_CODE_INVALID(325, "二维码已失效"),

    /**
     * 小程序码已失效
     */
    MA_CODE_INVALID(325, "小程序码已失效"),

    /**
     * 尚未被扫描
     */
    NOT_SCANNED(326, "尚未被扫描"),

    /**
     * 扫描成功
     */
    SCAN_SUCCESS(327, "扫描成功"),

    /**
     * 您已取消此次操作
     */
    CANCEL_OPERATION(328, "您已取消此次操作"),

    /**
     * 等待pc端完成初始操作
     */
    WAIT_COMPLETE_INITIAL(329, " 等待pc端完成初始操作"),

    /**
     * 创建微信会员失败
     */
    CREATE_WECHAT_MEMBER_ERROR(330, "创建微信会员失败"),

    /**
     * 更新微信会员失败
     */
    UPDATE_WECHAT_MEMBER_ERROR(331, "更新微信会员失败"),

    /**
     * 该手机号已被其他微信帐号绑定，请用其他方式进行登录
     */
    MOBILE_HAS_BOUND_WECHAT(332, "该手机号已被其他微信帐号绑定，请用其他方式进行登录"),

    /**
     * 该手机号已被其他钉钉帐号绑定，请用其他方式进行登录
     */
    MOBILE_HAS_BOUND_DINGTALK(332, "该手机号已被其他钉钉帐号绑定，请用其他方式进行登录"),

    /**
     * 该手机号已被其他QQ帐号绑定，请用其他方式进行登录
     */
    MOBILE_HAS_BOUND_TENCENT(332, "该手机号已被其他QQ帐号绑定，请用其他方式进行登录"),

    /**
     * 该手机号已被其他飞书账号绑定，请用其他方式进行登录
     */
    MOBILE_HAS_BOUND_FEISHU(332, "该手机号已被其他飞书账号绑定，请用其他方式进行登录"),

    /**
     * 用户检查失败
     */
    USER_CHECK_FAILED(333, "用户检查失败"),

    /**
     * 钉钉用户信息获取失败
     */
    DING_USER_UNKNOWN(334, "钉钉用户信息获取失败，请重新登录"),

    /**
     * 更新用户信息失败
     */
    UPDATE_USER_INFO_FAIL(335, "更新用户信息失败"),

    /**
     * 邀请码注册操作频繁
     */
    REGISTER_BY_INVITE_CODE_OPERATION_FREQUENTLY(336, "邀请码注册操作频繁, 请10秒重新尝试"),

    /**
     * 授权失败
     */
    AUTH_FAIL(337, "授权失败"),

    /**
     * 已绑定其他账号
     */
    USER_ALREADY_LINK_SAME_TYPE_ERROR(338, "已绑定其他账号"),

    /**
     * 维格账号已绑定其他企业微信账号
     */
    USER_ALREADY_LINK_SAME_TYPE_ERROR_WECOM(338, "维格账号已绑定其他企业微信账号"),

    /**
     * 用户账号必须得要有唯一凭证，需要绑定一个邮箱才能够解绑手机号
     */
    MUST_BIND_EAMIL(339, "用户账号必须得要有唯一凭证，需要绑定一个邮箱才能够解绑手机号"),

    /**
     * 用户账号必须得要有唯一凭证，需要绑定一个手机号才能够解绑邮箱
     */
    MUST_BIND_MOBILE(340, "用户账号必须得要有唯一凭证，需要绑定一个手机号才能够解绑邮箱"),

    /**
     * 用户设置不支持的语言类型
     */
    USER_LANGUAGE_SET_UN_SUPPORTED(341, "不支持的语言类型");

    private final Integer code;

    private final String message;
}
