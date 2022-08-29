package com.vikadata.core.exception;

/**
 * <p>
 * 基础异常规范接口
 * </p>
 *
 * @author Benson Cheung
 * @date 2019/9/4 16:38
 */
public interface BaseException {

    /**
     * 异常状态码
     *
     * @return Integer
     */
    Integer getCode();

    /**
     * 异常信息
     *
     * @return String
     */
    String getMessage();
}
