package com.vikadata.api.enums.exception;

import com.vikadata.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * automation 机器人相关
 * </p>
 *
 * @author feng penglong
 * @date 2021/09/23 19:18
 */
@Getter
@AllArgsConstructor
public enum AutomationException implements BaseException {

    /**
     * 单表机器人数量已到达上限
     */
    DST_ROBOT_LIMIT(1101, "单表机器人己达上限"),

    /**
     * 创建机器人请求重复
     */
    DST_ROBOT_REPEAT(1102, "请勿重复创建");

    private final Integer code;

    private final String message;
}
