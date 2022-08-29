package com.vikadata.api.modular.template.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 模板搜索结果
 * </p>
 * @author zoe zheng
 * @date 2021/8/4 11:05 上午
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class TemplateKeyWordSearchDto {

    private String templateId;

    private String templateName;

    private String propertyCode;

    private String propertyName;

    private Integer propertyType;

    /**
     * 模版名字是否包涵关键字
     */
    private Integer nameIndex;

    /**
     * 属性名字是否包涵关键字
     */
    private Integer propertyNameIndex;
}
