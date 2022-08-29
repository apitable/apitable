package com.vikadata.api.enums.exception;

import com.vikadata.core.exception.BaseException;

/**
 * <p>
 * V码相关异常状态码
 * 状态码范围（800-849）
 * </p>
 *
 * @author Chambers
 * @date 2020/8/12
 */
public enum VCodeException implements BaseException {

    /**
     * 活动不存在
     */
    ACTIVITY_NOT_EXIST(800, "活动不存在"),

    /**
     * 场景值已存在
     */
    SCENE_EXIST(800, "场景值已存在"),

    /**
     * 已生成二维码，场景值修改失败
     */
    QR_CODE_EXIST(800, "已生成二维码，场景值修改失败"),

    /**
     * 兑换券模板不存在
     */
    COUPON_TEMPLATE_NOT_EXIST(801, "兑换券模板不存在"),

    /**
     * 过期时间设置有误
     */
    EXPIRE_TIME_INCORRECT(802, "过期时间设置有误"),

    /**
     * 类型错误
     */
    TYPE_ERROR(802, "类型错误"),

    /**
     * 兑换码需选择兑换模板
     */
    TEMPLATE_EMPTY(802, "兑换码需选择兑换模板"),

    /**
     * 指定的手机账号未注册
     */
    ACCOUNT_NOT_REGISTER(802, "指定的手机账号未注册"),

    /**
     * V码可使用总数，单人限制使用次数不能为零
     */
    CANNOT_ZERO(802, "V码可使用总数，单人限制使用次数不能为零"),

    /**
     * V码不存在
     */
    CODE_NOT_EXIST(803, "V码不存在"),

    /**
     * 非兑换码类型，修改兑换模板失败
     */
    TYPE_INFO_ERROR(803, "非兑换码类型，修改兑换模板失败"),

    /**
     * 请输入邀请码
     */
    INVITE_CODE_NOT_EXIST(804, "请输入邀请码"),

    /**
     * 邀请码无效
     */
    INVITE_CODE_NOT_VALID(805, "邀请码无效"),

    /**
     * 邀请码已过期
     */
    INVITE_CODE_EXPIRE(805, "邀请码已过期"),

    /**
     * 邀请码已使用
     */
    INVITE_CODE_USED(805, "邀请码已使用"),

    /**
     * 请输入兑换码
     */
    REDEMPTION_CODE_NOT_EXIST(804, "请输入兑换码"),

    /**
     * 兑换码无效
     */
    REDEMPTION_CODE_NOT_VALID(805, "兑换码无效"),

    /**
     * 兑换码已过期
     */
    REDEMPTION_CODE_EXPIRE(805, "兑换码已过期"),

    /**
     * 兑换码已使用
     */
    REDEMPTION_CODE_USED(805, "兑换码已使用"),

    /**
     * 邀请码注册奖励失败
     */
    INVITE_CODE_REWARD_ERROR(805, "邀请码注册奖励失败"),

    /**
     * 邀请码使用注册频繁，请重试
     */
    INVITE_CODE_FREQUENTLY(805, "邀请码使用注册频繁，请重试");


    private final Integer code;

    private final String message;

    VCodeException(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    @Override
    public Integer getCode() {
        return this.code;
    }

    @Override
    public String getMessage() {
        return this.message;
    }
}
