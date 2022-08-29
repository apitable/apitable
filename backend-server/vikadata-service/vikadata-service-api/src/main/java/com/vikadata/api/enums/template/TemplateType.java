package com.vikadata.api.enums.template;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 模版类型
 * </p>
 *
 * @author Chambers
 * @date 2020/5/20
 */
@Getter
@AllArgsConstructor
public enum TemplateType {

    /**
     * 官方
     */
    OFFICIAL(0),

    /**
     * 用户空间
     */
    SPACE(1),

    /**
     * 市场
     */
    MARKETPLACE(2);


    private int type;
}
