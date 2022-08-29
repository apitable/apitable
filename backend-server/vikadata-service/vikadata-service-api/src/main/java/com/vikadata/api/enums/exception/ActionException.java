package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * ActionException
 * 非业务异常状态码，代表一些动作异常，比如短信、邮件、文件操作
 * 状态码范围（230-）
 *
 * @author Chambers
 * @since 2019/10/26
 */
@Getter
@AllArgsConstructor
public enum ActionException implements BaseException {

    /**
     * 非法请求验证码
     */
    ILLEGAL_CODE_SEND(230, "非法请求验证码"),

    /**
     * 非法请求验证码
     */
    MOBILE_SEND_MAX_COUNT_LIMIT(230, "此手机当天短信发送数上限"),

    /**
     * 当天邮件发送数上限
     */
    EMAIL_SEND_MAX_COUNT_LIMIT(230, "该邮箱今天邮件发送数已到达上限"),

    /**
     * 一分钟内重复获取
     */
    SMS_SEND_ONLY_ONE_MINUTE(230, "60秒内不能重复获取，请稍后再试"),

    /**
     * 验证码不能为空
     */
    CODE_EMPTY(231, "验证码不能为空"),

    /**
     * 当前验证码失效，请重新获取
     */
    CODE_ERROR_OFTEN(231, "当前验证码失效，请重新获取"),

    /**
     * 未获取验证码或已过期，请重新获取
     */
    CODE_EXPIRE(231, "未获取验证码或已过期，请重新获取"),

    /**
     * 验证码错误，请重新输入
     */
    CODE_ERROR(231, "验证码错误，请重新输入"),

    /**
     * 尚未通过验证码校验
     */
    NOT_PASS(232, "尚未通过验证码校验"),

    /**
     * 获取频繁
     */
    SEND_CAPTCHA_TOO_MUSH(233, "用户操作频繁，请20分钟后再试"),

    /**
     * 暂不支持上传 HTML 文件
     */
    FILE_NOT_SUPPORT_HTML(240, "暂不支持上传 HTML 文件"),

    /**
     * 文件为空
     */
    FILE_EMPTY(240, "文件不能为空"),

    /**
     * 文件内容错误
     */
    FILE_ERROR_CONTENT(240, "文件内容错误"),

    /**
     * 文件解析密码错误
     */
    FILE_ERROR_PASSWORD(240, "文件解析密码错误"),

    /**
     * 文件格式错误
     */
    FILE_ERROR_FORMAT(240, "文件格式错误"),

    /**
     * 文件需要打开权限密码
     */
    FILE_HAS_PASSWORD(240, "文件需要打开权限密码"),

    /**
     * 文件超过限制大小
     */
    FILE_EXCEED_LIMIT(240, "单次上传文件不要超过20MB哟~"),

    /**
     * 行数超过限制大小
     */
    ROW_EXCEED_LIMIT(240, "行数超过50000行限制"),

    /**
     * 列数超过限制大小
     */
    COLUMN_EXCEED_LIMIT(240, "列数超过200列限制"),

    /**
     * 超过附件空间上限
     */
    ATTACH_EXCEED_LIMIT(241, "超过附件空间上限"),

    /**
     * 文件不存在
     */
    FILE_NOT_EXIST(242, "文件不存在"),

    /**
     * 人机验证失败
     */
    MAN_MACHINE_VERIFICATION_FAILED(250, "人机验证失败"),

    /**
     * 二次验证
     */
    SECONDARY_VERIFICATION(251, "二次验证"),

    /**
     * 启用短信验证
     */
    ENABLE_SMS_VERIFICATION(252, "当前环境存在风险，请重新验证"),


    /**
     * 永中API请求失败，文件转预览失败
     */
    OFFICE_PREVIEW_API_FAILED(253, "永中API请求失败，文件转预览失败，请重新尝试"),

    /**
     * 文件无法获取预览URL地址
     */
    OFFICE_PREVIEW_GET_URL_FAILED(254, "文件无法获取预览URL地址，请重新尝试"),

    /**
     * 文件已损坏或被加密，无法预览
     */
    OFFICE_PREVIEW_DESTROYED_FAILED(255, "文件已损坏或被加密，无法预览，请重新尝试");

    private final Integer code;

    private final String message;
}
