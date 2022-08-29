package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 响应基础结构
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/21 16:30
 */
@Setter
@Getter
@ToString
public class BaseResponse {

    private int code;

    private String msg;
}
