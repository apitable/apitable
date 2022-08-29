package com.vikadata.api.modular.template.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 在线模版信息
 * </p>
 * @author zoe zheng
 * @date 2021/8/4 11:05 上午
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class OnlineTemplateDto {

    private String templateId;

    private String templateName;

    private String propertyCode;

    private String propertyName;

    private Integer propertyType;
}
